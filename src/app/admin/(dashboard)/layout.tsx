import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminSidebarToggle from "@/components/admin/AdminSidebarToggle";
import DarkModeToggle from "@/components/ui/DarkModeToggle";
import LogoIcon from "@/components/ui/LogoIcon";
import { getSettings } from "@/lib/utils";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <div className="flex" style={{ minHeight: "100vh" }}>
      <AdminSidebar />
      <AdminSidebarToggle />
      <main className="admin-main p-4 sm:p-6 lg:p-8 flex-1 min-h-screen">
        <div className="mb-6 sticky top-0 z-40">
          <div className="w-full text-white rounded-md p-3 shadow-sm flex items-center justify-between plum-heritage-gradient" style={{ border: "1px solid var(--navbar-border)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                {settings.logoPath ? (
                  <img src={settings.logoPath} alt={settings.restaurantName} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-white w-full h-full">
                    <LogoIcon size={36} ariaLabel="شعار" />
                  </div>
                )}
              </div>
              <h2 className="font-bold text-lg" style={{ fontFamily: "var(--font-heading)", color: "var(--gold)" }}>{settings.restaurantName}</h2>
            </div>
            <div className="flex items-center gap-2">
              <DarkModeToggle />
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
