# 🏪 بيت المندي - Bait Al Mandi Menu System

**نظام منيو رقمي متكامل لمطعم بيت المندي** | **Complete Digital Menu System for Bait Al Mandi Restaurant**

نظام منيو تفاعلي يعمل داخل الشبكة المحلية (LAN) مع واجهة Glassmorphism جذابة، دعم كامل للغة العربية، لوحة تحكم شاملة، ونظام عروض ذكي.

An interactive digital menu system running on local network with stunning Glassmorphism UI, full Arabic/RTL support, comprehensive admin dashboard, and smart offers system.

---

## ✨ المميزات / Features

### 🎨 واجهة المستخدم / UI
- **Glassmorphism UI** - واجهة زجاجية عصرية مع تأثيرات الضبابية
- **Dark Mode** 🌙 - وضع ليلي/نهاري ديناميكي
- **RTL Support** - دعم كامل للغة العربية والاتجاه من اليمين لليسار
- **Islamic Pattern** - زخارف إسلامية في الخلفية
- **Responsive Design** - متجاوب مع جميع أحجام الشاشات
- **Loading Skeletons** - تأثيرات تحميل أنيقة
- **Live Preview** - معاينة حية للتغييرات في الإعدادات

### ⚙️ لوحة التحكم / Admin Dashboard
- **Dashboard** - لوحة تحكم بإحصائيات شاملة
- **Categories CRUD** - إدارة الأقسام (إضافة/تعديل/حذف)
- **Menu Items CRUD** - إدارة الأصناف مع الصور
- **Offers Management** - نظام عروض ذكي (نسبة مئوية / قيمة ثابتة)
- **Users Management** - إدارة المستخدمين (مدير / موظف)
- **Settings UI** - إعدادات مرئية (ألوان، خطوط، صور، رسالة ترحيب)

### 🛡️ الأمان / Security
- **JWT Authentication** - توثيق آمن باستخدام JWT
- **Role-Based Access** - صلاحيات مختلفة (Admin/Staff)
- **Password Hashing** - تشفير كلمات المرور بـ bcrypt (12 rounds)
- **HTTP Security Headers** - رؤوس أمان (CSP, XSS, etc.)
- **Input Validation** - التحقق من صحة المدخلات
- **Rate Limiting** - تحديد معدل الطلبات (Nginx)

### 🔌 API
- **RESTful API** - واجهة برمجة تطبيقات REST
- **File Upload** - رفع صور مع تحويل إلى WebP
- **Image Optimization** - تحسين الصور عبر Sharp
- **CORS Ready** - جاهز للعمل عبر الشبكة

---

## 🛠️ التقنيات / Tech Stack

| التقنية | Technology |
|---------|-----------|
| ![Next.js](https://img.shields.io/badge/Next.js-15.1-000000?logo=next.js) | Next.js 15 (App Router) |
| ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react) | React 19 |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript) | TypeScript 5.7 |
| ![Prisma](https://img.shields.io/badge/Prisma-6.1-2D3748?logo=prisma) | Prisma 6.1 (ORM) |
| ![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite) | SQLite |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss) | Tailwind CSS v4 |
| ![JWT](https://img.shields.io/badge/JWT-jose-000000?logo=jsonwebtokens) | jose (JWT) |
| ![Sharp](https://img.shields.io/badge/Sharp-0.33-99CC00?logo=sharp) | Sharp (Images) |

---

## 🚀 التشغيل السريع / Quick Start

### المتطلبات / Prerequisites
- Node.js 18+ (LTS 22.x recommended)
- npm 9+

### التثبيت والتشغيل / Install & Run
```bash
# 1. Clone or copy the project
git clone <repo-url> bait-al-mandi-menu
cd bait-al-mandi-menu

# 2. Install dependencies
npm install

# 3. Create database & seed data
npm run db:push
npm run db:seed

# 4. Start development server
npm run dev
```

الآن افتح المتصفح على: **http://localhost:3000** 🎉

Now open browser at: **http://localhost:3000** 🎉

### بيانات الدخول / Default Credentials
| المستخدم | User | كلمة المرور | Password | الدور | Role |
|-----------|------|-------------|---------|-------|------|
| `admin` | admin | `admin123` | admin123 | مدير | Admin |
| `staff` | staff | `staff123` | staff123 | موظف | Staff |

#### لوحة الإدارة / Admin Panel: **http://localhost:3000/admin/login**

---

## 📦 أوامر مهمة / Important Commands

| الأمر | Command | الوصف | Description |
|-------|---------|-------|-------------|
| `npm run dev` | Development | تشغيل الخادم التطويري | Start dev server |
| `npm run build` | Build | بناء المشروع للإنتاج | Build for production |
| `npm start` | Start | تشغيل خادم الإنتاج | Start production server |
| `npm run db:push` | Push DB | إنشاء/تحديث قاعدة البيانات | Push schema to DB |
| `npm run db:seed` | Seed DB | تعبئة البيانات الأولية | Seed initial data |
| `npm run db:studio` | Studio | فتح Prisma Studio | Open Prisma Studio |
| `npm run db:reset` | Reset DB | إعادة تعيين قاعدة البيانات | Reset & reseed DB |
| `npm test` | Test | تشغيل الاختبارات | Run tests |
| `npm run lint` | Lint | فحص الكود | Lint code |
| `npm run typecheck` | TypeCheck | فحص الأنواع | TypeScript check |
| `npm run backup` | Backup | نسخ احتياطي | Run backup |
| `npm run health` | Health | فحص الصحة | Health check |
| `npm run setup` | Setup | تثبيت كامل | Full setup |

---

## 📜 الترخيص / License

MIT License - مشروع مفتوح المصدر للاستخدام التجاري والشخصي.

---

## 🤝 المساهمة / Contributing

نرحب بمساهماتكم! يرجى اتباع الخطوات:
Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📱 QR Code

<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://menu.local" alt="QR Code" width="150"/>

**امسح الرمز للوصول إلى المنيو** | **Scan to view the menu**

`http://menu.local`

---

## 📞 الدعم / Support

- **GitHub Issues**: [Report issues](https://github.com/anomalyco/opencode/issues)
- **Email**: support@baitalmandi.com

---

> © 2026 بيت المندي - Bait Al Mandi. جميع الحقوق محفوظة. All rights reserved.
