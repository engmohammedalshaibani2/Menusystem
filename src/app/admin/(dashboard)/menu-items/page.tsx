"use client";

import { useEffect, useState, useCallback } from "react";
import { formatPrice } from "@/lib/utils";

type MenuItem = {
  id: number;
  categoryId: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  price: number;
  imagePath: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  category?: { nameAr: string };
};

type Category = {
  id: number;
  nameAr: string;
};

type FormData = {
  categoryId: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

const emptyForm: FormData = {
  categoryId: 0, nameAr: "", nameEn: "", descriptionAr: "", descriptionEn: "",
  price: 0, isAvailable: true, isFeatured: false, sortOrder: 0,
};

export default function MenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    try {
      const [itemsRes, catsRes] = await Promise.all([
        fetch("/api/menu-items"),
        fetch("/api/categories"),
      ]);
      const itemsData = await itemsRes.json();
      const catsData = await catsRes.json();
      setItems(Array.isArray(itemsData) ? itemsData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
    } catch {
      showToast("فشل تحميل البيانات", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id || 0 });
    setImage(null);
    setShowModal(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      categoryId: item.categoryId,
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      descriptionAr: item.descriptionAr || "",
      descriptionEn: item.descriptionEn || "",
      price: item.price,
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
      sortOrder: item.sortOrder,
    });
    setImage(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nameAr || !form.nameEn || !form.categoryId || form.price <= 0) {
      showToast("يرجى ملء الحقول المطلوبة", "error");
      return;
    }

    try {
      let imagePath = editing?.imagePath || null;

      if (image) {
        const imgData = new FormData();
        imgData.append("file", image);
        imgData.append("folder", "menu-items");
        const imgRes = await fetch("/api/uploads", { method: "POST", body: imgData });
        const imgJson = await imgRes.json();
        if (imgRes.ok) imagePath = imgJson.filePath;
      }

      const body = { ...form, imagePath };

      if (editing) {
        const res = await fetch(`/api/menu-items/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        showToast("تم تحديث الصنف بنجاح", "success");
      } else {
        const res = await fetch("/api/menu-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        showToast("تمت إضافة الصنف بنجاح", "success");
      }

      setShowModal(false);
      load();
    } catch {
      showToast("حدث خطأ أثناء الحفظ", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الصنف؟")) return;
    try {
      const res = await fetch(`/api/menu-items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("تم حذف الصنف بنجاح", "success");
      load();
    } catch {
      showToast("فشل حذف الصنف", "error");
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">إدارة الأصناف</h1>
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
        <h1 className="text-2xl font-bold">إدارة الأصناف</h1>
        <button onClick={openAdd} className="btn btn-primary">+ إضافة صنف</button>
      </div>

      {items.length === 0 ? (
          <div className="card p-12 text-center">
          <p className="text-xl text-gray-500">لا توجد أصناف بعد</p>
          <button onClick={openAdd} className="btn btn-primary mt-4">إضافة أول صنف</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="card p-6">
              {item.imagePath && (
                <div className="aspect-video overflow-hidden rounded-lg mb-4">
                  <img
                    src={item.imagePath}
                    alt={item.nameAr}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <h3 className="text-lg font-bold mb-1">{item.nameAr}</h3>
              <p className="text-sm text-gray-500 mb-1">{item.nameEn}</p>
              <p className="text-xs text-gray-400 mb-2">
                {item.category?.nameAr || "بدون قسم"}
              </p>
              <div className="text-xl font-bold mb-3" style={{ color: "var(--gold)" }}>
                {formatPrice(item.price)}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`badge ${item.isAvailable ? "badge-success" : "badge-danger"}`}>
                  {item.isAvailable ? "متوفر" : "غير متوفر"}
                </span>
                {item.isFeatured && <span className="badge badge-gold">مميز</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="admin-action text-sm flex-1">تعديل</button>
                <button onClick={() => handleDelete(item.id)} className="btn btn-danger text-sm flex-1">حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">
              {editing ? "تعديل صنف" : "إضافة صنف"}
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1">القسم *</label>
                <select
                  className="input-field"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value) })}
                >
                  <option value={0}>-- اختر القسم --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
                  ))}
                </select>
              </div>
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
                <label className="block text-sm font-medium mb-1">الوصف (عربي)</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={form.descriptionAr}
                  onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الوصف (إنجليزي)</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={form.descriptionEn}
                  onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">السعر *</label>
                <input
                  type="number"
                  className="input-field"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
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
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>متوفر</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>مميز</span>
                </label>
              </div>
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
