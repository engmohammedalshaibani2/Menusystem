import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/admin/DashboardClient";

export default async function AdminDashboard() {
  const [categories, menuItems, offers, users] = await Promise.all([
    prisma.category.count(),
    prisma.menuItem.count(),
    prisma.offer.count(),
    prisma.user.count(),
  ]);

  return (
    <DashboardClient stats={{ categories, menuItems, offers, users }} />
  );
}
