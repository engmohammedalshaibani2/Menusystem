"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function PublicAdminSidebar() {
  const [open, setOpen] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/me")
      .then((r) => {
        if (r.status === 401) return null;
        return r.json();
      })
      .then((data) => {
        if (!mounted || !data) return;
        if (data.role === "admin" || data.role === "staff") {
          setAllowed(true);
          try {
            document.body.classList.add("show-admin-sidebar");
            window.dispatchEvent(new CustomEvent("toggle-admin-sidebar", { detail: { open: true } }));
          } catch (e) {}
          setOpen(true);
        }
      })
      .catch(() => {});
    return () => { mounted = false; try { document.body.classList.remove("show-admin-sidebar"); } catch (e) {} };
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const d = (e as CustomEvent).detail;
        const newVal = typeof d?.open !== "undefined" ? Boolean(d.open) : document.body.classList.contains("show-admin-sidebar");
        setOpen(newVal);
        document.body.style.overflow = newVal ? "hidden" : "";
      } catch (err) {}
    };
    window.addEventListener("toggle-admin-sidebar", handler as EventListener);
    return () => {
      window.removeEventListener("toggle-admin-sidebar", handler as EventListener);
      document.body.style.overflow = "";
    };
  }, []);

  if (!allowed) return null;

  return (
    <>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setOpen(false);
              document.body.classList.remove("show-admin-sidebar");
              document.body.style.overflow = "";
              window.dispatchEvent(new CustomEvent("toggle-admin-sidebar", { detail: { open: false } }));
            }}
            style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          />
          <div style={{ position: "fixed", right: 0, top: 0, zIndex: 50 }}>
            <AdminSidebar />
          </div>
        </>
      )}
    </>
  );
}
