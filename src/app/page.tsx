export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/utils";
import CustomerMenu from "@/components/customer/CustomerMenu";

export default async function CustomerPage() {
  const settings = await getSettings();

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      menuItems: {
        where: { isAvailable: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  const offers = await prisma.offer.findMany({
    where: {
      isActive: true,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    },
    include: {
      items: {
        include: { item: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <CustomerMenu
      settings={settings}
      categories={categories}
      offers={offers}
    />
  );
}
