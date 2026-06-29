# 📡 توثيق API - API Documentation

---

## 📋 نظرة عامة / Overview

- **Base URL**: `http://menu.local/api` (إنتاج) أو `http://localhost:3000/api` (تطوير)
- **Format**: JSON
- **Auth**: JWT in HTTP-only cookie (`session`)
- **Languages**: Arabic + English

---

## 🔐 المصادقة / Authentication

### POST /api/auth/login
تسجيل الدخول / Login

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "role": "admin"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Cookies Set:**
- `session=<JWT>` (httpOnly, secure in production, sameSite=lax, maxAge=24h)

---

### POST /api/auth/logout
تسجيل الخروج / Logout

**Request:** No body required

**Success Response (200):**
```json
{
  "success": true
}
```

**Cookies Cleared:**
- `session` cookie is deleted

---

### GET /api/auth/me
معلومات المستخدم الحالي / Current user info

**Auth Required:** ✅

**Success Response (200):**
```json
{
  "id": 1,
  "username": "admin",
  "role": "admin"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

## 📂 الأقسام / Categories

### GET /api/categories
جميع الأقسام / All categories

**Auth Required:** ❌

**Success Response (200):**
```json
[
  {
    "id": 1,
    "nameAr": "المندي",
    "nameEn": "Mandi",
    "imagePath": null,
    "sortOrder": 1,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "_count": { "menuItems": 3 }
  }
]
```

---

### POST /api/categories
إضافة قسم / Create category

**Auth Required:** ✅

**Request Body:**
```json
{
  "nameAr": "المقبلات",
  "nameEn": "Appetizers",
  "imagePath": "/uploads/general/123-webp",
  "sortOrder": 4,
  "isActive": true
}
```

**Success Response (201):**
```json
{
  "id": 4,
  "nameAr": "المقبلات",
  "nameEn": "Appetizers",
  "imagePath": "/uploads/general/123-webp",
  "sortOrder": 4,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### GET /api/categories/:id
قسم محدد مع أصنافه / Single category with items

**Auth Required:** ❌

**Success Response (200):**
```json
{
  "id": 1,
  "nameAr": "المندي",
  "nameEn": "Mandi",
  "imagePath": null,
  "sortOrder": 1,
  "isActive": true,
  "createdAt": "...",
  "updatedAt": "...",
  "menuItems": [
    {
      "id": 1,
      "categoryId": 1,
      "nameAr": "مندي دجاج",
      "nameEn": "Chicken Mandi",
      "price": 18000,
      "isAvailable": true,
      "isFeatured": true,
      "sortOrder": 1
    }
  ]
}
```

---

### PUT /api/categories/:id
تحديث قسم / Update category

**Auth Required:** ✅

**Request Body:** (Partial update supported)
```json
{
  "nameAr": "المندي الملكي",
  "sortOrder": 1
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "nameAr": "المندي الملكي",
  "nameEn": "Mandi",
  "imagePath": null,
  "sortOrder": 1,
  "isActive": true,
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

---

### DELETE /api/categories/:id
حذف قسم / Delete category

**Auth Required:** ✅

**Note:** حذف القسم يحذف جميع الأصناف التابعة له (Cascade)

**Success Response (200):**
```json
{
  "success": true
}
```

---

## 🍖 الأصناف / Menu Items

### GET /api/menu-items
جميع الأصناف / All menu items

**Auth Required:** ❌

**Query Parameters:** None (returns all)

**Success Response (200):**
```json
[
  {
    "id": 1,
    "categoryId": 1,
    "nameAr": "مندي دجاج",
    "nameEn": "Chicken Mandi",
    "descriptionAr": "دجاج مشوي مع أرز بسمتي ممتاز",
    "descriptionEn": "Grilled chicken with premium basmati rice",
    "price": 18000,
    "imagePath": null,
    "isAvailable": true,
    "isFeatured": true,
    "sortOrder": 1,
    "createdAt": "...",
    "updatedAt": "...",
    "category": { "nameAr": "المندي" },
    "offers": []
  }
]
```

---

### POST /api/menu-items
إضافة صنف / Create menu item

**Auth Required:** ✅

**Request Body:**
```json
{
  "categoryId": 1,
  "nameAr": "مندي دجاج",
  "nameEn": "Chicken Mandi",
  "descriptionAr": "دجاج مشوي مع أرز بسمتي ممتاز",
  "descriptionEn": "Grilled chicken with premium basmati rice",
  "price": 18000,
  "imagePath": "/uploads/general/456-webp",
  "isAvailable": true,
  "isFeatured": true,
  "sortOrder": 1
}
```

**Success Response (201):**
```json
{
  "id": 8,
  "categoryId": 1,
  "nameAr": "مندي دجاج",
  ...,
  "createdAt": "..."
}
```

---

### PUT /api/menu-items/:id
تحديث صنف / Update menu item

**Auth Required:** ✅

**Request Body:** (Partial update supported)
```json
{
  "price": 20000,
  "isAvailable": false
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "price": 20000,
  "isAvailable": false,
  ...
}
```

---

### DELETE /api/menu-items/:id
حذف صنف / Delete menu item

**Auth Required:** ✅

**Success Response (200):**
```json
{
  "success": true
}
```

---

## 🎁 العروض / Offers

### GET /api/offers
جميع العروض / All offers

**Auth Required:** ❌

**Success Response (200):**
```json
[
  {
    "id": 1,
    "titleAr": "عرض العائلة",
    "titleEn": "Family Offer",
    "descriptionAr": "اطلب 3 أصناح واحصل على خصم 15%",
    "descriptionEn": "Order 3 items and get 15% off",
    "imagePath": null,
    "discountType": "percentage",
    "discountValue": 15,
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2030-12-31T00:00:00.000Z",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "...",
    "items": [
      {
        "offerId": 1,
        "itemId": 1,
        "item": {
          "id": 1,
          "nameAr": "مندي دجاج",
          "price": 18000,
          ...
        }
      }
    ]
  }
]
```

---

### POST /api/offers
إضافة عرض / Create offer

**Auth Required:** ✅

**Request Body:**
```json
{
  "titleAr": "عرض الغداء",
  "titleEn": "Lunch Offer",
  "descriptionAr": "خصم 10% على المشاوي",
  "descriptionEn": "10% off on grilled items",
  "discountType": "percentage",
  "discountValue": 10,
  "startDate": "2024-06-01T00:00:00.000Z",
  "endDate": "2024-12-31T23:59:59.000Z",
  "isActive": true,
  "itemIds": [4, 5]
}
```

**Discount Types:**
| القيمة | Value | الوصف | Description |
|-------|-------|-------|-------------|
| `"percentage"` | percentage | خصم بنسبة مئوية (مثل 15 = 15%) | Percentage discount |
| `"fixed"` | fixed | خصم بقيمة ثابتة (مثل 500 = 500 ريال) | Fixed amount discount |

**Success Response (201):**
```json
{
  "id": 2,
  "titleAr": "عرض الغداء",
  "discountType": "percentage",
  "discountValue": 10,
  "items": [
    { "itemId": 4, "item": { "id": 4, "nameAr": "شيش طاووق", ... } },
    { "itemId": 5, "item": { "id": 5, "nameAr": "كباب", ... } }
  ],
  ...
}
```

---

### PUT /api/offers/:id
تحديث عرض / Update offer

**Auth Required:** ✅

**Request Body:**
```json
{
  "titleAr": "عرض العائلة الكبير",
  "discountValue": 20,
  "itemIds": [1, 2, 3, 4, 5]
}
```

**Note:** يتم حذف جميع `OfferItem` القديمة وإنشاء جديدة.

**Success Response (200):**
```json
{
  "id": 1,
  "titleAr": "عرض العائلة الكبير",
  "discountValue": 20,
  "items": [...],
  ...
}
```

---

### DELETE /api/offers/:id
حذف عرض / Delete offer

**Auth Required:** ✅

**Success Response (200):**
```json
{
  "success": true
}
```

---

## 👥 المستخدمين / Users

### GET /api/users
جميع المستخدمين / All users

**Auth Required:** ✅ (Admin only)

**Note:** لا يتم إرجاع كلمات المرور

**Success Response (200):**
```json
[
  {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "username": "staff",
    "role": "staff",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### POST /api/users
إضافة مستخدم / Create user

**Auth Required:** ✅ (Admin only)

**Request Body:**
```json
{
  "username": "newstaff",
  "password": "securepassword",
  "role": "staff",
  "isActive": true
}
```

**Success Response (201):**
```json
{
  "id": 3,
  "username": "newstaff",
  "role": "staff",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "error": "Username already exists"
}
```

---

### PUT /api/users/:id
تحديث مستخدم / Update user

**Auth Required:** ✅ (Admin only)

**Request Body:** (Partial update - all fields optional except at least one)
```json
{
  "username": "newstaff2",
  "password": "newpassword",
  "role": "admin",
  "isActive": false
}
```

**Success Response (200):**
```json
{
  "id": 3,
  "username": "newstaff2",
  "role": "admin",
  "isActive": false,
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

---

### DELETE /api/users/:id
حذف مستخدم / Delete user

**Auth Required:** ✅ (Admin only)

**Note:** لا يمكن حذف نفسك

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Cannot delete yourself"
}
```

---

## ⚙️ الإعدادات / Settings

### GET /api/settings
جميع الإعدادات / All settings

**Auth Required:** ❌

**Success Response (200):**
```json
{
  "restaurantName": "بيت المندي",
  "welcomeMessage": "أهلاً وسهلاً بكم في مطعم بيت المندي",
  "logoPath": "",
  "coverPath": "",
  "primaryColor": "#74133A",
  "secondaryColor": "#520D29",
  "accentColor": "#B88645",
  "bgColor": "#F4EFE6",
  "textPrimary": "#3A2318",
  "borderColor": "#D8C8B5",
  "fontHeading": "Cairo",
  "fontBody": "Tajawal"
}
```

---

### PUT /api/settings
تحديث الإعدادات / Update settings

**Auth Required:** ✅ (Admin only)

**Request Body:** (Partial update supported)
```json
{
  "restaurantName": "مطعم بيت المندي الجديد",
  "primaryColor": "#1a1a2e",
  "accentColor": "#e94560"
}
```

**Success Response (200):**
```json
{
  "restaurantName": "مطعم بيت المندي الجديد",
  "primaryColor": "#1a1a2e",
  "accentColor": "#e94560",
  ...rest of settings with defaults
}
```

---

## 📤 رفع الملفات / File Upload

### POST /api/upload
رفع ملف / Upload file

**Auth Required:** ✅

**Request:** `multipart/form-data`

| الحقل | Field | النوع | Type | الوصف | Description |
|-------|-------|------|------|-------|-------------|
| `file` | file | File | File | الملف (JPEG, PNG, WebP, SVG) |
| `folder` | folder | String | String | اسم المجلد الفرعي (اختياري) |

**Limits:**
- **Max file size**: 5MB
- **Allowed types**: `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`
- **Image processing**: automatically resized to max 800x800 and converted to WebP (except SVGs)

**Success Response (200):**
```json
{
  "filePath": "/uploads/general/1712345678-1.webp"
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": "No file provided"
}
// OR
{
  "success": false,
  "error": "Invalid file type"
}
// OR
{
  "success": false,
  "error": "File too large"
}
```

---

## ❌ رموز الخطأ / Error Codes

| رمز الحالة | Status | المعنى | Meaning |
|-----------|--------|--------|---------|
| 200 | 200 | نجاح | Success |
| 201 | 201 | تم الإنشاء | Created |
| 400 | 400 | طلب خاطئ | Bad Request |
| 401 | 401 | غير مصرّح | Unauthorized |
| 403 | 403 | ممنوع | Forbidden |
| 404 | 404 | غير موجود | Not Found |
| 409 | 409 | تعارض | Conflict |
| 500 | 500 | خطأ داخلي | Internal Server Error |

### تنسيق الخطأ الموحد / Common Error Format

```json
{
  "success": false,
  "error": "Error message in Arabic or English"
}
```

---

## 📝 أمثلة استخدام مع JavaScript / Usage Examples

### Fetch API
```javascript
// Login
const login = async () => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });
  const data = await res.json();
  if (res.ok) window.location.href = '/admin';
};

// Get categories (public)
const categories = await fetch('/api/categories').then(r => r.json());

// Create menu item (authenticated)
const createItem = async () => {
  const res = await fetch('/api/menu-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      categoryId: 1,
      nameAr: 'مندي دجاج',
      nameEn: 'Chicken Mandi',
      price: 18000,
    }),
  });
  const item = await res.json();
};

// Upload file
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'menu-items');
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data.filePath; // "/uploads/menu-items/123-webp"
};
```

---

> آخر تحديث: يونيو 2026 | Last Updated: June 2026
