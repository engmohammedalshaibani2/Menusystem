# 🧪 دليل الاختبارات - Testing Guide

---

## 🛠️ إعداد الاختبارات / Test Setup

يستخدم المشروع **Vitest** كإطار عمل للاختبارات.

The project uses **Vitest** as the testing framework.

### التثبيت / Installation
```bash
# مثبت مسبقاً في devDependencies
npm install
```

### تشغيل الاختبارات / Run Tests

```bash
# تشغيل جميع الاختبارات مرة واحدة
npm test

# تشغيل الاختبارات في وضع المراقبة (تطوير)
npm run test:watch

# تشغيل اختبارات محددة
npx vitest run src/lib/utils.test.ts

# تشغيل مع تغطية
npx vitest run --coverage
```

> **ملاحظة**: حالياً مجلد `tests/` فارغ ويحتاج إلى إضافة ملفات الاختبارات. هذا الدليل يوضح كيفية البدء.

---

## 📁 هيكل الاختبارات / Test Structure

```
tests/
├── api/                    # اختبارات API endpoints
│   ├── auth.test.ts
│   ├── categories.test.ts
│   ├── menu-items.test.ts
│   ├── offers.test.ts
│   └── settings.test.ts
│
├── lib/                    # اختبارات المكتبات
│   ├── auth.test.ts
│   ├── utils.test.ts
│   └── prisma.test.ts
│
├── components/             # اختبارات المكونات
│   ├── Badge.test.tsx
│   ├── Button.test.tsx
│   ├── Modal.test.tsx
│   └── Toast.test.tsx
│
└── setup.ts               # إعدادات الاختبارات المشتركة
```

---

## 🔧 إعدادات الاختبار / Test Configuration

### `vitest.config.ts` (في جذر المشروع)
```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### `tests/setup.ts`
```typescript
import { beforeAll, afterAll } from "vitest";

// إعداد قاعدة بيانات اختبارية
beforeAll(async () => {
  process.env.DATABASE_URL = "file:./test.db";
  process.env.JWT_SECRET = "test-secret";
});

afterAll(async () => {
  // تنظيف قاعدة البيانات الاختبارية
});
```

---

## 📝 أنواع الاختبارات / Test Types

### 1. اختبارات الوحدة / Unit Tests

اختبار الدوال المساعدة / Testing utility functions:

```typescript
// tests/lib/utils.test.ts
import { describe, it, expect } from "vitest";
import { formatPrice, calculateDiscount, isExpired } from "@/lib/utils";

describe("formatPrice", () => {
  it("formats price with Yemeni Rial symbol", () => {
    expect(formatPrice(18000)).toContain("ر.ي");
    expect(formatPrice(18000)).toContain("18");
  });

  it("handles zero", () => {
    expect(formatPrice(0)).toContain("0");
  });

  it("handles large numbers", () => {
    const result = formatPrice(100000);
    expect(result).toContain("100");
  });
});

describe("calculateDiscount", () => {
  it("calculates percentage discount correctly", () => {
    expect(calculateDiscount(100, "percentage", 15)).toBe(85);
  });

  it("calculates fixed discount correctly", () => {
    expect(calculateDiscount(100, "fixed", 20)).toBe(80);
  });

  it("handles zero discount", () => {
    expect(calculateDiscount(100, "percentage", 0)).toBe(100);
  });

  it("handles 100% discount", () => {
    expect(calculateDiscount(100, "percentage", 100)).toBe(0);
  });
});

describe("isExpired", () => {
  it("returns true for past dates", () => {
    expect(isExpired(new Date("2020-01-01"))).toBe(true);
  });

  it("returns false for future dates", () => {
    expect(isExpired(new Date("2099-01-01"))).toBe(false);
  });
});
```

### 2. اختبارات API / API Tests

```typescript
// tests/api/categories.test.ts
import { describe, it, expect, beforeAll } from "vitest";

const BASE_URL = "http://localhost:3000/api";

describe("Categories API", () => {
  let authCookie: string;

  beforeAll(async () => {
    // تسجيل الدخول للحصول على الكوكي
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin123" }),
    });
    const cookies = res.headers.getSetCookie();
    authCookie = cookies[0]; // session=<JWT>
  });

  it("GET /categories returns array", async () => {
    const res = await fetch(`${BASE_URL}/categories`);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it("POST /categories creates new category", async () => {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
      body: JSON.stringify({
        nameAr: "اختبار",
        nameEn: "Test",
        sortOrder: 99,
      }),
    });
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.nameAr).toBe("اختبار");
  });

  it("POST /categories rejects unauthenticated requests", async () => {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameAr: "اختبار", nameEn: "Test" }),
    });
    expect(res.status).toBe(401);
  });
});
```

### 3. اختبارات المكونات / Component Tests

```typescript
// tests/components/Badge.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "@/components/ui/Badge";

describe("Badge Component", () => {
  it("renders with children", () => {
    render(<Badge variant="success">نشط</Badge>);
    expect(screen.getByText("نشط")).toBeDefined();
  });

  it("applies correct class for success variant", () => {
    const { container } = render(<Badge variant="success">نشط</Badge>);
    expect(container.firstChild?.classList.contains("badge-success")).toBe(true);
  });

  it("applies correct class for danger variant", () => {
    const { container } = render(<Badge variant="danger">معطل</Badge>);
    expect(container.firstChild?.classList.contains("badge-danger")).toBe(true);
  });
});
```

### 4. اختبارات Prisma / Prisma Tests

```typescript
// tests/lib/prisma.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Prisma Database", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("can query categories", async () => {
    const categories = await prisma.category.findMany();
    expect(Array.isArray(categories)).toBe(true);
  });

  it("can create and delete a category", async () => {
    const cat = await prisma.category.create({
      data: { nameAr: "اختبار", nameEn: "Test", sortOrder: 99 },
    });
    expect(cat.nameAr).toBe("اختبار");

    await prisma.category.delete({ where: { id: cat.id } });
    const found = await prisma.category.findUnique({ where: { id: cat.id } });
    expect(found).toBeNull();
  });

  it("verifies admin user exists after seed", async () => {
    const admin = await prisma.user.findUnique({ where: { username: "admin" } });
    expect(admin).not.toBeNull();
    expect(admin?.role).toBe("admin");
  });
});
```

### 5. اختبارات التكامل / Integration Tests

```typescript
// tests/api/settings.test.ts
import { describe, it, expect } from "vitest";

describe("Settings Integration", () => {
  it("settings are accessible without auth", async () => {
    const res = await fetch("http://localhost:3000/api/settings");
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.restaurantName).toBeDefined();
    expect(data.primaryColor).toBeDefined();
  });

  it("settings update requires admin role", async () => {
    // Test with staff role (should fail)
    // Test with admin role (should succeed)
  });

  it("customer menu renders successfully", async () => {
    const res = await fetch("http://localhost:3000/");
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain("بيت المندي");
    expect(html).toContain("المندي");
  });
});
```

---

## 🏃 تشغيل الاختبارات تلقائياً / CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: npx prisma generate

      - name: Run lint
        run: npm run lint

      - name: Run type check
        run: npm run typecheck

      - name: Run tests
        run: npm test
```

---

## 📊 مؤشرات الجودة / Quality Metrics

| المقياس | Metric | الهدف | Target |
|---------|--------|-------|--------|
| تغطية الكود | Code Coverage | > 80% | > 80% |
| عدد الاختبارات | Test Count | > 50 test cases | > 50 |
| وقت التشغيل | Run Time | < 30 seconds | < 30 ثانية |
| lint errors | Lint Errors | 0 | 0 |
| type errors | Type Errors | 0 | 0 |

---

## 📝 إضافة اختبارات جديدة / Adding New Tests

### خطوات إضافة اختبار / Steps to Add a Test

1. **حدد نوع الاختبار** / Identify test type:
   - وحدة (Unit): `tests/lib/`
   - API: `tests/api/`
   - مكون (Component): `tests/components/`

2. **أنشئ ملف الاختبار** / Create test file:
   ```bash
   touch tests/lib/my-new-function.test.ts
   ```

3. **اكتب الاختبار** / Write the test:
   ```typescript
   import { describe, it, expect } from "vitest";
   import { myFunction } from "@/lib/my-module";

   describe("myFunction", () => {
     it("should work correctly", () => {
       expect(myFunction("input")).toBe("expected");
     });

     it("should handle edge cases", () => {
       expect(myFunction("")).toBe("");
       expect(myFunction(null)).toThrow();
     });
   });
   ```

4. **شغّل الاختبار** / Run the test:
   ```bash
   npx vitest run tests/lib/my-new-function.test.ts
   ```

### أفضل الممارسات / Best Practices

✅ **DO**:
- اكتب اختبارات قبل كتابة الكود (TDD)
- اختبر الحالات الطبيعية والحالات الحدية
- استخدم أسماء واضحة للاختبارات
- اجعل كل اختبار مستقلاً
- نظف البيانات بعد كل اختبار

❌ **DON'T**:
- لا تختبر المكتبات الخارجية (Prisma, jose, bcrypt)
- لا تعتمد على ترتيب تنفيذ الاختبارات
- لا تستخدم بيانات حقيقية في الاختبارات
- لا تترك اختبارات معلقة (skip)

---

> آخر تحديث: يونيو 2026 | Last Updated: June 2026
