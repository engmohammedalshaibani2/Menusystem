"use client";

import Link from "next/link";
import LogoIcon from "@/components/ui/LogoIcon";

const SvgWrapper = ({ children }: { children: React.ReactNode }) => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

// Use centralized logo icon for dashboard tiles so branding/colors follow settings
const icons = {
  categories: <LogoIcon size={32} />,
  items: <LogoIcon size={32} />,
  offers: <LogoIcon size={32} />,
  users: <LogoIcon size={32} />,
};

type Stats = {
  categories: number;
  menuItems: number;
  offers: number;
  users: number;
};

export default function DashboardClient({ stats }: { stats: Stats }) {
  const cards = [
    { label: "الأقسام", count: stats.categories, icon: icons.categories, href: "/admin/categories", color: "var(--text-primary)" },
    { label: "الأصناف", count: stats.menuItems, icon: icons.items, href: "/admin/menu-items", color: "var(--text-secondary)" },
    { label: "العروض", count: stats.offers, icon: icons.offers, href: "/admin/offers", color: "var(--primary-light)" },
    { label: "المستخدمين", count: stats.users, icon: icons.users, href: "/admin/users", color: "var(--text-primary)" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">لوحة التحكم</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <div
              className="card p-6 cursor-pointer"
              style={{ borderTop: `4px solid ${card.color}` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{card.icon}</span>
                <span className="text-3xl font-bold" style={{ color: card.color }}>
                  {card.count}
                </span>
              </div>
              <p className="text-lg font-semibold">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">روابط سريعة</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/categories" className="btn btn-primary">إدارة الأقسام</Link>
          <Link href="/admin/menu-items" className="btn btn-secondary">إدارة الأصناف</Link>
          <Link href="/admin/offers" className="btn btn-secondary">إدارة العروض</Link>
        </div>
      </div>
    </div>
  );
}
