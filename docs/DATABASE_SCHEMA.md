# 🗄️ مخطط قاعدة البيانات - Database Schema

---

## 📊 ERD / Entity Relationship Diagram

```
┌──────────────────────┐       ┌──────────────────────┐
│        User          │       │       Setting        │
├──────────────────────┤       ├──────────────────────┤
│  id            PK    │       │  id            PK    │
│  username      UNIQUE│       │  key           UNIQUE│
│  password            │       │  value               │
│  role                │       └──────────────────────┘
│  isActive            │
│  createdAt           │
│  updatedAt           │
└──────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐
│      Category        │       │      MenuItem        │
├──────────────────────┤       ├──────────────────────┤
│  id            PK    │       │  id            PK    │
│  nameAr              │◀──────│  categoryId    FK    │
│  nameEn              │  1:N  │  nameAr              │
│  imagePath           │       │  nameEn              │
│  sortOrder           │       │  descriptionAr       │
│  isActive            │       │  descriptionEn       │
│  createdAt           │       │  price               │
│  updatedAt           │       │  imagePath           │
└──────────────────────┘       │  isAvailable         │
                               │  isFeatured          │
                               │  sortOrder           │
                               │  createdAt           │
                               │  updatedAt           │
                               └──────────┬───────────┘
                                          │
       ┌──────────────────────┐           │
       │        Offer         │           │
       ├──────────────────────┤           │
       │  id            PK    │           │
       │  titleAr             │           │
       │  titleEn             │           │
       │  descriptionAr       │           │
       │  descriptionEn       │           │
       │  imagePath           │           │
       │  discountType        │           │
       │  discountValue       │           │
       │  startDate           │           │
       │  endDate             │           │
       │  isActive            │           │
       │  createdAt           │           │
       │  updatedAt           │           │
       └──────────┬───────────┘           │
                  │                       │
       ┌──────────┴───────────┐           │
       │     OfferItem        │           │
       ├──────────────────────┤           │
       │  offerId       FK   │◀──────────│ M:N
       │  itemId        FK   │───────────│
       └──────────────────────┘           │
       Primary Key: (offerId, itemId)    │
                                          │
                    ┌──────────────────────┐
                    │   OfferItem (M:N)    │
                    │   offers ←→ items    │
                    └──────────────────────┘
```

### العلاقات / Relationships

| العلاقة | Relation | النوع | Type | الوصف | Description |
|---------|----------|------|-------|-------|-------------|
| Category → MenuItem | Category → MenuItem | 1 → N | One-to-Many | القسم يحتوي على أصناف متعددة |
| Offer → OfferItem | Offer → OfferItem | 1 → N | One-to-Many | العرض يحتوي على عناصر متعددة |
| MenuItem → OfferItem | MenuItem → OfferItem | 1 → N | One-to-Many | الصنف مشمول في عروض متعددة |
| OfferItem | OfferItem | M : N | Many-to-Many | علاقة وسيطة بين العروض والأصناف |

---

## 📋 الجداول والحقول / Tables & Fields

### 1. جدول المستخدمين / User Table

```prisma
model User {
  id        Int      @id @default(autoincrement())  // المعرف الفريد
  username  String   @unique                       // اسم المستخدم (فريد)
  password  String                                 // كلمة المرور (مشفرة بـ bcrypt)
  role      String   @default("staff")             // الدور: "admin" | "staff"
  isActive  Boolean  @default(true)                // الحالة: نشط / معطل
  createdAt DateTime @default(now())               // تاريخ الإنشاء
  updatedAt DateTime @updatedAt                    // آخر تحديث
}
```

| الحقل | Field | النوع | Type | الإعدادات | Constraints | الوصف | Description |
|-------|-------|------|------|-----------|-------|-------------|
| المعرف | id | Int | Int | Primary Key, Auto Increment | المعرف الفريد للمستخدم |
| اسم المستخدم | username | String | String | Unique, Required | اسم الدخول للنظام |
| كلمة المرور | password | String | String | Required | مشفرة (bcrypt, 12 rounds) |
| الدور | role | String | String | Default: "staff" | `admin` أو `staff` |
| نشط | isActive | Boolean | Boolean | Default: true | تحكم بتعطيل الحساب |
| تاريخ الإنشاء | createdAt | DateTime | DateTime | Auto | يسجل تلقائياً |
| آخر تحديث | updatedAt | DateTime | DateTime | Auto | يسجل تلقائياً |

---

### 2. جدول الإعدادات / Setting Table

```prisma
model Setting {
  id    Int    @id @default(autoincrement())  // المعرف الفريد
  key   String @unique                       // مفتاح الإعداد (فريد)
  value String                               // قيمة الإعداد
}
```

| الحقل | Field | النوع | Type | الإعدادات | Constraints | الوصف | Description |
|-------|-------|------|------|-----------|-------|-------------|
| المعرف | id | Int | Int | Primary Key, Auto Increment | المعرف الفريد |
| المفتاح | key | String | String | Unique, Required | اسم الإعداد (مثل `restaurantName`) |
| القيمة | value | String | String | Required | قيمة الإعداد |

**الإعدادات الافتراضية / Default Settings:**

| المفتاح | Key | القيمة الافتراضية | Default Value | الوصف | Description |
|---------|-----|-------------------|---------------|-------|-------------|
| `restaurantName` | restaurantName | `بيت المندي` | Bait Al Mandi | اسم المطعم |
| `welcomeMessage` | welcomeMessage | `أهلاً وسهلاً بكم في مطعم بيت المندي` | Welcome message | رسالة الترحيب |
| `logoPath` | logoPath | `""` | Empty | رابط الشعار |
| `coverPath` | coverPath | `""` | Empty | رابط صورة الغلاف |
| `primaryColor` | primaryColor | `#74133A` | #74133A | اللون الأساسي |
| `secondaryColor` | secondaryColor | `#520D29` | #520D29 | اللون الثانوي |
| `accentColor` | accentColor | `#B88645` | #B88645 | لون التمييز |
| `bgColor` | bgColor | `#F4EFE6` | #F4EFE6 | لون الخلفية |
| `textPrimary` | textPrimary | `#3A2318` | #3A2318 | لون النصوص |
| `borderColor` | borderColor | `#D8C8B5` | #D8C8B5 | لون الحدود |
| `fontHeading` | fontHeading | `Cairo` | Cairo | خط العناوين |
| `fontBody` | fontBody | `Tajawal` | Tajawal | خط النصوص |

---

### 3. جدول الأقسام / Category Table

```prisma
model Category {
  id        Int        @id @default(autoincrement())
  nameAr    String                                  // اسم القسم (عربي)
  nameEn    String                                  // اسم القسم (إنجليزي)
  imagePath String?                                 // رابط الصورة (اختياري)
  sortOrder Int        @default(0)                  // ترتيب العرض
  isActive  Boolean    @default(true)               // حالة النشاط
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  menuItems MenuItem[]                               // 1:N → MenuItem
}
```

| الحقل | Field | النوع | Type | الإعدادات | Constraints | الوصف | Description |
|-------|-------|------|------|-----------|-------|-------------|
| المعرف | id | Int | Int | PK, Auto Increment | المعرف الفريد |
| الاسم (عربي) | nameAr | String | String | Required | اسم القسم بالعربية |
| الاسم (إنجليزي) | nameEn | String | String | Required | اسم القسم بالإنجليزية |
| الصورة | imagePath | String? | String? | Optional | رابط الصورة |
| الترتيب | sortOrder | Int | Int | Default: 0 | ترتيب ظهور القسم |
| نشط | isActive | Boolean | Boolean | Default: true | إظهار/إخفاء القسم |
| تاريخ الإنشاء | createdAt | DateTime | DateTime | Auto | - |
| آخر تحديث | updatedAt | DateTime | DateTime | Auto | - |

---

### 4. جدول الأصناف / MenuItem Table

```prisma
model MenuItem {
  id            Int         @id @default(autoincrement())
  categoryId    Int                                   // المفتاح الخارجي للقسم
  nameAr        String                                // اسم الصنف (عربي)
  nameEn        String                                // اسم الصنف (إنجليزي)
  descriptionAr String?                               // الوصف (عربي - اختياري)
  descriptionEn String?                               // الوصف (إنجليزي - اختياري)
  price         Float                                 // السعر
  imagePath     String?                               // رابط الصورة (اختياري)
  isAvailable   Boolean     @default(true)            // حالة التوفر
  isFeatured    Boolean     @default(false)            // صنف مميز
  sortOrder     Int         @default(0)               // ترتيب العرض
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  category      Category    @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  offers        OfferItem[]
}
```

| الحقل | Field | النوع | Type | الإعدادات | Constraints | الوصف | Description |
|-------|-------|------|------|-----------|-------|-------------|
| المعرف | id | Int | Int | PK, Auto Increment | المعرّف الفريد |
| القسم | categoryId | Int | Int | FK → Category.id, Required | القسم التابع له |
| الاسم (عربي) | nameAr | String | String | Required | اسم الصنف بالعربية |
| الاسم (إنجليزي) | nameEn | String | String | Required | اسم الصنف بالإنجليزية |
| الوصف (عربي) | descriptionAr | String? | String? | Optional | وصف الصنف بالعربية |
| الوصف (إنجليزي) | descriptionEn | String? | String? | Optional | وصف الصنف بالإنجليزية |
| السعر | price | Float | Float | Required | السعر بالريال اليمني |
| الصورة | imagePath | String? | String? | Optional | رابط صورة الصنف |
| متوفر | isAvailable | Boolean | Boolean | Default: true | متوفر/غير متوفر |
| مميز | isFeatured | Boolean | Boolean | Default: false | ظهور في قسم المميزات |
| الترتيب | sortOrder | Int | Int | Default: 0 | ترتيب ظهور الصنف |

---

### 5. جدول العروض / Offer Table

```prisma
model Offer {
  id            Int         @id @default(autoincrement())
  titleAr       String                                // عنوان العرض (عربي)
  titleEn       String                                // عنوان العرض (إنجليزي)
  descriptionAr String?                               // وصف العرض (عربي - اختياري)
  descriptionEn String?                               // وصف العرض (إنجليزي - اختياري)
  imagePath     String?                               // صورة العرض (اختياري)
  discountType  String      @default("percentage")    // نوع الخصم: "percentage" | "fixed"
  discountValue Float                                 // قيمة الخصم
  startDate     DateTime                              // تاريخ بداية العرض
  endDate       DateTime                              // تاريخ نهاية العرض
  isActive      Boolean     @default(true)            // حالة العرض
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  items         OfferItem[]
}
```

| الحقل | Field | النوع | Type | الإعدادات | Constraints | الوصف | Description |
|-------|-------|------|------|-----------|-------|-------------|
| المعرف | id | Int | Int | PK, Auto Increment | المعرف الفريد |
| العنوان (عربي) | titleAr | String | String | Required | عنوان العرض بالعربية |
| العنوان (إنجليزي) | titleEn | String | String | Required | عنوان العرض بالإنجليزية |
| الوصف (عربي) | descriptionAr | String? | String? | Optional | وصف العرض |
| الوصف (إنجليزي) | descriptionEn | String? | String? | Optional | وصف العرض |
| الصورة | imagePath | String? | String? | Optional | صورة العرض |
| نوع الخصم | discountType | String | String | Default: "percentage" | `percentage` أو `fixed` |
| قيمة الخصم | discountValue | Float | Float | Required | 15 = 15% أو 500 = 500 ريال |
| تاريخ البداية | startDate | DateTime | DateTime | Required | بداية صلاحية العرض |
| تاريخ النهاية | endDate | DateTime | DateTime | Required | نهاية صلاحية العرض |
| نشط | isActive | Boolean | Boolean | Default: true | تفعيل/تعطيل العرض |

---

### 6. جدول العروض والأصناف / OfferItem (Many-to-Many)

```prisma
model OfferItem {
  offerId Int
  itemId  Int
  offer   Offer    @relation(fields: [offerId], references: [id], onDelete: Cascade)
  item    MenuItem @relation(fields: [itemId], references: [id], onDelete: Cascade)

  @@id([offerId, itemId])
}
```

| الحقل | Field | النوع | Type | الوصف | Description |
|-------|-------|------|------|-------|-------------|
| معرف العرض | offerId | Int | Int | FK → Offer.id |
| معرف الصنف | itemId | Int | Int | FK → MenuItem.id |

**مفتاح مركب**: `(offerId, itemId)` - يضمن عدم تكرار العلاقة.

---

## 📌الفهارس / Indexes

| الجدول | Table | الفهرس | Index | الحقول | Fields | النوع | Type |
|--------|-------|--------|-------|--------|------|
| User | User | `username` | username | Unique | فريد |
| Setting | Setting | `key` | key | Unique | فريد |
| Category | Category | `sortOrder` | sortOrder | Regular | عادي |
| MenuItem | MenuItem | `categoryId` | categoryId | Regular | عادي |
| MenuItem | MenuItem | `sortOrder` | sortOrder | Regular | عادي |
| OfferItem | OfferItem | `(offerId, itemId)` | (offerId, itemId) | Primary (Composite) | رئيسي مركب |

> SQLite يقوم تلقائياً بإنشاء فهارس للمفاتيح الأساسية والفريدة. الفهارس الإضافية (sortOrder) تساعد في ترتيب النتائج بسرعة.

---

## 💡 أمثلة استعلامات / Query Examples

### استخدام Prisma في التطبيق / Prisma Usage in App

```typescript
// src/lib/prisma.ts - إنشاء اتصال Prisma
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### جلب جميع الأقسام النشطة مع أصنافها المتاحة / Get active categories with available items

```typescript
// src/app/page.tsx
const categories = await prisma.category.findMany({
  where: { isActive: true },
  orderBy: { sortOrder: "asc" },
  include: {
    menuItems: {
      where: { isAvailable: true },
      orderBy: { sortOrder: "asc" },
    },
  },
});
```

**SQL المكافئ / Equivalent SQL:**
```sql
SELECT c.*, mi.*
FROM Category c
LEFT JOIN MenuItem mi ON mi.categoryId = c.id AND mi.isAvailable = 1
WHERE c.isActive = 1
ORDER BY c.sortOrder ASC, mi.sortOrder ASC;
```

### جلب العروض النشطة حالياً / Get active offers

```typescript
const offers = await prisma.offer.findMany({
  where: {
    isActive: true,
    startDate: { lte: new Date() },
    endDate: { gte: new Date() },
  },
  include: {
    items: { include: { item: true } },
  },
  orderBy: { createdAt: "desc" },
});
```

### إحصائيات لوحة التحكم / Dashboard statistics

```typescript
const [categories, menuItems, offers, users] = await Promise.all([
  prisma.category.count(),
  prisma.menuItem.count(),
  prisma.offer.count(),
  prisma.user.count(),
]);
```

### البحث عن مستخدم / Find user by username

```typescript
const user = await prisma.user.findUnique({
  where: { username: "admin" },
});
```

### إنشاء صنف جديد مع ربطه بقسم / Create menu item with category

```typescript
const menuItem = await prisma.menuItem.create({
  data: {
    categoryId: 1,
    nameAr: "مندي دجاج",
    nameEn: "Chicken Mandi",
    price: 18000,
    isFeatured: true,
    sortOrder: 1,
  },
});
```

### إنشاء عرض مع ربط أصناف / Create offer with items

```typescript
const offer = await prisma.offer.create({
  data: {
    titleAr: "عرض العائلة",
    titleEn: "Family Offer",
    discountType: "percentage",
    discountValue: 15,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2030-12-31"),
    items: {
      create: [{ itemId: 1 }, { itemId: 2 }],
    },
  },
  include: { items: { include: { item: true } } },
});
```

---

## 🔐 أمان قاعدة البيانات / Database Security

1. **الملف محمي**: `*.db` في `.gitignore` لمنع رفع قاعدة البيانات للمستودع
2. **SQL Injection**: Prisma يستخدم parameterized queries - آمن ضد SQL injection
3. **كلمات المرور مشفرة**: bcrypt بـ 12 round - آمن ضد هجمات彩虹
4. **النسخ الاحتياطي**: يمكن نسخ ملف `database.db` مباشرة (قف الخادم أولاً)

---

> آخر تحديث: يونيو 2026 | Last Updated: June 2026
