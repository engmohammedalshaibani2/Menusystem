"use client";

import { useEffect, useState } from "react";

export default function AdminSidebarToggle() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sidebar = document.querySelector(".admin-sidebar") as HTMLElement | null;
    if (sidebar) {
      if (open) sidebar.classList.add("open");
      else sidebar.classList.remove("open");
    }
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        aria-label="القائمة"
        className="lg:hidden fixed top-4 right-4 z-60 px-4 py-2.5 rounded-md btn-glass min-w-[44px] min-h-[44px]"
        onClick={() => setOpen(true)}
      >
        <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>قائمة</span>
      </button>

      {/* Expose a CSS class to allow public pages to toggle the admin sidebar when user is admin */}
      <style>{`.show-admin-sidebar { --show-admin-sidebar: 1; }`}</style>

      {open && (
        <div
          className="admin-sidebar-overlay lg:hidden fixed inset-0 z-50"
          onClick={() => setOpen(false)}
          role="presentation"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
        />
      )}
    </>
  );
}
