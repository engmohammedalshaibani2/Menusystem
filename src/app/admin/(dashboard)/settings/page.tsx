"use client";

import { useEffect, useState } from "react";

type Settings = {
  restaurantName: string;
  welcomeMessage: string;
  logoPath: string;
  coverPath: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  textPrimary: string;
  borderColor: string;
  fontHeading: string;
  fontBody: string;
  phone: string;
  address: string;
};

const defaults: Settings = {
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

const fontOptions = [
  { value: "Cairo", label: "Cairo" },
  { value: "Tajawal", label: "Tajawal" },
  { value: "Inter", label: "Inter" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object" && !Array.isArray(data)) setSettings({ ...defaults, ...data });
      })
      .catch(() => showToast("فشل تحميل الإعدادات", "error"))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (file: File, folder: string = "general"): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res = await fetch("/api/uploads", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "فشل رفع الملف");
    return data.filePath;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let logoPath = settings.logoPath;
      let coverPath = settings.coverPath;

      if (logoFile) logoPath = await handleFileUpload(logoFile, "logos");
      if (coverFile) coverPath = await handleFileUpload(coverFile, "covers");

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, logoPath, coverPath }),
      });

      if (!res.ok) throw new Error();
      showToast("تم حفظ الإعدادات بنجاح", "success");
      setLogoFile(null);
      setCoverFile(null);
    } catch {
      showToast("فشل حفظ الإعدادات", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4">معلومات المطعم</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم المطعم</label>
                <input
                  type="text"
                  className="input-field"
                  value={settings.restaurantName}
                  onChange={(e) => updateField("restaurantName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رسالة الترحيب</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={settings.welcomeMessage}
                  onChange={(e) => updateField("welcomeMessage", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  className="input-field"
                  value={settings.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+967 xxx xxx xxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">العنوان</label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={settings.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="عنوان المطعم"
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4">الصور</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">شعار المطعم</label>
                {settings.logoPath && (
                  <img src={settings.logoPath} alt="Logo" className="h-16 mb-2 object-contain" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="input-field"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">صورة الغلاف</label>
                {settings.coverPath && (
                  <img src={settings.coverPath} alt="Cover" className="w-full h-24 object-cover rounded-lg mb-2" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="input-field"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4">الخطوط</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">خط العناوين</label>
                <select
                  className="input-field"
                  value={settings.fontHeading}
                  onChange={(e) => updateField("fontHeading", e.target.value)}
                >
                  {fontOptions.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">خط النصوص</label>
                <select
                  className="input-field"
                  value={settings.fontBody}
                  onChange={(e) => updateField("fontBody", e.target.value)}
                >
                  {fontOptions.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4">الألوان</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "primaryColor", label: "اللون الأساسي" },
                { key: "secondaryColor", label: "اللون الثانوي" },
                { key: "accentColor", label: "لون التمييز" },
                { key: "bgColor", label: "لون الخلفية" },
                { key: "textPrimary", label: "لون النصوص" },
                { key: "borderColor", label: "لون الحدود" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--border)]"
                      value={(settings as any)[key]}
                      onChange={(e) => updateField(key as keyof Settings, e.target.value)}
                    />
                    <input
                      type="text"
                      className="input-field flex-1"
                      value={(settings as any)[key]}
                      onChange={(e) => updateField(key as keyof Settings, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4">معاينة حية</h2>
            <div
              className="rounded-xl p-6 text-center"
              style={{
                backgroundColor: settings.bgColor,
                color: settings.textPrimary,
                border: `2px solid ${settings.borderColor}`,
                fontFamily: settings.fontBody,
              }}
            >
              {settings.logoPath && (
                <img src={settings.logoPath} alt="Logo" className="h-16 mx-auto mb-3 object-contain" />
              )}
              <h3
                className="text-2xl font-bold mb-2"
                style={{
                  color: settings.primaryColor,
                  fontFamily: settings.fontHeading,
                }}
              >
                {settings.restaurantName}
              </h3>
              <p className="mb-4">{settings.welcomeMessage}</p>
              {settings.phone && <p className="text-sm mb-1 opacity-70">{settings.phone}</p>}
              {settings.address && <p className="text-sm mb-3 opacity-70">{settings.address}</p>}
              <div className="flex gap-3 justify-center">
                <span
                  className="px-4 py-2 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  زر أساسي
                </span>
                <span
                  className="px-4 py-2 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  زر تمييز
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}
