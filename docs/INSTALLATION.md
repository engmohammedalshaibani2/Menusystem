# 🔧 دليل التثبيت الكامل - Installation Guide

---

## 📋 المتطلبات الأساسية / Prerequisites

### المشتركة / Common
| المتطلب | Requirement | الإصدار الأدنى | Minimum Version |
|---------|-------------|----------------|-----------------|
| Node.js | Node.js | 18.x (LTS 22.x) | Recommended |
| npm | npm | 9.x | Included with Node |

---

## 🪟 Windows (Local Development)

### 1. تثبيت Node.js LTS / Install Node.js LTS

```powershell
# Download from official site:
# https://nodejs.org/ (LTS version 22.x recommended)
```

تحقق من التثبيت / Verify installation:
```powershell
node --version
npm --version
```

### 2. نسخ المشروع / Clone the Project

```powershell
# Option A: Git clone
git clone https://github.com/your-org/bait-al-mandi-menu.git
cd bait-al-mandi-menu

# Option B: Copy from source
# انسخ مجلد المشروع إلى المسار المطلوب
```

### 3. تثبيت الاعتماديات / Install Dependencies

```powershell
npm install
```

### 4. إنشاء قاعدة البيانات / Create Database

```powershell
npm run db:push
```

### 5. تعبئة البيانات الأولية / Seed Database

```powershell
npm run db:seed
```

**سوف يتم إنشاء:**
- مستخدم مدير: `admin` / `admin123`
- مستخدم موظف: `staff` / `staff123`
- 3 أقسام: المندي، المشاوي، المشروبات
- 7 أصناف نموذجية
- عرض عائلي: خصم 15%
- الإعدادات الافتراضية (الألوان، الخطوط)

### 6. تشغيل الخادم التطويري / Start Dev Server

```powershell
npm run dev
```

الآن افتح المتصفح على:
- **المنيو**: http://localhost:3000
- **لوحة الإدارة**: http://localhost:3000/admin/login

---

## 🐧 Ubuntu Server (Production)

### 1. تحديث النظام / Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. تثبيت Node.js LTS / Install Node.js LTS

```bash
# Using NodeSource (LTS 22.x)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version   # v22.x
npm --version    # 10.x
```

### 3. تثبيت Nginx / Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 4. تثبيت PM2 / Install PM2

```bash
sudo npm install -g pm2
pm2 --version
```

### 5. رفع الملفات / Upload Files

```bash
# Option A: Git clone
git clone https://github.com/your-org/bait-al-mandi-menu.git /var/www/bait-al-mandi
cd /var/www/bait-al-mandi

# Option B: SCP from local
# From Windows PowerShell:
scp -r D:\baitalmandiproject\menusystem\* user@server-ip:/var/www/bait-al-mandi/
```

### 6. إعداد الصلاحيات / Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/bait-al-mandi
sudo chmod -R 755 /var/www/bait-al-mandi
sudo chmod 775 /var/www/bait-al-mandi/uploads
sudo chmod 775 /var/www/bait-al-mandi/backups
```

### 7. تثبيت الاعتماديات / Install Dependencies

```bash
cd /var/www/bait-al-mandi
npm install --production
# or install all (for prisma):
npm install
```

### 8. بناء المشروع / Build Project

```bash
npm run build
```

### 9. إنشاء قاعدة البيانات / Create Database

```bash
npm run db:push
npm run db:seed
```

### 10. إعداد PM2 / Setup PM2

```bash
pm2 start npm --name "bait-al-mandi" -- start
pm2 save
pm2 startup  # Follow the instructions to enable PM2 on boot
```

### 11. إعداد Nginx / Setup Nginx

Copy the Nginx config:
```bash
sudo cp /var/www/bait-al-mandi/nginx/menu.conf /etc/nginx/sites-available/menu
sudo ln -s /etc/nginx/sites-available/menu /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
```

Verify Nginx config:
```bash
sudo nginx -t
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

### 12. إعداد البيئة / Configure Environment

```bash
# Edit the .env file
nano /var/www/bait-al-mandi/.env
```

Make sure `.env` contains:
```env
DATABASE_URL="file:./database.db"
JWT_SECRET="change-this-to-a-strong-secret-key"
NEXT_PUBLIC_SITE_URL="http://menu.local"
```

### 13. أول تسجيل دخول / First Login

1. افتح المتصفح على `http://menu.local`
2. اذهب إلى `http://menu.local/admin/login`
3. سجل الدخول بـ:
   - **User**: `admin`
   - **Password**: `admin123`
4. غيّر كلمة المرور فوراً من صفحة المستخدمين

---

## 🌐 إعدادات الشبكة / Network Setup

### إعدادات Router / Router Configuration

1. **ادخل إلى لوحة تحكم الراوتر** (عادةً 192.168.1.1)
2. **Assign Static IP** للخادم:
   - اذهب إلى DHCP Reservation
   - اختر MAC address جهاز الخادم
   - عيّن IP ثابت: `192.168.1.10` (أو أي IP تفضل)
3. **Port Forwarding** (اختياري - للوصول من خارج الشبكة):
   - Port 80 → 192.168.1.10:80

### DHCP ثابت / Static DHCP

| الإعداد | Setting | القيمة | Value |
|---------|---------|-------|-------|
| IP Address | IP Address | `192.168.1.10` | |
| Subnet Mask | Subnet Mask | `255.255.255.0` | |
| Gateway | Gateway | `192.168.1.1` | |
| DNS | DNS | `192.168.1.10` (للإعداد المحلي) | |

### DNS المحلي / Local DNS

**Option A: Router DNS**
- اذهب إلى Local DNS / Static DNS في الراوتر
- أضف: `menu.local` → `192.168.1.10`

**Option B: Hosts file (لكل جهاز)**
- **Windows**: تعديل `C:\Windows\System32\drivers\etc\hosts`
- **Linux/Mac**: تعديل `/etc/hosts`
- أضف السطر: `192.168.1.10  menu.local`

### QR Code

```bash
# Install qrencode on Ubuntu
sudo apt install -y qrencode

# Generate QR code for menu URL
qrencode -o /var/www/bait-al-mandi/public/qr-menu.png "http://menu.local"
```

ضع الرمز في:
- طاولات المطعم
- الكاونتر
- واجهة المحل
- منيو ورقية

---

## 🐳 Docker (Alternative)

> قريباً - Docker support coming soon.

---

## 🔍 استكشاف الأخطاء / Troubleshooting

### المشكلة: المنفذ مشغول / Port in use
```powershell
# Windows - find process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux
sudo lsof -i :3000
sudo kill -9 <PID>
```

### المشكلة: خطأ في قاعدة البيانات / Database error
```bash
# Reset database
npm run db:reset
```

### المشكلة: PM2 لا يعمل / PM2 not working
```bash
pm2 list
pm2 logs bait-al-mandi
pm2 restart bait-al-mandi
```

### المشكلة: Nginx 502 Bad Gateway
```bash
# Check if Next.js is running
pm2 list

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

> آخر تحديث: يونيو 2026 | Last Updated: June 2026
