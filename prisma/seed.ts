import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const defaultSettings: Record<string, string> = {
  restaurantName: "بيت المندي",
  welcomeMessage: "أهلاً وسهلاً بكم في مطعم بيت المندي",
  logoPath: "",
  coverPath: "",
  primaryColor: "#7A1E2B",
  secondaryColor: "#B33A3A",
  accentColor: "#EAD7B8",
  bgColor: "#F8F4EE",
  textPrimary: "#3D1F24",
  borderColor: "#D8C8B5",
  fontHeading: "Cairo",
  fontBody: "Tajawal",
  phone: "",
  address: "",
};

async function main() {
  const adminExists = await prisma.user.findUnique({ where: { username: "admin" } });
  if (!adminExists) {
    await prisma.user.create({
      data: { username: "admin", password: await bcrypt.hash("admin123", 12), role: "admin" },
    });
    console.log("✅ Admin user created (admin / admin123)");
  }

  const staffExists = await prisma.user.findUnique({ where: { username: "staff" } });
  if (!staffExists) {
    await prisma.user.create({
      data: { username: "staff", password: await bcrypt.hash("staff123", 12), role: "staff" },
    });
    console.log("✅ Staff user created (staff / staff123)");
  }

  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log("✅ Default settings created");

  const catCount = await prisma.category.count();
  if (catCount === 0) {
    const mandi = await prisma.category.create({
      data: { nameAr: "المندي", nameEn: "Mandi", sortOrder: 1 },
    });
    const grilled = await prisma.category.create({
      data: { nameAr: "المشاوي", nameEn: "Grilled", sortOrder: 2 },
    });
    const drinks = await prisma.category.create({
      data: { nameAr: "المشروبات", nameEn: "Drinks", sortOrder: 3 },
    });

    await prisma.menuItem.createMany({
      data: [
        { categoryId: mandi.id, nameAr: "مندي دجاج", nameEn: "Chicken Mandi", descriptionAr: "دجاج مشوي مع أرز بسمتي ممتاز", descriptionEn: "Grilled chicken with premium basmati rice", price: 18000, isFeatured: true, sortOrder: 1 },
        { categoryId: mandi.id, nameAr: "مندي لحم", nameEn: "Meat Mandi", descriptionAr: "لحم ضأن مع أرز بسمتي ممتاز", descriptionEn: "Lamb with premium basmati rice", price: 25000, isFeatured: true, sortOrder: 2 },
        { categoryId: mandi.id, nameAr: "مندي دجاج ملكي", nameEn: "Royal Chicken Mandi", descriptionAr: "دجاج كامل مع أرز ومكسرات", descriptionEn: "Whole chicken with rice and nuts", price: 35000, sortOrder: 3 },
        { categoryId: grilled.id, nameAr: "شيش طاووق", nameEn: "Shish Tawook", descriptionAr: "أسياخ دجاج متبلة مع خضار", descriptionEn: "Marinated chicken skewers with vegetables", price: 15000, sortOrder: 1 },
        { categoryId: grilled.id, nameAr: "كباب", nameEn: "Kebab", descriptionAr: "كباب لحم ضأن مشوي", descriptionEn: "Grilled lamb kebab", price: 20000, sortOrder: 2 },
        { categoryId: drinks.id, nameAr: "مياه معدنية", nameEn: "Mineral Water", price: 3000, sortOrder: 1 },
        { categoryId: drinks.id, nameAr: "بيبسي", nameEn: "Pepsi", price: 5000, sortOrder: 2 },
      ],
    });
    console.log("✅ Sample categories & items created");
  }

  const offerCount = await prisma.offer.count();
  if (offerCount === 0) {
    const allItems = await prisma.menuItem.findMany({ take: 3 });
    const offer = await prisma.offer.create({
      data: {
        titleAr: "عرض العائلة",
        titleEn: "Family Offer",
        descriptionAr: "اطلب 3 أصناف واحصل على خصم 15%",
        descriptionEn: "Order 3 items and get 15% off",
        discountType: "percentage",
        discountValue: 15,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2030-12-31"),
        isActive: true,
        items: { create: allItems.map((item: { id: number }) => ({ itemId: item.id })) },
      },
    });
    console.log("✅ Sample offer created");
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
