import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

describe("Menu System v2", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Authentication", () => {
    it("should hash and verify password", async () => {
      const hash = await bcrypt.hash("test123", 12);
      expect(await bcrypt.compare("test123", hash)).toBe(true);
      expect(await bcrypt.compare("wrong", hash)).toBe(false);
    });
  });

  describe("User CRUD", () => {
    let userId: number;

    it("should create user", async () => {
      const user = await prisma.user.create({
        data: {
          username: `test_${Date.now()}`,
          password: await bcrypt.hash("test", 12),
          role: "staff",
        },
      });
      userId = user.id;
      expect(user.id).toBeGreaterThan(0);
    });

    it("should read user", async () => {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      expect(user).not.toBeNull();
    });

    it("should update user", async () => {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { role: "admin" },
      });
      expect(user.role).toBe("admin");
    });

    it("should delete user", async () => {
      await prisma.user.delete({ where: { id: userId } });
      const user = await prisma.user.findUnique({ where: { id: userId } });
      expect(user).toBeNull();
    });
  });

  describe("Category CRUD", () => {
    let catId: number;

    it("should create category", async () => {
      const cat = await prisma.category.create({
        data: { nameAr: "اختبار", nameEn: "Test", sortOrder: 1 },
      });
      catId = cat.id;
      expect(cat.nameAr).toBe("اختبار");
    });

    it("should update category", async () => {
      const cat = await prisma.category.update({
        where: { id: catId },
        data: { nameAr: "محدث" },
      });
      expect(cat.nameAr).toBe("محدث");
    });

    it("should delete category", async () => {
      await prisma.category.delete({ where: { id: catId } });
      const cat = await prisma.category.findUnique({ where: { id: catId } });
      expect(cat).toBeNull();
    });
  });

  describe("MenuItem CRUD", () => {
    let catId: number;
    let itemId: number;

    beforeAll(async () => {
      const cat = await prisma.category.create({
        data: { nameAr: "قسم", nameEn: "Cat", sortOrder: 1 },
      });
      catId = cat.id;
    });

    afterAll(async () => {
      await prisma.category.delete({ where: { id: catId } }).catch(() => {});
    });

    it("should create item", async () => {
      const item = await prisma.menuItem.create({
        data: { categoryId: catId, nameAr: "صنف", nameEn: "Item", price: 10000 },
      });
      itemId = item.id;
      expect(item.price).toBe(10000);
    });

    it("should update item", async () => {
      const item = await prisma.menuItem.update({
        where: { id: itemId },
        data: { isAvailable: false },
      });
      expect(item.isAvailable).toBe(false);
    });

    it("should cascade delete on category delete", async () => {
      await prisma.category.delete({ where: { id: catId } });
      const items = await prisma.menuItem.findMany({
        where: { categoryId: catId },
      });
      expect(items.length).toBe(0);
    });
  });

  describe("Offers M2M", () => {
    let catId: number;
    let item1Id: number;
    let item2Id: number;
    let offerId: number;

    beforeAll(async () => {
      const cat = await prisma.category.create({
        data: { nameAr: "قسم العروض", nameEn: "OffersCat", sortOrder: 2 },
      });
      catId = cat.id;
      const i1 = await prisma.menuItem.create({
        data: { categoryId: catId, nameAr: "صنف 1", nameEn: "Item1", price: 10000 },
      });
      const i2 = await prisma.menuItem.create({
        data: { categoryId: catId, nameAr: "صنف 2", nameEn: "Item2", price: 20000 },
      });
      item1Id = i1.id;
      item2Id = i2.id;
    });

    afterAll(async () => {
      await prisma.category.delete({ where: { id: catId } }).catch(() => {});
    });

    it("should create offer with items", async () => {
      const offer = await prisma.offer.create({
        data: {
          titleAr: "عرض",
          titleEn: "Offer",
          discountType: "percentage",
          discountValue: 20,
          startDate: new Date("2024-01-01"),
          endDate: new Date("2030-12-31"),
          items: {
            create: [{ itemId: item1Id }, { itemId: item2Id }],
          },
        },
        include: { items: true },
      });
      offerId = offer.id;
      expect(offer.items.length).toBe(2);
    });

    it("should calculate percentage discount", () => {
      expect(10000 - (10000 * 20) / 100).toBe(8000);
    });

    it("should calculate fixed discount", () => {
      expect(20000 - 5000).toBe(15000);
    });

    it("should find active offers", async () => {
      const offers = await prisma.offer.findMany({
        where: {
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      });
      expect(offers.length).toBeGreaterThanOrEqual(1);
    });

    it("should delete offer and cascade items", async () => {
      await prisma.offer.delete({ where: { id: offerId } });
      const oi = await prisma.offerItem.findMany({ where: { offerId } });
      expect(oi.length).toBe(0);
    });
  });

  describe("Settings", () => {
    it("should upsert and read settings", async () => {
      await prisma.setting.upsert({
        where: { key: "test_key" },
        update: { value: "test_val" },
        create: { key: "test_key", value: "test_val" },
      });
      const s = await prisma.setting.findUnique({
        where: { key: "test_key" },
      });
      expect(s?.value).toBe("test_val");
      await prisma.setting.delete({ where: { key: "test_key" } });
    });
  });
});
