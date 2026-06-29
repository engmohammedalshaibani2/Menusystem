"use client";

import { useEffect, useState } from "react";
import LogoIcon from "@/components/ui/LogoIcon";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

type User = {
  id: number;
  username: string;
  role: string;
};

const SvgIcon = ({ children }: { children: React.ReactNode }) => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const icons = {
  dashboard: <SvgIcon><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></SvgIcon>,
  categories: <SvgIcon><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></SvgIcon>,
  items: <SvgIcon><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></SvgIcon>,
  offers: <SvgIcon><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></SvgIcon>,
  users: <SvgIcon><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></SvgIcon>,
  settings: <SvgIcon><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></SvgIcon>,
  logout: <SvgIcon><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></SvgIcon>,
};

const links = [
  { href: "/admin", label: "لوحة التحكم", icon: icons.dashboard, roles: ["admin", "staff"] },
  { href: "/admin/categories", label: "الأقسام", icon: icons.categories, roles: ["admin", "staff"] },
  { href: "/admin/menu-items", label: "الأصناف", icon: icons.items, roles: ["admin", "staff"] },
  { href: "/admin/offers", label: "العروض", icon: icons.offers, roles: ["admin", "staff"] },
  { href: "/admin/users", label: "المستخدمين", icon: icons.users, roles: ["admin"] },
  { href: "/admin/settings", label: "الإعدادات", icon: icons.settings, roles: ["admin"] },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data && data.id) setUser(data);
      })
      .catch(() => {
        router.push("/admin/login");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const filteredLinks = links.filter((l) => user && l.roles.includes(user.role));

  return (
    <aside className="admin-sidebar flex flex-col h-full">
      <div className="px-5 pt-5 pb-4 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--primary)" }}>
            <LogoIcon size={44} ariaLabel="شعار" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold truncate" style={{ color: "var(--text-primary)" }}>بيت المندي</h2>
            {user && (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{user.role === "admin" ? "مدير" : "موظف"}</p>
            )}
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto px-2 py-2">
        {filteredLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`sidebar-link ${pathname === link.href ? "active" : ""}`}
          >
            <span className="flex-shrink-0">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="border-t flex-shrink-0" style={{ borderColor: "var(--border)" }}>
        <button onClick={handleLogout} className="sidebar-link w-full text-right mx-0 rounded-none" style={{ borderRadius: "0" }}>
          <span className="flex-shrink-0">{icons.logout}</span>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
