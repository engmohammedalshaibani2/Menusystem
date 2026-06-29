"use client";

import { useEffect, useState, useCallback } from "react";

type Category = {
  id: number;
  nameAr: string;
  nameEn: string;
  imagePath: string | null;
  sortOrder: number;
  isActive: boolean;
};

type FormData = {
  nameAr: string;
  nameEn: string;
  sortOrder: number;
  isActive: boolean;
};

const emptyForm: FormData = { nameAr: "", nameEn: "", sortOrder: 0, isActive: true };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      showToast("فشل تحميل الأقسام", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setImage(null);
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ nameAr: cat.nameAr, nameEn: cat.nameEn, sortOrder: cat.sortOrder, isActive: cat.isActive });
    setImage(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nameAr || !form.nameEn) {
      showToast("يرجى ملء الحقول المطلوبة", "error");
      return;
    }

    try {
      let imagePath = editing?.imagePath || null;

      if (image) {
        const imgData = new FormData();
        imgData.append("file", image);
        imgData.append("folder", "categories");
        const imgRes = await fetch("/api/uploads", { method: "POST", body: imgData });
        const imgJson = await imgRes.json();
        if (imgRes.ok) imagePath = imgJson.filePath;
      }

      const body = { ...form, imagePath };

      if (editing) {
        const res = await fetch(`/api/categories/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        showToast("تم تحديث القسم بنجاح", "success");
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        showToast("تمت إضافة القسم بنجاح", "success");
      }

      setShowModal(false);
      load();
    } catch {
      showToast("حدث خطأ أثناء الحفظ", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("تم حذف القسم بنجاح", "success");
      load();
    } catch {
      showToast("فشل حذف القسم", "error");
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">إدارة الأقسام</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-40 w-full mb-4" />
              <div className="skeleton h-6 w-2/3 mb-2" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة الأقسام</h1>
        <button onClick={openAdd} className="btn btn-primary">+ إضافة قسم</button>
      </div>

      {categories.length === 0 ? (
          <div className="card p-12 text-center">
          <p className="text-xl text-gray-500">لا توجد أقسام بعد</p>
          <button onClick={openAdd} className="btn btn-primary mt-4">إضافة أول قسم</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="card p-6">
              {cat.imagePath && (
                <div className="aspect-video overflow-hidden rounded-lg mb-4">
                  <img
                    src={cat.imagePath}
                    alt={cat.nameAr}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <h3 className="text-lg font-bold mb-1">{cat.nameAr}</h3>
              <p className="text-sm text-gray-500 mb-3">{cat.nameEn}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className={`badge ${cat.isActive ? "badge-success" : "badge-danger"}`}>
                  {cat.isActive ? "نشط" : "معطل"}
                </span>
                <span className="badge badge-gold">ترتيب: {cat.sortOrder}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(cat)} className="admin-action text-sm flex-1">تعديل</button>
                <button onClick={() => handleDelete(cat.id)} className="btn btn-danger text-sm flex-1">حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">
              {editing ? "تعديل قسم" : "إضافة قسم"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم (عربي) *</label>
                <input
                  type="text"
                  className="input-field"
                  value={form.nameAr}
                  onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الاسم (إنجليزي) *</label>
                <input
                  type="text"
                  className="input-field"
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ترتيب العرض</label>
                <input
                  type="number"
                  className="input-field"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الصورة</label>
                <input
                  type="file"
                  accept="image/*"
                  className="input-field"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-5 h-5"
                />
                <span>قسم نشط</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="btn btn-primary flex-1">
                  {editing ? "تحديث" : "إضافة"}
                </button>
                <button onClick={() => setShowModal(false)} className="btn btn-ghost flex-1">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}
