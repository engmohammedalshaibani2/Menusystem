# 💾 دليل النسخ الاحتياطي - Backup Guide

---

## 📋 نظرة عامة / Overview

نظام النسخ الاحتياطي لمشروع بيت المندي يشمل:
The backup system for Bait Al Mandi project includes:

| المكون | Component | طريقة النسخ | Backup Method |
|--------|-----------|-------------|---------------|
| 🗄️ قاعدة البيانات | Database | نسخ ملف SQLite | SQLite file copy |
| 🖼️ الملفات المرفوعة | Uploads | نسخ مجلد uploads | Uploads folder |
| ⚙️ الإعدادات | Settings | موجودة في قاعدة البيانات | Stored in DB |
| 🔐 إعدادات البيئة | .env | نسخ يدوي منفصل | Manual separate copy |

---

## 📦 مكونات النسخ الاحتياطي / Backup Components

### 1. قاعدة البيانات / Database
- **الموقع**: `prisma/database.db`
- **الحجم التقريبي**: 50KB - 5MB (حسب عدد البيانات)
- **ملاحظة**: النسخ أثناء إيقاف التطبيق لضمان التكامل

### 2. الملفات المرفوعة / Uploaded Files
- **الموقع**: `uploads/`
- **المحتويات**: صور الأصناف، صور الأقسام، صور العروض، الشعار، الغلاف
- **الحجم**: يختلف حسب عدد الصور

### 3. ملفات الإعدادات / Configuration Files
- `.env` - المتغيرات البيئية
- `nginx/menu.conf` - إعدادات Nginx

---

## 🚀 سكربت النسخ الاحتياطي / Backup Script

```bash
#!/bin/bash
# scripts/backup.sh - سكربت النسخ الاحتياطي التلقائي

# ============================================
# إعدادات المسارات / Path Configuration
# ============================================
PROJECT_DIR="/var/www/bait-al-mandi"
BACKUP_DIR="/var/backups/bait-al-mandi"
DB_PATH="${PROJECT_DIR}/prisma/database.db"
UPLOADS_DIR="${PROJECT_DIR}/uploads"
ENV_FILE="${PROJECT_DIR}/.env"
NGINX_CONF="/etc/nginx/sites-available/menu"
RETENTION_DAYS=30
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_NAME="backup_${TIMESTAMP}"

# ============================================
# الألوان للطباعة / Colors for output
# ============================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================
# دوال مساعدة / Helper Functions
# ============================================
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_dependencies() {
    if ! command -v sqlite3 &> /dev/null; then
        log_warn "sqlite3 not found. Installing..."
        sudo apt install -y sqlite3
    fi
}

# ============================================
# إنشاء مجلد النسخ / Create Backup Directory
# ============================================
setup_backup_dir() {
    log_info "Creating backup directory: ${BACKUP_DIR}/${BACKUP_NAME}"
    mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}"
    log_info "✅ Backup directory created"
}

# ============================================
# نسخ قاعدة البيانات / Backup Database
# ============================================
backup_database() {
    log_info "Backing up database..."
    
    # التحقق من وجود قاعدة البيانات
    if [ ! -f "${DB_PATH}" ]; then
        log_error "Database file not found at ${DB_PATH}"
        return 1
    fi
    
    # التحقق من صحة قاعدة البيانات باستخدام integrity check
    local INTEGRITY_CHECK=$(sqlite3 "${DB_PATH}" "PRAGMA integrity_check;" 2>&1)
    if [ "${INTEGRITY_CHECK}" != "ok" ]; then
        log_error "Database integrity check failed: ${INTEGRITY_CHECK}"
        return 1
    fi
    log_info "✅ Database integrity check passed"
    
    # نسخ قاعدة البيانات
    cp "${DB_PATH}" "${BACKUP_DIR}/${BACKUP_NAME}/database.db"
    
    # الحصول على إحصائيات قاعدة البيانات
    local DB_SIZE=$(du -h "${DB_PATH}" | cut -f1)
    local TABLE_COUNT=$(sqlite3 "${DB_PATH}" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';")
    log_info "✅ Database backed up (Size: ${DB_SIZE}, Tables: ${TABLE_COUNT})"
    
    # حفظ مخطط قاعدة البيانات
    sqlite3 "${DB_PATH}" ".schema" > "${BACKUP_DIR}/${BACKUP_NAME}/database_schema.sql"
    log_info "✅ Database schema saved"
    
    return 0
}

# ============================================
# نسخ الملفات المرفوعة / Backup Uploads
# ============================================
backup_uploads() {
    log_info "Backing up uploaded files..."
    
    if [ ! -d "${UPLOADS_DIR}" ]; then
        log_warn "Uploads directory not found, skipping..."
        return 0
    fi
    
    # نسخ مجلد uploads
    cp -r "${UPLOADS_DIR}" "${BACKUP_DIR}/${BACKUP_NAME}/uploads"
    
    # إحصائيات
    local UPLOADS_SIZE=$(du -sh "${UPLOADS_DIR}" | cut -f1)
    local FILE_COUNT=$(find "${UPLOADS_DIR}" -type f | wc -l)
    log_info "✅ Uploads backed up (Size: ${UPLOADS_SIZE}, Files: ${FILE_COUNT})"
    
    return 0
}

# ============================================
# نسخ ملفات الإعدادات / Backup Config Files
# ============================================
backup_config() {
    log_info "Backing up configuration files..."
    
    # نسخ .env إذا وجد
    if [ -f "${ENV_FILE}" ]; then
        cp "${ENV_FILE}" "${BACKUP_DIR}/${BACKUP_NAME}/env.txt"
        log_info "✅ Environment file backed up"
    fi
    
    # نسخ إعدادات Nginx
    if [ -f "${NGINX_CONF}" ]; then
        cp "${NGINX_CONF}" "${BACKUP_DIR}/${BACKUP_NAME}/nginx.conf"
        log_info "✅ Nginx configuration backed up"
    fi
    
    return 0
}

# ============================================
# إنشاء ملف معلومات النسخة / Create Backup Manifest
# ============================================
create_manifest() {
    local MANIFEST="${BACKUP_DIR}/${BACKUP_NAME}/MANIFEST.txt"
    
    cat > "${MANIFEST}" << EOF
================================================================================
BAIT AL MANDI - BACKUP MANIFEST
================================================================================
Date:           $(date)
Server:         $(hostname)
Project:        Bait Al Mandi Menu System
Version:        2.0.0
Backup Path:    ${BACKUP_DIR}/${BACKUP_NAME}

DATABASE:
  File:         database.db
  Size:         $(du -h "${DB_PATH}" 2>/dev/null | cut -f1 || echo "N/A")

UPLOADS:
  Directory:    uploads/
  Size:         $(du -sh "${UPLOADS_DIR}" 2>/dev/null | cut -f1 || echo "N/A")
  Files:        $(find "${UPLOADS_DIR}" -type f 2>/dev/null | wc -l || echo "0")

SYSTEM:
  Hostname:     $(hostname)
  IP:           $(hostname -I | awk '{print $1}')
  Node.js:      $(node --version 2>/dev/null || echo "N/A")
  PM2 Status:   $(pm2 status 2>/dev/null | grep -c "online" || echo "0")
  Nginx Status: $(systemctl is-active nginx 2>/dev/null || echo "N/A")

FILES INCLUDED:
  $(ls -la "${BACKUP_DIR}/${BACKUP_NAME}/" | wc -l) files

================================================================================
EOF
    
    log_info "✅ Backup manifest created"
}

# ============================================
# ضغط النسخة / Compress Backup
# ============================================
compress_backup() {
    log_info "Compressing backup..."
    
    cd "${BACKUP_DIR}"
    tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}"
    
    if [ $? -eq 0 ]; then
        # حذف المجلد غير المضغوط
        rm -rf "${BACKUP_DIR}/${BACKUP_NAME}"
        log_info "✅ Backup compressed: ${BACKUP_NAME}.tar.gz"
        
        # الحصول على حجم الملف المضغوط
        local COMPRESSED_SIZE=$(du -h "${BACKUP_NAME}.tar.gz" | cut -f1)
        log_info "📦 Compressed size: ${COMPRESSED_SIZE}"
    else
        log_error "Compression failed"
        return 1
    fi
    
    return 0
}

# ============================================
# إدارة النسخ القديمة / Manage Old Backups
# ============================================
cleanup_old_backups() {
    log_info "Cleaning up backups older than ${RETENTION_DAYS} days..."
    
    local OLD_FILES=$(find "${BACKUP_DIR}" -name "backup_*.tar.gz" -mtime +${RETENTION_DAYS})
    local COUNT=$(echo "${OLD_FILES}" | grep -v "^$" | wc -l)
    
    if [ "${COUNT}" -gt 0 ]; then
        echo "${OLD_FILES}" | xargs rm -f
        log_info "✅ Removed ${COUNT} old backup(s)"
    else
        log_info "No old backups to clean"
    fi
}

# ============================================
# إرسال إشعار (اختياري) / Send Notification
# ============================================
send_notification() {
    local STATUS=$1
    local SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" 2>/dev/null | cut -f1)
    
    # يمكن إضافة إشعار عبر البريد الإلكتروني أو تيليغرام
    # Example: Telegram notification
    # curl -s "https://api.telegram.org/bot<TOKEN>/sendMessage" \
    #   -d "chat_id=<CHAT_ID>" \
    #   -d "text=Backup ${STATUS}: ${BACKUP_NAME} (${SIZE})"
    
    log_info "Notification sent (placeholder)"
}

# ============================================
# الدالة الرئيسية / Main Function
# ============================================
main() {
    echo ""
    echo "╔══════════════════════════════════════════════╗"
    echo "║     BAIT AL MANDI - BACKUP SYSTEM            ║"
    echo "╚══════════════════════════════════════════════╝"
    echo "Timestamp: ${TIMESTAMP}"
    echo ""
    
    # التحقق من الصلاحيات
    if [ "$EUID" -ne 0 ]; then 
        log_warn "Running as non-root user. Some operations may fail."
    fi
    
    # التحقق من الاعتماديات
    check_dependencies
    
    # إنشاء مجلد النسخ
    setup_backup_dir || exit 1
    
    # تنفيذ النسخ
    backup_database || log_warn "Database backup had issues"
    backup_uploads || log_warn "Uploads backup had issues"
    backup_config || log_warn "Config backup had issues"
    
    # إنشاء ملف المعلومات
    create_manifest
    
    # ضغط النسخة
    compress_backup || exit 1
    
    # تنظيف النسخ القديمة
    cleanup_old_backups
    
    # إشعار
    send_notification "SUCCESS"
    
    echo ""
    log_info "✅ Backup completed successfully!"
    echo ""
    echo "📁 Backup location: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
    echo ""
}

# تنفيذ السكربت
main
```

---

## 📅 جدولة النسخ الاحتياطي / Schedule Backups

### استخدام Cron / Using Cron

```bash
# فتح محرر Cron
sudo crontab -e

# أضف أحد السطور التالية:
```

#### جداول مقترحة / Suggested Schedules

| التكرار | Frequency | أمر Cron | Cron Command |
|---------|-----------|---------|--------------|
| **يومياً** (موصى به) | Daily (recommended) | `0 3 * * *` | الساعة 3 صباحاً |
| **كل 12 ساعة** | Every 12 hours | `0 */12 * * *` | كل 12 ساعة |
| **أسبوعياً** | Weekly | `0 3 * * 0` | كل أحد 3 صباحاً |

**مثال / Example:**
```bash
# نسخ يومياً في الساعة 3:00 صباحاً
0 3 * * * /var/www/bait-al-mandi/scripts/backup.sh >> /var/log/bait-al-mandi-backup.log 2>&1
```

### تفعيل الجدولة / Enable Scheduling

```bash
# إنشاء مجلد للسكربتات
mkdir -p /var/www/bait-al-mandi/scripts

# نسخ السكربت هناك
nano /var/www/bait-al-mandi/scripts/backup.sh
# (الصق محتوى السكربت أعلاه)

# اجعله قابلاً للتنفيذ
chmod +x /var/www/bait-al-mandi/scripts/backup.sh

# اختبر السكربت
sudo /var/www/bait-al-mandi/scripts/backup.sh

# أضف إلى Cron
sudo crontab -e
# أضف:
0 3 * * * /var/www/bait-al-mandi/scripts/backup.sh >> /var/log/bait-al-mandi-backup.log 2>&1

# تحقق من السجلات
tail -f /var/log/bait-al-mandi-backup.log
```

---

## ♻️ استعادة النسخ / Restore Backups

### استعادة كاملة / Full Restore

```bash
#!/bin/bash
# scripts/restore.sh - سكربت استعادة النسخ الاحتياطي

# ============================================
# إعدادات / Configuration
# ============================================
PROJECT_DIR="/var/www/bait-al-mandi"
BACKUP_DIR="/var/backups/bait-al-mandi"
BACKUP_FILE=$1  # المسار لملف النسخة

# ============================================
# التحقق من المدخلات / Validate Input
# ============================================
if [ -z "${BACKUP_FILE}" ]; then
    echo "Usage: $0 <backup-file.tar.gz>"
    echo "Available backups:"
    ls -lh "${BACKUP_DIR}"/*.tar.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "Error: Backup file not found: ${BACKUP_FILE}"
    exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║     BAIT AL MANDI - RESTORE SYSTEM           ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# تأكيد
echo "⚠️  WARNING: This will OVERWRITE current data!"
read -p "Are you sure you want to restore from ${BACKUP_FILE}? (yes/no): " CONFIRM
if [ "${CONFIRM}" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

echo ""
echo "Starting restore..."

# استخراج النسخة
TEMP_DIR=$(mktemp -d)
echo "📦 Extracting backup to ${TEMP_DIR}..."
tar -xzf "${BACKUP_FILE}" -C "${TEMP_DIR}"
EXTRACTED_DIR=$(find "${TEMP_DIR}" -maxdepth 2 -type d | tail -1)

# 1. إيقاف التطبيق
echo "🛑 Stopping application..."
pm2 stop bait-al-mandi

# 2. استعادة قاعدة البيانات
echo "🗄️ Restoring database..."
if [ -f "${EXTRACTED_DIR}/database.db" ]; then
    # نسخ احتياطي للقاعدة الحالية
    cp "${PROJECT_DIR}/prisma/database.db" "${PROJECT_DIR}/prisma/database.db.restore-backup"
    # استعادة القاعدة
    cp "${EXTRACTED_DIR}/database.db" "${PROJECT_DIR}/prisma/database.db"
    echo "✅ Database restored"
else
    echo "⚠️  No database found in backup"
fi

# 3. استعادة الملفات المرفوعة
echo "🖼️ Restoring uploaded files..."
if [ -d "${EXTRACTED_DIR}/uploads" ]; then
    cp -r "${EXTRACTED_DIR}/uploads/"* "${PROJECT_DIR}/uploads/" 2>/dev/null
    echo "✅ Uploads restored"
else
    echo "⚠️  No uploads found in backup"
fi

# 4. استعادة إعدادات Nginx
echo "🌐 Restoring Nginx config..."
if [ -f "${EXTRACTED_DIR}/nginx.conf" ]; then
    sudo cp "${EXTRACTED_DIR}/nginx.conf" "/etc/nginx/sites-available/menu"
    sudo nginx -t && sudo systemctl reload nginx
    echo "✅ Nginx config restored"
fi

# 5. إعادة تشغيل التطبيق
echo "🚀 Starting application..."
pm2 start bait-al-mandi

# تنظيف
rm -rf "${TEMP_DIR}"

echo ""
echo "✅ Restore completed successfully!"
echo "📁 Old database backup: prisma/database.db.restore-backup"
echo ""
```

### تشغيل الاستعادة / Run Restore

```bash
# عرض قائمة النسخ المتاحة
ls -lh /var/backups/bait-al-mandi/*.tar.gz

# استعادة من نسخة محددة
sudo /var/www/bait-al-mandi/scripts/restore.sh /var/backups/bait-al-mandi/backup_2026-06-15_03-00-01.tar.gz

# أو استعادة يدوية:
# 1. إيقاف التطبيق
pm2 stop bait-al-mandi

# 2. نسخ قاعدة البيانات
cp /var/backups/backup_xxx/database.db /var/www/bait-al-mandi/prisma/database.db

# 3. نسخ الملفات
cp -r /var/backups/backup_xxx/uploads/* /var/www/bait-al-mandi/uploads/

# 4. إعادة التشغيل
pm2 start bait-al-mandi
```

---

## 📁 استراتيجية النسخ / Backup Strategy

### الاحتفاظ بالنسخ / Retention Policy

| المدة | Period | عدد النسخ | Copies | التكرار | Frequency |
|-------|--------|-----------|--------|---------|-----------|
| آخر 7 أيام | Last 7 days | 7 | يومي | Daily |
| آخر 4 أسابيع | Last 4 weeks | 4 | أسبوعي | Weekly |
| آخر 6 أشهر | Last 6 months | 6 | شهري | Monthly |

### مواقع التخزين / Storage Locations

| المستوى | Level | الموقع | Location | الغرض | Purpose |
|---------|-------|---------|---------|--------|---------|
| محلي | Local | `/var/backups/bait-al-mandi/` | Local disk | استعادة سريعة |
| خارجي | External | USB drive / NAS | External storage | أمان إضافي |
| سحابي (اختياري) | Cloud (optional) | S3 / Google Drive | Cloud | كارثة شاملة |

### خطة التعافي / Recovery Plan

```
سيناريو 1: تلف قاعدة البيانات
  → استعادة من آخر نسخة يومية
  → وقت التعافي: ~5 دقائق

سيناريو 2: عطل في القرص الصلب
  → تثبيت خادم جديد
  → استعادة من نسخة خارجية
  → وقت التعافي: ~30-60 دقيقة

سيناريو 3: خطأ بشري (حذف بيانات)
  → استعادة من آخر نسخة قبل الخطأ
  → وقت التعافي: ~10 دقائق

سيناريو 4: كارثة شاملة
  → استعادة من نسخة سحابية إلى خادم جديد
  → وقت التعافي: ~1-2 ساعات
```

---

## 🛡️ أفضل الممارسات / Best Practices

### ✅ يومياً / Daily
- [ ] تحقق من سجلات النسخ: `tail -f /var/log/bait-al-mandi-backup.log`
- [ ] تأكد من نجاح النسخ اليومي
- [ ] تحقق من حجم النسخ لا ينمو بشكل غير طبيعي

### ✅ أسبوعياً / Weekly
- [ ] اختبر استعادة من نسخة احتياطية
- [ ] تحقق من سلامة قاعدة البيانات: `sqlite3 database.db "PRAGMA integrity_check;"`
- [ ] نظف النسخ القديمة يدوياً إذا لزم الأمر

### ✅ شهرياً / Monthly
- [ ] عمل نسخة احتياطية كاملة على وسيط خارجي
- [ ] مراجعة سياسة الاحتفاظ
- [ ] تحديث سكربت النسخ إذا تغيرت المسارات

### ✅ سنوياً / Yearly
- [ ] تدريب فريق جديد على إجراءات الاستعادة
- [ ] اختبار التعافي الكامل من الكوارث
- [ ] تحديث خطة التعافي

---

## 🔐 أمان النسخ الاحتياطي / Backup Security

```bash
# 1. تشفير النسخ (اختياري)
# تشفير النسخة باستخدام GPG
gpg --symmetric --cipher-algo AES256 backup_file.tar.gz
# ستحتاج إلى إدخال كلمة مرور للتشفير

# فك التشفير
gpg -d backup_file.tar.gz.gpg > backup_file.tar.gz

# 2. صلاحيات مجلد النسخ
sudo chmod 700 /var/backups/bait-al-mandi
sudo chown -R root:root /var/backups/bait-al-mandi

# 3. لا تحتفظ بنسخ من .env بدون تشفير
# ملف .env يحتوي على JWT_SECRET - شديد الحساسية!
```

---

## 📊 مراقبة النسخ / Backup Monitoring

```bash
# إنشاء سكريبت لمراقبة آخر نسخة
cat > /usr/local/bin/check-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/bait-al-mandi"
LATEST=$(ls -t "${BACKUP_DIR}"/*.tar.gz 2>/dev/null | head -1)

if [ -z "${LATEST}" ]; then
    echo "⚠️  No backups found!"
    exit 1
fi

# التحقق من عمر آخر نسخة
AGE=$(( ( $(date +%s) - $(stat -c %Y "${LATEST}") ) / 3600 ))
if [ "${AGE}" -gt 30 ]; then
    echo "⚠️  Last backup is ${AGE} hours old!"
    exit 1
fi

echo "✅ Latest backup: $(basename ${LATEST}) (${AGE} hours ago)"
echo "📦 Size: $(du -h "${LATEST}" | cut -f1)"
exit 0
EOF

chmod +x /usr/local/bin/check-backup.sh

# تشغيل الفحص
/usr/local/bin/check-backup.sh
```

---

> آخر تحديث: يونيو 2026 | Last Updated: June 2026
