"use client";

import { useEffect, useState, useCallback } from "react";

type MenuItem = {
  id: number;
  nameAr: string;
};

type Offer = {
  id: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  imagePath: string | null;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  items: { itemId: number }[];
};

type FormData = {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  itemIds: number[];
};

const emptyForm: FormData = {
  titleAr: "", titleEn: "", descriptionAr: "", descriptionEn: "",
  discountType: "percentage", discountValue: 0,
  startDate: "", endDate: "", isActive: true, itemIds: [],
};

function getOfferStatus(offer: Offer): { label: string; className: string } {
  if (!offer.isActive) return { label: "معطل", className: "badge-danger" };
  const now = new Date();
  const start = new Date(offer.startDate);
  const end = new Date(offer.endDate);
  if (now < start) return { label: "قادم", className: "badge-warning" };
  if (now > end) return { label: "منتهي", className: "badge-danger" };
  return { label: "نشط", className: "badge-success" };
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    try {
      const [offersRes, itemsRes] = await Promise.all([
        fetch("/api/offers"),
        fetch("/api/menu-items"),
      ]);
      const offersData = await offersRes.json();
      const itemsData = await itemsRes.json();
      setOffers(Array.isArray(offersData) ? offersData : []);
      setMenuItems(Array.isArray(itemsData) ? itemsData : []);
    } catch {
      showToast("فشل تحميل البيانات", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, startDate: new Date().toISOString().slice(0, 16) });
    setImage(null);
    setShowModal(true);
  };

  const openEdit = (offer: Offer) => {
    setEditing(offer);
    setForm({
      titleAr: offer.titleAr,
      titleEn: offer.titleEn,
      descriptionAr: offer.descriptionAr || "",
      descriptionEn: offer.descriptionEn || "",
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      startDate: offer.startDate.slice(0, 16),
      endDate: offer.endDate.slice(0, 16),
      isActive: offer.isActive,
      itemIds: offer.items.map((i) => i.itemId),
    });
    setImage(null);
    setShowModal(true);
  };

  const toggleItem = (id: number) => {
    setForm((prev) => ({
      ...prev,
      itemIds: prev.itemIds.includes(id)
        ? prev.itemIds.filter((i) => i !== id)
        : [...prev.itemIds, id],
    }));
  };

  const handleSave = async () => {
    if (!form.titleAr || !form.titleEn || form.discountValue <= 0 || !form.startDate || !form.endDate) {
      showToast("يرجى ملء جميع الحقول المطلوبة", "error");
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      showToast("تاريخ البداية يجب أن يكون قبل تاريخ النهاية", "error");
      return;
    }

    try {
      let imagePath = editing?.imagePath || null;

      if (image) {
        const imgData = new FormData();
        imgData.append("file", image);
        imgData.append("folder", "offers");
        const imgRes = await fetch("/api/uploads", { method: "POST", body: imgData });
        const imgJson = await imgRes.json();
        if (imgRes.ok) imagePath = imgJson.filePath;
      }

      const body = {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        imagePath,
      };

      if (editing) {
        const res = await fetch(`/api/offers/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        showToast("تم تحديث العرض بنجاح", "success");
      } else {
        const res = await fetch("/api/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        showToast("تمت إضافة العرض بنجاح", "success");
      }

      setShowModal(false);
      load();
    } catch {
      showToast("حدث خطأ أثناء الحفظ", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا العرض؟")) return;
    try {
      const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("تم حذف العرض بنجاح", "success");
      load();
    } catch {
      showToast("فشل حذف العرض", "error");
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">إدارة العروض</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-6 w-2/3 mb-2" />
              <div className="skeleton h-4 w-1/2 mb-4" />
              <div className="skeleton h-20 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة العروض</h1>
        <button onClick={openAdd} className="btn btn-primary">+ إضافة عرض</button>
      </div>

      {offers.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-xl text-gray-500">لا توجد عروض بعد</p>
          <button onClick={openAdd} className="btn btn-primary mt-4">إضافة أول عرض</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => {
            const status = getOfferStatus(offer);
            return (
              <div key={offer.id} className="card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold">{offer.titleAr}</h3>
                    <p className="text-sm text-gray-500">{offer.titleEn}</p>
                  </div>
                  <span className={`badge ${status.className}`}>{status.label}</span>
                </div>
                {offer.descriptionAr && (
                  <p className="text-sm text-gray-600 mb-3">{offer.descriptionAr}</p>
                )}
                <div className="discount-badge inline-block mb-3">
                  {offer.discountType === "percentage"
                    ? `خصم ${offer.discountValue}%`
                    : `خصم ${offer.discountValue} ر.ي`}
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  من {new Date(offer.startDate).toLocaleDateString("ar-SA")} إلى{" "}
                  {new Date(offer.endDate).toLocaleDateString("ar-SA")}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(offer)} className="admin-action text-sm flex-1">تعديل</button>
                  <button onClick={() => handleDelete(offer.id)} className="admin-action danger text-sm flex-1">حذف</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">
              {editing ? "تعديل عرض" : "إضافة عرض"}
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1">العنوان (عربي) *</label>
                <input
                  type="text"
                  className="input-field"
                  value={form.titleAr}
                  onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">العنوان (إنجليزي) *</label>
                <input
                  type="text"
                  className="input-field"
                  value={form.titleEn}
                  onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
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
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">نوع الخصم</label>
                  <select
                    className="input-field"
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  >
                    <option value="percentage">نسبة مئوية</option>
                    <option value="fixed">قيمة ثابتة</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">قيمة الخصم *</label>
                  <input
                    type="number"
                    className="input-field"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">تاريخ البداية</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">تاريخ النهاية</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
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
              <div>
                <label className="block text-sm font-medium mb-2">الأصناف المشمولة</label>
                <div className="max-h-32 overflow-y-auto border border-[var(--border)] rounded-xl p-3 space-y-2">
                  {menuItems.map((item) => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.itemIds.includes(item.id)}
                        onChange={() => toggleItem(item.id)}
                        className="w-5 h-5"
                      />
                      <span>{item.nameAr}</span>
                    </label>
                  ))}
                  {menuItems.length === 0 && (
                    <p className="text-sm text-gray-400">لا توجد أصناف متاحة</p>
                  )}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-5 h-5"
                />
                <span>عرض نشط</span>
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
