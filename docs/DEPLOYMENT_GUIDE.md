# 🚀 دليل النشر - Deployment Guide

---

## 📋 متطلبات النظام / System Requirements

| المتطلب | Requirement | المواصفات | Spec |
|---------|-------------|-----------|------|
| **CPU** | CPU | 1+ cores (2 recommended) | 1+ نواة |
| **RAM** | RAM | 1GB+ (2GB recommended) | 1+ جيجابايت |
| **Storage** | Storage | 10GB+ free space | 10+ جيجابايت |
| **OS** | OS | **Ubuntu 22.04 LTS** or 24.04 LTS | أوبونتو |
| **Node.js** | Node.js | 18.x or 22.x LTS | نود جي إس |
| **Nginx** | Nginx | Latest stable | إن جينكس |
| **PM2** | PM2 | Latest | بي إم 2 |

---

## 🗺️ نظرة عامة على النشر / Deployment Overview

```
     Internet / Local Network
              │
              ▼
   ┌────────────────────┐
   │    Nginx (Port 80) │  ← Reverse proxy, static files, rate limiting
   │   menu.local:80    │
   └────────┬───────────┘
            │ proxy_pass http://127.0.0.1:3000
            ▼
   ┌────────────────────┐
   │  Next.js (Port 3000)│  ← Application server
   │  (Managed by PM2)  │
   └────────┬───────────┘
            │
            ▼
   ┌────────────────────┐
   │   SQLite Database  │  ← /var/www/bait-al-mandi/prisma/database.db
   │  (File-based)      │
   └────────────────────┘
```

---

## 📦 الخطوة 1: تحضير الخادم / Step 1: Server Preparation

### تحديث النظام / Update System
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip
```

### تثبيت Node.js 22 LTS / Install Node.js 22 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version   # v22.x
npm --version    # 10.x
```

### تثبيت Nginx / Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx  # Should show "active (running)"
```

### تثبيت PM2 / Install PM2
```bash
sudo npm install -g pm2
pm2 --version  # Should show version
```

### تثبيت أدوات إضافية / Install Additional Tools
```bash
# For QR code generation
sudo apt install -y qrencode

# For health checks
sudo apt install -y curl net-tools
```

---

## 📂 الخطوة 2: رفع الملفات / Step 2: Upload Files

### Option A: Git Clone
```bash
# Clone directly to server
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/your-org/bait-al-mandi-menu.git
cd bait-al-mandi-menu
```

### Option B: SCP from Local Machine
```bash
# From Windows PowerShell (on your local machine)
scp -r D:\baitalmandiproject\menusystem\* user@server-ip:/var/www/bait-al-mandi/

# Or compress first for faster transfer
# Windows: Compress-Archive -Path D:\baitalmandiproject\menusystem\* -DestinationPath menu.zip
scp menu.zip user@server-ip:/var/www/
ssh user@server-ip "cd /var/www && unzip menu.zip -d bait-al-mandi"
```

### إعداد الصلاحيات / Set Permissions
```bash
cd /var/www/bait-al-mandi

# Set ownership
sudo chown -R www-data:www-data .

# Set directory permissions
sudo find . -type d -exec chmod 755 {} \;
sudo find . -type f -exec chmod 644 {} \;

# Writable directories
sudo chmod 775 uploads/
sudo chmod 775 prisma/
sudo chmod 775 backups/
```

---

## ⚙️ الخطوة 3: إعداد البيئة / Step 3: Environment Setup

### إنشاء ملف البيئة / Create .env file
```bash
cd /var/www/bait-al-mandi

# Create .env from template
cat > .env << 'EOF'
DATABASE_URL="file:./database.db"
JWT_SECRET="generate-a-strong-random-secret-here"
NEXT_PUBLIC_SITE_URL="http://menu.local"
EOF
```

### إنشاء مفتاح JWT قوي / Generate Strong JWT Secret
```bash
# Generate a random 64-character secret
openssl rand -hex 32

# Or use this command and paste the output into .env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> **⚠️ مهم**: غير `JWT_SECRET` الافتراضي فوراً. استخدم مفتاحاً عشوائياً قوياً.

---

## 📦 الخطوة 4: تثبيت الاعتماديات / Step 4: Install Dependencies

```bash
cd /var/www/bait-al-mandi

# Install all dependencies (including devDependencies for build)
npm install

# If disk space is limited, you can use:
# npm install --production
# But note: Prisma needs devDependencies for generate
```

---

## 🔨 الخطوة 5: بناء المشروع / Step 5: Build Project

```bash
cd /var/www/bait-al-mandi
npm run build
```

**Output expected:**
```
✓ Compiled successfully
✓ Linting and checking completed
✓ Collecting page data ...
✓ Generating static pages ...
✓ Finalizing page optimization ...
```

---

## 🗄️ الخطوة 6: إعداد قاعدة البيانات / Step 6: Database Setup

```bash
cd /var/www/bait-al-mandi

# Push schema to database (creates tables)
npx prisma db push

# Seed initial data
npm run db:seed
```

**متوقع / Expected output:**
```
✅ Admin user created (admin / admin123)
✅ Staff user created (staff / staff123)
✅ Default settings created
✅ Sample categories & items created
✅ Sample offer created
```

---

## 🔄 الخطوة 7: إعداد PM2 / Step 7: PM2 Setup

### تشغيل التطبيق / Start Application
```bash
cd /var/www/bait-al-mandi

# Start with PM2
pm2 start npm --name "bait-al-mandi" -- start

# Verify
pm2 list
# Should show:
# ┌─────┬───────────────┬──────────┬─────────┬─────────┬──────────┬────────┐
# │ id  │ name          │ mode     │ status  │ cpu     │ memory   │
# ├─────┼───────────────┼──────────┼─────────┼─────────┼──────────┼────────┤
# │ 0   │ bait-al-mandi │ fork     │ online  │ 0%      │ 80.3MB   │
# └─────┴───────────────┴──────────┴─────────┴─────────┴──────────┴────────┘
```

### تشغيل PM2 مع النظام / PM2 Startup on Boot
```bash
# Save current process list
pm2 save

# Generate startup script (follow the instructions)
pm2 startup
```

Example output:
```
[PM2] Init System: systemd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u www-data --hp /var/www
```

**Run the command shown in the output!**

### إدارة PM2 / PM2 Management Commands
```bash
pm2 status                    # عرض حالة العمليات
pm2 logs bait-al-mandi        # عرض السجلات
pm2 logs bait-al-mandi --lines 100  # آخر 100 سطر
pm2 monit                     # مراقبة في الوقت الحقيقي
pm2 restart bait-al-mandi     # إعادة تشغيل
pm2 stop bait-al-mandi        # إيقاف
pm2 delete bait-al-mandi      # حذف من PM2
```

---

## 🌐 الخطوة 8: إعداد Nginx / Step 8: Nginx Setup

### نسخ ملف الإعدادات / Copy Config File
```bash
# Copy the provided nginx config
sudo cp /var/www/bait-al-mandi/nginx/menu.conf /etc/nginx/sites-available/menu

# Or create it manually:
sudo nano /etc/nginx/sites-available/menu
```

### تفعيل الموقع / Enable Site
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/menu /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t
# Should show: syntax is ok / test is successful

# Restart Nginx
sudo systemctl restart nginx
```

### إعدادات جدار الحماية / Firewall Configuration
```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## 🏠 الخطوة 9: إعداد DNS المحلي / Step 9: Local DNS Setup

### الطريقة الأولى: على الراوتر / Option A: Router DNS

1. ادخل إلى إعدادات الراوتر (192.168.1.1)
2. ابحث عن **Local DNS** أو **Static DNS**
3. أضف:
   - **Hostname**: `menu.local`
   - **IP Address**: `192.168.1.10` (IP الخادم الثابت)

### الطريقة الثانية: ملف hosts / Option B: hosts file

**على كل جهاز العميل / On each client device:**

**Windows:**
```
# افتح Notepad كمسؤول، ثم افتح:
C:\Windows\System32\drivers\etc\hosts

# أضف هذا السطر:
192.168.1.10  menu.local
```

**Linux/Mac:**
```bash
sudo nano /etc/hosts
# أضف:
192.168.1.10  menu.local
```

### الطريقة الثالثة: DNS الخادم نفسه / Option C: Local DNS Server

> للنشر المتقدم مع خادم DNS محلي (dnsmasq)

```bash
sudo apt install -y dnsmasq
sudo nano /etc/dnsmasq.conf
# أضف:
address=/menu.local/192.168.1.10

sudo systemctl restart dnsmasq
```

---

## 📱 الخطوة 10: إنشاء QR Code / Step 10: Generate QR Code

```bash
# Generate QR code for menu URL
qrencode -o /var/www/bait-al-mandi/public/qr-menu.png "http://menu.local"

# Generate QR code for admin panel
qrencode -o /var/www/bait-al-mandi/public/qr-admin.png "http://menu.local/admin"

# Verify files exist
ls -la /var/www/bait-al-mandi/public/qr-*.png
```

الآن يمكنك طباعة QR Code ووضعه على الطاولات.

---

## ✅ الخطوة 11: التحقق من التشغيل / Step 11: Verification

### فحص PM2 / Check PM2
```bash
pm2 status
pm2 show bait-al-mandi
```

### فحص Nginx / Check Nginx
```bash
sudo nginx -t
sudo systemctl status nginx
```

### فحص التطبيق / Check Application
```bash
# From the server itself
curl -s http://localhost:3000 | head -20
curl -s http://localhost:3000/api/settings | python3 -m json.tool

# From another device on the network
curl -s http://menu.local | head -20
```

### فحص Dashboard / Check Dashboard
افتح المتصفح وتأكد من:
1. ✅ **http://menu.local** ← صفحة المنيو الرئيسية
2. ✅ **http://menu.local/admin/login** ← صفحة تسجيل الدخول
3. ✅ سجل الدخول بـ `admin` / `admin123`
4. ✅ لوحة التحكم تظهر الإحصائيات
5. ✅ الأقسام والأصناف والعروض ظاهرة

### فحص شامل / Health Check
```bash
cd /var/www/bait-al-mandi
npm run health
```

---

## 🔒 الخطوة 12: إعدادات الأمان / Step 12: Security Hardening

### 1. تغيير كلمة المرور الافتراضية / Change Default Password
```bash
# تسجيل الدخول واذهب إلى:
# Admin → Users → تعديل المستخدم admin
# غيّر كلمة المرور فوراً
```

### 2. إخفاء إصدار Nginx / Hide Nginx Version
```bash
sudo nano /etc/nginx/nginx.conf
# أضف في http block:
server_tokens off;
```

### 3. تأمين SSH / SSH Hardening
```bash
sudo nano /etc/ssh/sshd_config
# غيّر:
PermitRootLogin no
PasswordAuthentication no  # استخدم مفاتيح SSH
Port 2222  # غيّر المنفذ الافتراضي

sudo systemctl restart sshd
```

### 4. استخدام HTTPS (اختياري) / HTTPS Setup (Optional)
> إذا كنت تريد الوصول من خارج الشبكة المحلية

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (requires public domain)
sudo certbot --nginx -d menu.baitalmandi.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

### 5. إعداد Fail2Ban / Install Fail2Ban
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 6. السجلات والمراقبة / Logs & Monitoring
```bash
# PM2 logs
pm2 logs bait-al-mandi

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System monitoring
htop  # Install: sudo apt install htop
```

---

## 🔧 استكشاف الأخطاء / Troubleshooting

### المشكلة: 502 Bad Gateway
```bash
# 1. Check if Next.js is running
pm2 status

# 2. Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# 3. Restart both
pm2 restart bait-al-mandi
sudo systemctl restart nginx
```

### المشكلة: 404 Not Found
```bash
# 1. Check Nginx config
sudo nginx -t

# 2. Check if site is enabled
ls -la /etc/nginx/sites-enabled/

# 3. Check static files exist
ls -la /var/www/bait-al-mandi/.next/
```

### المشكلة: قاعدة البيانات تالفة / Database corrupted
```bash
# 1. Backup current database
cp prisma/database.db prisma/database.db.backup

# 2. Reset and reseed
npm run db:reset
```

### المشكلة: PM2 لا يبدأ مع النظام / PM2 not starting on boot
```bash
# Regenerate startup script
pm2 startup
# Copy and run the command it outputs
pm2 save
```

### المشكلة: رفع الملفات يفشل / File upload fails
```bash
# Check upload directory permissions
ls -la /var/www/bait-al-mandi/uploads/
sudo chmod -R 775 uploads/
sudo chown -R www-data:www-data uploads/
```

### المشكلة: ذاكرة غير كافية / Out of memory
```bash
# Create swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 📝 قائمة التحقق النهائية / Final Checklist

- [ ] ✅ Node.js 22 LTS installed
- [ ] ✅ Nginx installed and running
- [ ] ✅ PM2 installed and configured
- [ ] ✅ Project files uploaded with correct permissions
- [ ] ✅ `.env` configured with strong JWT secret
- [ ] ✅ Dependencies installed (`npm install`)
- [ ] ✅ Project built (`npm run build`)
- [ ] ✅ Database created (`npm run db:push`)
- [ ] ✅ Seed data loaded (`npm run db:seed`)
- [ ] ✅ PM2 running the app
- [ ] ✅ Nginx configured and enabled
- [ ] ✅ DNS/local hosts configured
- [ ] ✅ QR Code generated
- [ ] ✅ Firewall configured (UFW)
- [ ] ✅ Default password changed
- [ ] ✅ Health check passed (`npm run health`)
- [ ] ✅ Can access menu from browser
- [ ] ✅ Can login to admin panel

---

> آخر تحديث: يونيو 2026 | Last Updated: June 2026
