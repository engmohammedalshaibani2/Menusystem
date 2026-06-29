"use client";

import { useState, useEffect } from "react";
import { EyeOff, Eye } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoPath, setLogoPath] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.logoPath) setLogoPath(data.logoPath);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطأ في تسجيل الدخول");
        return;
      }

      router.push("/admin");
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative plum-heritage-gradient"
    >
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, color-mix(in srgb, var(--gold) 8%, transparent) 0%, transparent 70%)",
          opacity: 0.8,
          filter: "blur(5px)",
          animation: "bgPulse 20s infinite ease-in-out",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        className="rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border w-full max-w-md overflow-hidden text-right relative z-10"
        style={{
          backgroundColor: "var(--bg)",
          borderColor: "color-mix(in srgb, var(--gold) 30%, transparent)",
          color: "var(--primary)",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-2"
          style={{
            background: `linear-gradient(to right, var(--gold), color-mix(in srgb, var(--gold) 80%, white), var(--gold))`,
          }}
        />

        <div className="p-8 pb-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-6 w-28 h-28 flex items-center justify-center rounded-full border-2 p-2"
            style={{
              backgroundColor: "white",
              boxShadow: "0 8px 20px color-mix(in srgb, var(--gold) 30%, transparent)",
              borderColor: "color-mix(in srgb, var(--gold) 20%, transparent)",
            }}
          >
            <img src={logoPath || "/uploads/logos/1782289425516-1.webp"} alt="Logo" className="w-full h-full object-contain" />
          </motion.div>

          <h2 className="text-3xl font-black font-['Cairo'] mb-8" style={{ color: "var(--primary)" }}>
            تسجيل الدخول للمشرف
          </h2>

          {error && (
            <div
              className="w-full px-4 py-3 rounded-xl mb-5 text-sm font-bold text-center"
              style={{
                backgroundColor: "color-mix(in srgb, var(--primary) 6%, transparent)",
                color: "var(--primary)",
                border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
              }}
            >
              {error}
            </div>
          )}

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-bold mb-2 font-['Cairo']" style={{ color: "color-mix(in srgb, var(--primary) 80%, transparent)" }}>
                اسم المستخدم
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="w-full border-2 rounded-xl px-4 py-3.5 outline-none transition-all shadow-sm font-medium"
                style={{
                  backgroundColor: "white",
                  borderColor: "color-mix(in srgb, var(--gold) 30%, transparent)",
                  color: "var(--primary)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--gold)";
                  e.target.style.boxShadow = "0 0 0 3px color-mix(in srgb, var(--gold) 30%, transparent)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "color-mix(in srgb, var(--gold) 30%, transparent)";
                  e.target.style.boxShadow = "none";
                }}
                dir="rtl"
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold mb-2 font-['Cairo']" style={{ color: "color-mix(in srgb, var(--primary) 80%, transparent)" }}>
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full border-2 rounded-xl pl-12 pr-4 py-3.5 outline-none transition-all shadow-sm font-medium"
                  style={{
                    backgroundColor: "white",
                    borderColor: "color-mix(in srgb, var(--gold) 30%, transparent)",
                    color: "var(--primary)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--gold)";
                    e.target.style.boxShadow = "0 0 0 3px color-mix(in srgb, var(--gold) 30%, transparent)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "color-mix(in srgb, var(--gold) 30%, transparent)";
                    e.target.style.boxShadow = "none";
                  }}
                  dir="rtl"
                  required
                />
                <button
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors p-1"
                  style={{ color: "var(--gold)" }}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--gold)")}
                >
                  {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3.5 rounded-xl font-bold font-['Cairo'] text-lg transition-all mb-6 shadow-md disabled:opacity-50 gold-pulse-btn"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--bg)",
              }}
            >
              {loading ? "جاري تسجيل الدخول..." : "دخول"}
            </motion.button>

            <div className="text-center">
              <a
                href="#"
                className="text-sm font-medium transition-colors border-b border-transparent pb-0.5"
                style={{ color: "var(--gold)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--primary)";
                  e.currentTarget.style.borderColor = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--gold)";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                نسيت كلمة المرور؟
              </a>
            </div>
          </form>
        </div>

        <div className="border-t py-4 text-center" style={{
          backgroundColor: "color-mix(in srgb, var(--primary) 5%, transparent)",
          borderTopColor: "color-mix(in srgb, var(--gold) 20%, transparent)",
        }}>
          <p className="text-xs font-['Cairo'] font-bold" style={{ color: "color-mix(in srgb, var(--primary) 60%, transparent)" }}>
            حقوق الطبع والنشر &copy; بيت المندي 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}
