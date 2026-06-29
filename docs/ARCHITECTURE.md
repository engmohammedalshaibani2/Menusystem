# 🏗️ المعمارية التقنية - Technical Architecture

---

## 📐 المعمارية العامة / System Architecture

```
                   ┌─────────────────────────────────────────────────────┐
                   │                   Client Layer                      │
                   │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
                   │  │ Desktop  │  │  Tablet  │  │  Mobile  │         │
                   │  │ Browser  │  │  Browser │  │  Browser │         │
                   │  └────┬─────┘  └────┬─────┘  └────┬─────┘         │
                   │       │             │             │               │
                   └───────┼─────────────┼─────────────┼───────────────┘
                           │             │             │
                           │         HTTP/HTTPS        │
                           ▼             ▼             ▼
                   ┌─────────────────────────────────────────────────────┐
                   │                Network Layer (LAN)                  │
                   │         Router / Switch / DNS / DHCP                │
                   └─────────────────────┬───────────────────────────────┘
                                         │
                   ┌─────────────────────▼───────────────────────────────┐
                   │               Reverse Proxy Layer                   │
                   │                                                      │
                   │  ┌──────────────────────────────────────────────┐   │
                   │  │                  Nginx                       │   │
                   │  │                                              │   │
                   │  │  • Static files: /_next/static (365d cache)  │   │
                   │  │  • Uploads: /uploads (30d cache)             │   │
                   │  │  • Rate limiting: 30 req/s per IP            │   │
                   │  │  • Security headers (XSS, CSP, etc.)         │   │
                   │  │  • Block sensitive paths (/prisma, /node_*)  │   │
                   │  │  • Proxy pass to Next.js on port 3000        │   │
                   │  └─────────────────────┬────────────────────────┘   │
                   └────────────────────────┼────────────────────────────┘
                                            │
                   ┌────────────────────────▼────────────────────────────┐
                   │               Application Layer                     │
                   │                                                      │
                   │  ┌──────────────────────────────────────────────┐   │
                   │  │              Next.js 15 (Server)             │   │
                   │  │                                              │   │
                   │  │  ┌────────────┐  ┌────────────┐             │   │
                   │  │  │ App Router │  │  API Routes│             │   │
                   │  │  │  (SSR/SSG) │  │  (REST)    │             │   │
                   │  │  └────────────┘  └────────────┘             │   │
                   │  │                                              │   │
                   │  │  ┌──────────────────────────────────────┐   │   │
                   │  │  │      Server Actions (experimental)     │   │   │
                   │  │  └──────────────────────────────────────┘   │   │
                   │  └─────────────────────┬────────────────────────┘   │
                   └────────────────────────┼────────────────────────────┘
                                            │
                   ┌────────────────────────▼────────────────────────────┐
                   │               Data Access Layer                     │
                   │                                                      │
                   │  ┌──────────────────────────────────────────────┐   │
                   │  │                Prisma ORM                    │   │
                   │  │                                              │   │
                   │  │  • Schema validation & type generation       │   │
                   │  │  • Query optimization & relation handling    │   │
                   │  │  • Migration management                      │   │
                   │  │  • Connection pooling (global singleton)     │   │
                   │  └─────────────────────┬────────────────────────┘   │
                   └────────────────────────┼────────────────────────────┘
                                            │
                   ┌────────────────────────▼────────────────────────────┐
                   │               Storage Layer                         │
                   │                                                      │
                   │  ┌──────────────────┐  ┌────────────────────────┐   │
                   │  │     SQLite       │  │  File System           │   │
                   │  │  (database.db)   │  │  (uploads/ images)     │   │
                   │  │                  │  │                        │   │
                   │  │  • Relational DB │  │  • Menu item images    │   │
                   │  │  • ACID compliant│  │  • Category images     │   │
                   │  │  • No server req │  │  • Offer images        │   │
                   │  │  • File-based    │  │  • Restaurant logo     │   │
                   │  └──────────────────┘  │  • Cover image         │   │
                   │                        └────────────────────────┘   │
                   └──────────────────────────────────────────────────────┘
```

---

## 🔄 تدفق الطلب / Request Flow

### Customer Viewing Menu - سيناريو: زبون يشاهد المنيو

```
     Client                    Next.js                     Prisma            SQLite
       │                         │                           │                 │
       │  GET /                  │                           │                 │
       │────────────────────────▶│                           │                 │
       │                         │                           │                 │
       │                         │  Server Component         │                 │
       │                         │  • getSettings()          │                 │
       │                         │───────────────────────────▶                │
       │                         │                           │  SELECT * FROM  │
       │                         │                           │  setting        │
       │                         │                           │────────────────▶│
       │                         │                           │◀────────────────│
       │                         │◀───────────────────────────                │
       │                         │                           │                 │
       │                         │  • prisma.category        │                 │
       │                         │    .findMany()            │                 │
       │                         │───────────────────────────▶                │
       │                         │                           │  SELECT * FROM  │
       │                         │                           │  category       │
       │                         │                           │  JOIN menuItem  │
       │                         │                           │────────────────▶│
       │                         │                           │◀────────────────│
       │                         │◀───────────────────────────                │
       │                         │                           │                 │
       │                         │  • prisma.offer           │                 │
       │                         │    .findMany()            │                 │
       │                         │───────────────────────────▶                │
       │                         │                           │  SELECT * FROM  │
       │                         │                           │  offer          │
       │                         │                           │  JOIN offerItem │
       │                         │                           │────────────────▶│
       │                         │                           │◀────────────────│
       │                         │◀───────────────────────────                │
       │                         │                           │                 │
       │  Rendered HTML + CSS    │                           │                 │
       │◀────────────────────────│                           │                 │
       │                         │                           │                 │
```

### Admin Login - سيناريو: مدير يسجل دخول

```
     Client                    Next.js                     Prisma            SQLite
       │                         │                           │                 │
       │  POST /api/auth/login   │                           │                 │
       │  {username, password}   │                           │                 │
       │────────────────────────▶│                           │                 │
       │                         │                           │                 │
       │                         │  prisma.user.findUnique   │                 │
       │                         │───────────────────────────▶                │
       │                         │                           │────────────────▶│
       │                         │                           │◀────────────────│
       │                         │◀───────────────────────────                │
       │                         │                           │                 │
       │                         │  bcrypt.compare(password, │                 │
       │                         │         hash)             │                 │
       │                         │                           │                 │
       │                         │  jose.SignJWT(payload)    │                 │
       │                         │  → Set-Cookie: session    │                 │
       │                         │                           │                 │
       │  {success: true,        │                           │                 │
       │   role: "admin"}        │                           │                 │
       │◀────────────────────────│                           │                 │
       │                         │                           │                 │
```

---

## 📁 شرح طبقة الملفات / Layer Details

### 1️⃣ Client Layer (المتصفح)
- **Framework**: HTML/CSS/JS rendered by Next.js
- **Features**: 
  - Server-Side Rendering (SSR) for the customer menu
  - Client-side rendering for admin pages (CSR with `"use client"`)
  - RTL support with `dir="rtl"` on `<html>`
  - Google Fonts: Cairo (headings), Tajawal (body), Montserrat (English)
  - Glassmorphism via CSS `backdrop-filter: blur()`
  - Islamic pattern background via SVG data URL

### 2️⃣ Network Layer (الشبكة)
- **Protocol**: HTTP/1.1 over LAN
- **Addressing**: Static IP or `menu.local` DNS
- **Security**: Internal network only (no public exposure required)
- **QR Code**: Easy access for customers

### 3️⃣ Reverse Proxy Layer (Nginx)
- **Purpose**: 
  - Serve as reverse proxy
  - Cache static assets aggressively
  - Rate limiting (30 requests/second)
  - Block sensitive paths
  - Add security headers
- **Config location**: `nginx/menu.conf`
- **Static file caching**:
  - `/_next/static`: 365 days (immutable)
  - `/uploads`: 30 days

### 4️⃣ Application Layer (Next.js)
- **Framework**: Next.js 15 with App Router
- **Rendering Strategies**:
  - **Customer menu** (`/`): Dynamic SSR (`force-dynamic`)
  - **Admin pages**: Client-side rendering (`"use client"`)
  - **API routes**: Edge-ready serverless functions
- **Server Actions**: Enabled for file uploads (10MB limit)
- **Middleware**: JWT verification for `/admin/*` routes (except `/admin/login`)
- **Image Handling**: Unoptimized mode (for local network performance)

### 5️⃣ Data Access Layer (Prisma)
- **ORM**: Prisma 6.1 with SQLite provider
- **Features**:
  - Auto-generated TypeScript types
  - Relation management (Category → MenuItem, Offer → OfferItem)
  - Cascading deletes
  - Global singleton connection (dev mode hot-reload safe)
- **Schema**: `prisma/schema.prisma` (5 models)

### 6️⃣ Storage Layer (SQLite + File System)

#### SQLite Database
- **File**: `prisma/database.db`
- **Zero-configuration**: No separate database server needed
- **ACID compliant**: Atomic, Consistent, Isolated, Durable
- **Backup**: Simple file copy

#### File System
- **Uploads directory**: `/uploads` (gitignored)
- **Image processing**: Sharp library for resize + WebP conversion
- **Original SVGs**: Kept as-is (for logos)
- **Max file size**: 5MB
- **Allowed types**: JPEG, PNG, WebP, SVG

---

## 🎯 مبررات الاختيارات التقنية / Technical Decisions Rationale

### لماذا SQLite وليس PostgreSQL أو MySQL؟

| الميزة | SQLite | PostgreSQL/MySQL |
|--------|--------|------------------|
| **الإعداد** | بدون إعداد خادم منفصل | يتطلب تثبيت وإدارة خادم |
| **النسخ الاحتياطي** | نسخ ملف واحد | يتطلب أدوات خاصة (pg_dump) |
| **الأداء** | ممتاز للقراءة والكتابة المحلية | ممتاز للاتصالات المتزامنة العالية |
| **حجم البيانات** | مناسب لـ < 10GB | مناسب لأي حجم |
| **الصيانة** | صيانة صفرية | تحديثات دورية، ضبط أداء |
| **للمطعم** | ✨ مثالي - عدد اتصالات محدود | overkill للمشاريع الصغيرة |

**الخلاصة**: لمطعم يستخدم النظام محلياً مع عدد زوار محدود (عشرات الأجهزة)، SQLite هو الخيار الأمثل - لا يحتاج خادم منفصل، النسخ الاحتياطي بنسخ ملف واحد، ولا يحتاج صيانة.

### لماذا Nginx مع Next.js؟

1. **Static files**: Nginx يخدم الملفات الثابتة بكفاءة أعلى من Node.js
2. **Caching**: تحكم دقيق بسياسات التخزين المؤقت
3. **Rate Limiting**: حماية API من الإساءة
4. **Security**: حماية المسارات الحساسة وإضافة رؤوس أمان
5. **SSL termination**: سهولة إضافة HTTPS (عند الحاجة)

### لماذا JWT وليس Sessions؟

1. **Stateless**: لا حاجة لتخزين الجلسات في قاعدة البيانات
2. **Scalability**: يمكن تشغيل خوادم متعددة بدون مشاركة الجلسات
3. **HTTP-only cookies**: آمن ضد XSS
4. **Expiration**: صلاحية 24 ساعة مع تحديث تلقائي

### لماذا Glassmorphism؟

1. **جمالية عصرية**: واجهة زجاجية جذابة تناسب المطاعم الفاخرة
2. **خفيف على الأداء**: يستخدم `backdrop-filter` المدعوم في جميع المتصفحات الحديثة
3. **مرونة**: يعمل مع أي ألوان وخلفيات
4. **تجربة مستخدم**: طبقات متعددة تعطي عمقاً بصرياً

---

## 📊 تدفق البيانات / Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Admin Dashboard                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  Categories  │  │  Menu Items  │  │   Offers     │  │  Settings  │ │
│  │  CRUD        │  │  CRUD        │  │  CRUD        │  │  Editor    │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │
│         │                 │                 │                │        │
└─────────┼─────────────────┼─────────────────┼────────────────┼────────┘
          │                 │                 │                │
          ▼                 ▼                 ▼                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             API Layer                                   │
│         /api/categories    /api/menu-items    /api/offers  /api/settings│
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            Prisma ORM                                   │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   User   │  │ Category │  │MenuItem  │  │  Offer   │  │ Setting  │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                                    │                                    │
│                                    ▼                                    │
│                           OfferItem (M:N)                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SQLite Database                                 │
│                        database.db                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 تدفق التوثيق / Auth Flow

```
                    ┌──────────────┐
                    │  Client      │
                    │  Browser     │
                    └──────┬───────┘
                           │ POST /api/auth/login
                           │ {username, password}
                           ▼
                    ┌──────────────┐
                    │   Next.js    │
                    │   API Route  │
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
      ┌──────────────────┐  ┌──────────────────┐
      │  Find user in DB │  │  bcrypt.compare  │
      │  prisma.user     │  │  (password, hash)│
      │  .findUnique     │  │                  │
      └──────────────────┘  └──────────────────┘
                │                     │
                └──────────┬──────────┘
                           │ Valid credentials
                           ▼
                    ┌──────────────┐
                    │  jose.SignJWT│
                    │  HS256       │
                    │  24h expiry  │
                    └──────┬───────┘
                           │ Set-Cookie: session=<JWT>
                           │ httpOnly, secure, sameSite=lax
                           ▼
                    ┌──────────────┐
                    │   Client     │
                    │  (redirect   │
                    │   to /admin) │
                    └──────────────┘

         Subsequent requests:
         Cookie: session=<JWT>
                │
                ▼
         ┌──────────────┐
         │  Middleware   │
         │  verifyToken │
         └──────┬───────┘
                │ Valid? → Continue
                │ Invalid → Redirect to /admin/login
                ▼
         ┌──────────────┐
         │  API/Page    │
         │  requireAuth │
         │  requireAdmin│
         └──────────────┘
```

---

> آخر تحديث: يونيو 2026 | Last Updated: June 2026
