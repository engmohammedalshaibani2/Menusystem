# 🗺️ خريطة المشروع - Project Map

## 📋 وصف المشروع / Project Description

**نظام منيو رقمي لمطعم بيت المندي** - نظام منيو تفاعلي يعمل داخل الشبكة المحلية (LAN) مع واجهة Glassmorphism، دعم كامل للغة العربية، لوحة تحكم كاملة، ونظام عروض ذكي.

**Bait Al Mandi Digital Menu System** - An interactive digital menu system running on local network with Glassmorphism UI, full Arabic/RTL support, complete admin dashboard, and smart offers system.

---

## 📁 هيكل المجلدات / Folder Structure

```
D:\BAITALMANDIPROJECT\MENUSYSTEM\
├── .env                          # Environment variables
├── .gitignore
├── next.config.ts                # Next.js configuration
├── next-env.d.ts
├── package.json                  # Dependencies & scripts
├── package-lock.json
├── postcss.config.mjs            # PostCSS config (Tailwind v4)
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.tsbuildinfo
│
├── prisma/
│   ├── schema.prisma             # Database schema (SQLite)
│   ├── seed.ts                   # Database seeder
│   └── database.db               # SQLite database file
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (RTL, Arabic)
│   │   ├── page.tsx              # Customer menu page
│   │   ├── globals.css           # Global styles (Glassmorphism)
│   │   ├── middleware.ts         # Auth middleware
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.tsx        # Admin layout with sidebar
│   │   │   ├── page.tsx          # Dashboard page
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # Admin login page
│   │   │   ├── categories/
│   │   │   │   └── page.tsx      # Categories CRUD
│   │   │   ├── menu-items/
│   │   │   │   └── page.tsx      # Menu items CRUD
│   │   │   ├── offers/
│   │   │   │   └── page.tsx      # Offers CRUD
│   │   │   ├── users/
│   │   │   │   └── page.tsx      # Users management
│   │   │   └── settings/
│   │   │       └── page.tsx      # Settings (colors, fonts, etc.)
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.ts    # POST /api/auth/login
│   │       │   ├── logout/route.ts   # POST /api/auth/logout
│   │       │   └── me/route.ts       # GET /api/auth/me
│   │       ├── categories/
│   │       │   ├── route.ts          # GET, POST /api/categories
│   │       │   └── [id]/route.ts     # GET, PUT, DELETE /api/categories/:id
│   │       ├── menu-items/
│   │       │   ├── route.ts          # GET, POST /api/menu-items
│   │       │   └── [id]/route.ts     # PUT, DELETE /api/menu-items/:id
│   │       ├── offers/
│   │       │   ├── route.ts          # GET, POST /api/offers
│   │       │   └── [id]/route.ts     # PUT, DELETE /api/offers/:id
│   │       ├── users/
│   │       │   ├── route.ts          # GET, POST /api/users
│   │       │   └── [id]/route.ts     # PUT, DELETE /api/users/:id
│   │       ├── settings/
│   │       │   └── route.ts          # GET, PUT /api/settings
│   │       └── uploads/
│   │           └── route.ts          # POST /api/upload (file upload)
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx      # Admin navigation sidebar
│   │   │   └── DashboardClient.tsx    # Dashboard stats display
│   │   ├── customer/
│   │   │   └── CustomerMenu.tsx      # Customer-facing menu UI
│   │   └── ui/
│   │       ├── Badge.tsx             # Badge component
│   │       ├── Button.tsx            # Button component
│   │       ├── Card.tsx              # Glass card component
│   │       ├── Modal.tsx             # Modal dialog component
│   │       ├── Skeleton.tsx          # Loading skeleton
│   │       └── Toast.tsx             # Toast notification system
│   │
│   └── lib/
│       ├── auth.ts                   # JWT auth utilities
│       ├── prisma.ts                 # Prisma client singleton
│       └── utils.ts                  # Utility functions
│
├── nginx/
│   └── menu.conf                     # Nginx production config
│
├── docs/                             # Documentation files
├── backups/                          # Backup directory (gitignored)
├── uploads/                          # Uploaded images (gitignored)
├── tests/                            # Test files
└── scripts/                          # Utility scripts
```

---

## 🎨 الهوية البصرية / Brand Identity

### الألوان الأساسية / Brand Colors
| اللون | Color | الرمز | Code | الاستخدام | Usage |
|-------|-------|------|------|-----------|-------|
| الأساسي | Primary | `#7A1E2B` | Deep Burgundy | الأزرار، العناوين، الشريط العلوي | Buttons, headings, header |
| الأساسي الداكن | Primary Dark | `#5A1520` | Dark Burgundy | الشريط الجانبي، التذييل | Sidebar, footer |
| الأساسي الفاتح | Primary Light | `#9A2636` | Light Burgundy | حالات التمييز | Hover states |
| الثانوي | Secondary | `#B33A3A` | Red | الأزرار الثانوية، التمييز | Secondary buttons, highlights |
| التمييز | Accent/Gold | `#EAD7B8` | Cream Gold | شارة التمييز، التبويزات | Featured badge, accents |
| الخلفية | Background | `#F8F4EE` | Warm Cream | خلفية الصفحة الرئيسية | Page background |
| النصوص | Text | `#3D1F24` | Dark Brown | النصوص الرئيسية | Primary text |
| الحدود | Border | `#D8C8B5` | Tan | الحدود والفواصل | Borders & dividers |

### الخطوط / Typography
| الخط | Font | الوزن | Weight | الاستخدام | Usage |
|------|------|-------|--------|-----------|-------|
| Cairo | Cairo | 700 Bold | Bold | العناوين الرئيسية | Main headings |
| Cairo | Cairo | 600 SemiBold | SemiBold | العناوين الفرعية | Subheadings |
| Cairo | Cairo | 400 Regular | Regular | النصوص الطويلة | Body text |
| Tajawal | Tajawal | 400/500/700 | Regular/Medium/Bold | النصوص البديلة | Alternative text |

### الشعار / Logo
- التنسيقات المدعومة: PNG, JPG, WEBP, SVG
- يتم رفعه من لوحة التحكم إلى `uploads/logo/`
- معاينة حية في صفحة الإعدادات

---

## 🛠️ التقنيات المستخدمة / Tech Stack

| التقنية | Technology | الإصدار | Version |
|---------|-----------|---------|---------|
| Next.js | Next.js | 15.1.x | App Router |
| React | React | 19.0.x | Server Components |
| Prisma | Prisma | 6.1.x | ORM |
| SQLite | SQLite | - | Database |
| Tailwind CSS | Tailwind CSS | 4.0.x | Styling |
| TypeScript | TypeScript | 5.7.x | Language |
| JWT (jose) | JWT (jose) | 5.9.x | Authentication |
| bcryptjs | bcryptjs | 2.4.x | Password hashing |
| Sharp | Sharp | 0.33.x | Image processing |
| Zod | Zod | 3.24.x | Validation |
| Vitest | Vitest | 2.1.x | Testing |
| TSX | TSX | 4.19.x | TypeScript execution |

---

## 🏗️ المعمارية / Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│              │     │              │     │              │     │              │     │              │
│   Client     │────▶│    Nginx     │────▶│   Next.js    │────▶│   Prisma     │────▶│    SQLite    │
│  (Browser)   │     │  (Reverse    │     │  (App Router)│     │   (ORM)      │     │  (Database)  │
│              │     │   Proxy)     │     │              │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
      │                                                           │
      │                                                           │
      ▼                                                           ▼
┌──────────────┐                                          ┌──────────────┐
│  Mobile /    │                                          │   Uploads    │
│  Tablet /    │                                          │   (Images)   │
│  Desktop     │                                          │              │
└──────────────┘                                          └──────────────┘
```

### شرح الطبقات / Layer Explanation

1. **Client Layer**: المتصفح على جهاز الزبون أو جهاز الكاشير - يدعم الهواتف والأجهزة اللوحية والحواسيب
2. **Nginx Layer**: خادم عكسي يوازن الأحمال ويخدم الملفات الثابتة ويوفر طبقة أمان إضافية
3. **Next.js Layer**: الخادم الرئيسي - يعالج الطلبات، يقدم الصفحات، يدير API
4. **Prisma Layer**: طبقة ORM تتعامل مع قاعدة البيانات
5. **SQLite Layer**: قاعدة البيانات المحلية بدون خادم منفصل

---

## 🔌 قائمة API Endpoints / API Endpoints List

| الطريقة | Method | المسار | Path | المصادقة | Auth |
|---------|--------|-------|-------|---------|------|
| POST | POST | `/api/auth/login` | ❌ | تسجيل الدخول |
| POST | POST | `/api/auth/logout` | ❌ | تسجيل الخروج |
| GET | GET | `/api/auth/me` | ✅ | معلومات المستخدم الحالي |
| GET | GET | `/api/categories` | ❌ | جميع الأقسام |
| POST | POST | `/api/categories` | ✅ | إضافة قسم |
| GET | GET | `/api/categories/:id` | ❌ | قسم محدد + أصنافه |
| PUT | PUT | `/api/categories/:id` | ✅ | تحديث قسم |
| DELETE | DELETE | `/api/categories/:id` | ✅ | حذف قسم |
| GET | GET | `/api/menu-items` | ❌ | جميع الأصناف |
| POST | POST | `/api/menu-items` | ✅ | إضافة صنف |
| PUT | PUT | `/api/menu-items/:id` | ✅ | تحديث صنف |
| DELETE | DELETE | `/api/menu-items/:id` | ✅ | حذف صنف |
| GET | GET | `/api/offers` | ❌ | جميع العروض |
| POST | POST | `/api/offers` | ✅ | إضافة عرض |
| PUT | PUT | `/api/offers/:id` | ✅ | تحديث عرض |
| DELETE | DELETE | `/api/offers/:id` | ✅ | حذف عرض |
| GET | GET | `/api/users` | ✅ (Admin) | جميع المستخدمين |
| POST | POST | `/api/users` | ✅ (Admin) | إضافة مستخدم |
| PUT | PUT | `/api/users/:id` | ✅ (Admin) | تحديث مستخدم |
| DELETE | DELETE | `/api/users/:id` | ✅ (Admin) | حذف مستخدم |
| GET | GET | `/api/settings` | ❌ | جميع الإعدادات |
| PUT | PUT | `/api/settings` | ✅ (Admin) | تحديث الإعدادات |
| POST | POST | `/api/upload` | ✅ | رفع ملف |

---

## 📄 قائمة الصفحات / Pages List

| المسار | Path | الوصف | Description |
|-------|------|-------|-------------|
| `/` | Home | صفحة المنيو الرئيسية للزبائن | Customer-facing menu |
| `/admin/login` | Admin Login | صفحة تسجيل دخول الإدارة | Admin login page |
| `/admin` | Dashboard | لوحة التحكم الرئيسية | Admin dashboard |
| `/admin/categories` | Categories | إدارة الأقسام | Categories CRUD |
| `/admin/menu-items` | Menu Items | إدارة الأصناف | Menu items CRUD |
| `/admin/offers` | Offers | إدارة العروض | Offers CRUD |
| `/admin/users` | Users | إدارة المستخدمين | Users management |
| `/admin/settings` | Settings | إعدادات المطعم | Restaurant settings |

---

## 🧩 مكونات UI / UI Components

### أساسية / Base
| المكون | Component | الوظيفة | Function |
|--------|-----------|---------|----------|
| `Badge` | Badge | عرض علامات الحالة (نجاح/خطأ/تحذير) | Status badges |
| `Button` | Button | أزرار بأنماط متعددة | Multi-style buttons |
| `Card` | Card | بطاقة Glassmorphism قابلة لإعادة الاستخدام | Reusable glass card |
| `Modal` | Modal | نافذة منبثقة مع خلفية ضبابية | Overlay modal |
| `Skeleton` | Skeleton | تأثير تحميل متحرك | Loading shimmer |
| `Toast` | Toast | نظام إشعارات منبثقة | Toast notification system |

### إدارية / Admin
| المكون | Component | الوظيفة | Function |
|--------|-----------|---------|----------|
| `AdminSidebar` | AdminSidebar | شريط جانبي للوحة التحكم | Admin navigation sidebar |
| `DashboardClient` | DashboardClient | عرض إحصائيات لوحة التحكم | Dashboard stats display |

### زبائن / Customer
| المكون | Component | الوظيفة | Function |
|--------|-----------|---------|----------|
| `CustomerMenu` | CustomerMenu | المنيو الرئيسي للزبائن مع العروض والتصنيفات | Main customer menu |

---

## 🚀 تعليمات التشغيل السريع / Quick Start

### Windows
```bash
npm install              # تثبيت الاعتماديات
npm run db:push          # إنشاء قاعدة البيانات
npm run db:seed          # تعبئة البيانات الأولية
npm run dev              # تشغيل الخادم التطويري (http://localhost:3000)
```

### Ubuntu Server
```bash
npm install              # تثبيت الاعتماديات
npm run build            # بناء المشروع
npm run db:push          # إنشاء قاعدة البيانات
npm run db:seed          # تعبئة البيانات الأولية
pm2 start npm -- start   # تشغيل بخدمة PM2
```

### بيانات الدخول الافتراضية / Default Credentials
| المستخدم | User | كلمة المرور | Password | الصلاحية | Role |
|-----------|------|------------|---------|---------|------|
| `admin` | admin | `admin123` | admin123 | مدير | Admin |
| `staff` | staff | `staff123` | staff123 | موظف | Staff |

---

## 🔗 روابط مفيدة / Useful Links

- **المشروع**: `http://menu.local` (بعد إعداد DNS المحلي)
- **لوحة التحكم**: `http://menu.local/admin`
- **قاعدة البيانات**: `npm run db:studio` (Prisma Studio)

---

> آخر تحديث: يونيو 2026 | Last Updated: June 2026
