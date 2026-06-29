"use client";

import { useEffect, useState, useCallback } from "react";

type User = {
  id: number;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

type FormData = {
  username: string;
  password: string;
  role: string;
};

const emptyForm: FormData = { username: "", password: "", role: "staff" };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    try {
      const [usersRes, meRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/auth/me"),
      ]);
      const usersData = await usersRes.json();
      const meData = await meRes.json();
      setUsers(Array.isArray(usersData) ? usersData : []);
      if (meData && meData.id) setCurrentUserId(meData.id);
    } catch {
      showToast("فشل تحميل المستخدمين", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setForm({ username: user.username, password: "", role: user.role });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.username) {
      showToast("يرجى إدخال اسم المستخدم", "error");
      return;
    }
    if (!editing && !form.password) {
      showToast("يرجى إدخال كلمة المرور", "error");
      return;
    }

    try {
      const body = editing
        ? { username: form.username, role: form.role, password: form.password || undefined }
        : form;

      if (editing) {
        const res = await fetch(`/api/users/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        showToast("تم تحديث المستخدم بنجاح", "success");
      } else {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        showToast("تمت إضافة المستخدم بنجاح", "success");
      }

      setShowModal(false);
      load();
    } catch {
      showToast("حدث خطأ أثناء الحفظ", "error");
    }
  };

  const toggleActive = async (user: User) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (!res.ok) throw new Error();
      showToast(
        user.isActive ? "تم تعطيل المستخدم" : "تم تفعيل المستخدم",
        "success"
      );
      load();
    } catch {
      showToast("فشل تحديث حالة المستخدم", "error");
    }
  };

  const handleDelete = async (user: User) => {
    if (user.id === currentUserId) {
      showToast("لا يمكنك حذف نفسك", "error");
      return;
    }
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${user.username}"؟`)) return;
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("تم حذف المستخدم بنجاح", "success");
      load();
    } catch {
      showToast("فشل حذف المستخدم", "error");
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">إدارة المستخدمين</h1>
        <div className="skeleton h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
        <button onClick={openAdd} className="btn btn-primary">+ إضافة مستخدم</button>
      </div>

      <div className="card table-wrap">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--glass-bg)]">
              <th className="text-right p-4 font-semibold">#</th>
              <th className="text-right p-4 font-semibold">اسم المستخدم</th>
              <th className="text-right p-4 font-semibold">الدور</th>
              <th className="text-right p-4 font-semibold">الحالة</th>
              <th className="text-right p-4 font-semibold">تاريخ الإنشاء</th>
              <th className="text-left p-4 font-semibold">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[var(--border)] last:border-0">
                <td className="p-4">{user.id}</td>
                <td className="p-4 font-medium">
                  {user.username}
                  {user.id === currentUserId && (
                    <span className="text-xs text-gray-400 mr-2">(أنت)</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`badge ${user.role === "admin" ? "badge-gold" : "badge-warning"}`}>
                    {user.role === "admin" ? "مدير" : "موظف"}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleActive(user)}
                    className={`badge cursor-pointer border-none ${user.isActive ? "badge-success" : "badge-danger"}`}
                  >
                    {user.isActive ? "نشط" : "معطل"}
                  </button>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                </td>
                <td className="p-4">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => openEdit(user)} className="admin-action text-sm">
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="btn btn-danger text-sm"
                      disabled={user.id === currentUserId}
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  لا توجد مستخدمين
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">
              {editing ? "تعديل مستخدم" : "إضافة مستخدم"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم المستخدم *</label>
                <input
                  type="text"
                  className="input-field"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {editing ? "كلمة المرور (اتركها فارغة لعدم التغيير)" : "كلمة المرور *"}
                </label>
                <input
                  type="password"
                  className="input-field"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الدور</label>
                <select
                  className="input-field"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="staff">موظف</option>
                  <option value="admin">مدير</option>
                </select>
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
