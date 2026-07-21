import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Package, LogOut, ChevronDown, ChevronUp,
  Trash2, Plus, X, Check, Clock
} from "lucide-react";
import logoUrl from "@assets/image_1784548542182-B_34P9Wg_1784561566274.png";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type RequestStatus = "pending" | "approved" | "rejected";
interface ActivationRequest {
  id: number; fullName: string; discordId: string; age: number;
  country: string; rpExperience: string; whyJoin: string;
  hasReadRules: boolean; status: RequestStatus; adminNote: string | null;
  createdAt: string;
}
interface StoreItem {
  id: number; name: string; description: string; price: string;
  category: string; imageUrl: string | null; available: boolean; createdAt: string;
}

const rpLabels: Record<string, string> = {
  none: "لا تجربة", beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم",
};

const statusBadge = (s: RequestStatus) => {
  if (s === "approved") return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">✅ مقبول</span>;
  if (s === "rejected") return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">❌ مرفوض</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"><Clock className="inline w-3 h-3 mb-0.5 ml-1" />قيد المراجعة</span>;
};

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<"requests" | "store">("requests");
  const [requests, setRequests] = useState<ActivationRequest[]>([]);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | RequestStatus>("all");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Add item form
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "", category: "", imageUrl: "" });
  const [addLoading, setAddLoading] = useState(false);

  // Auth check
  useEffect(() => {
    fetch(`${BASE}/api/admin/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((d: { isAdmin?: boolean }) => { if (!d.isAdmin) navigate("/admin"); })
      .catch(() => navigate("/admin"));
  }, [navigate]);

  const loadRequests = useCallback(async () => {
    const r = await fetch(`${BASE}/api/admin/activation-requests`, { credentials: "include" });
    if (r.ok) setRequests(await r.json());
  }, []);

  const loadStore = useCallback(async () => {
    const r = await fetch(`${BASE}/api/admin/store-items`, { credentials: "include" });
    if (r.ok) setStoreItems(await r.json());
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);
  useEffect(() => { if (tab === "store") loadStore(); }, [tab, loadStore]);

  const updateRequest = async (id: number, status: RequestStatus, adminNote?: string) => {
    setActionLoading(id);
    try {
      await fetch(`${BASE}/api/admin/activation-requests/${id}`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...(adminNote ? { adminNote } : {}) }),
      });
      await loadRequests();
      setExpandedId(null);
    } finally { setActionLoading(null); }
  };

  const deleteItem = async (id: number) => {
    if (!confirm("هل تريد حذف هذا العنصر؟")) return;
    await fetch(`${BASE}/api/admin/store-items/${id}`, { method: "DELETE", credentials: "include" });
    await loadStore();
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await fetch(`${BASE}/api/admin/store-items`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newItem,
          imageUrl: newItem.imageUrl || undefined,
          available: true,
        }),
      });
      setNewItem({ name: "", description: "", price: "", category: "", imageUrl: "" });
      setShowAddItem(false);
      await loadStore();
    } finally { setAddLoading(false); }
  };

  const logout = async () => {
    await fetch(`${BASE}/api/admin/logout`, { method: "POST", credentials: "include" });
    navigate("/admin");
  };

  const filtered = filterStatus === "all" ? requests : requests.filter((r) => r.status === filterStatus);
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img src={logoUrl} alt="D99" className="h-9 opacity-80 hover:opacity-100 transition-opacity" />
            </Link>
            <span className="text-white font-bold text-sm hidden sm:block">لوحة التحكم</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "إجمالي الطلبات", value: requests.length, color: "text-primary" },
            { label: "قيد المراجعة", value: pendingCount, color: "text-yellow-400" },
            { label: "مقبولة", value: requests.filter(r => r.status === "approved").length, color: "text-green-400" },
            { label: "مرفوضة", value: requests.filter(r => r.status === "rejected").length, color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-white/5 rounded-xl p-4 text-center">
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-0">
          {[
            { id: "requests", label: "طلبات التفعيل", icon: <Users className="w-4 h-4" />, badge: pendingCount },
            { id: "store", label: "المتجر", icon: <Package className="w-4 h-4" />, badge: 0 },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px
                ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"}`}
            >
              {t.icon} {t.label}
              {t.badge > 0 && (
                <span className="bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ---- REQUESTS TAB ---- */}
        <AnimatePresence mode="wait">
          {tab === "requests" && (
            <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Filter */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {(["all", "pending", "approved", "rejected"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors
                      ${filterStatus === s
                        ? "bg-primary/20 border-primary/50 text-primary"
                        : "border-white/10 text-muted-foreground hover:border-white/30 hover:text-white"}`}
                  >
                    {s === "all" ? "الكل" : s === "pending" ? "قيد المراجعة" : s === "approved" ? "✅ مقبولة" : "❌ مرفوضة"}
                  </button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">لا توجد طلبات</div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((req) => (
                    <div key={req.id} className="bg-card border border-white/5 rounded-xl overflow-hidden">
                      {/* Row */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                        onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                            {req.fullName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{req.fullName}</p>
                            <p className="text-muted-foreground text-xs truncate">{req.discordId} · {req.country}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {statusBadge(req.status)}
                          {expandedId === req.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>

                      {/* Expanded */}
                      <AnimatePresence>
                        {expandedId === req.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-4">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                <div><span className="text-muted-foreground block text-xs mb-0.5">العمر</span><span className="text-white">{req.age} سنة</span></div>
                                <div><span className="text-muted-foreground block text-xs mb-0.5">الخبرة</span><span className="text-white">{rpLabels[req.rpExperience] ?? req.rpExperience}</span></div>
                                <div><span className="text-muted-foreground block text-xs mb-0.5">قرأ القوانين</span><span className="text-white">{req.hasReadRules ? "✅ نعم" : "❌ لا"}</span></div>
                                <div><span className="text-muted-foreground block text-xs mb-0.5">التاريخ</span><span className="text-white">{new Date(req.createdAt).toLocaleDateString("ar-SA")}</span></div>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs block mb-1">سبب الانضمام</span>
                                <p className="text-white text-sm bg-background/50 rounded-lg p-3 leading-relaxed">{req.whyJoin}</p>
                              </div>
                              {req.adminNote && (
                                <div>
                                  <span className="text-muted-foreground text-xs block mb-1">ملاحظة الأدمن</span>
                                  <p className="text-yellow-300 text-sm bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-3">{req.adminNote}</p>
                                </div>
                              )}
                              {req.status === "pending" && (
                                <div className="flex gap-2 pt-1">
                                  <button
                                    disabled={actionLoading === req.id}
                                    onClick={() => updateRequest(req.id, "approved")}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/20 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                  >
                                    <Check className="w-4 h-4" /> ✅ قبول
                                  </button>
                                  <button
                                    disabled={actionLoading === req.id}
                                    onClick={() => updateRequest(req.id, "rejected")}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                  >
                                    <X className="w-4 h-4" /> ❌ رفض
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ---- STORE TAB ---- */}
          {tab === "store" && (
            <motion.div key="store" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <p className="text-muted-foreground text-sm">{storeItems.length} عنصر</p>
                <button
                  onClick={() => setShowAddItem((v) => !v)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" /> إضافة عنصر
                </button>
              </div>

              {/* Add form */}
              <AnimatePresence>
                {showAddItem && (
                  <motion.form
                    onSubmit={addItem}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="bg-card border border-primary/20 rounded-xl p-5 space-y-3">
                      <h3 className="text-white font-semibold text-sm mb-3">إضافة عنصر جديد للمتجر</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {([
                          { key: "name", placeholder: "اسم العنصر *", required: true },
                          { key: "price", placeholder: "السعر (مثال: $50) *", required: true },
                          { key: "category", placeholder: "الفئة (مثال: VIP) *", required: true },
                          { key: "imageUrl", placeholder: "رابط الصورة (اختياري)", required: false },
                        ] as const).map((f) => (
                          <input
                            key={f.key}
                            type="text"
                            placeholder={f.placeholder}
                            required={f.required}
                            value={newItem[f.key]}
                            onChange={(e) => setNewItem((p) => ({ ...p, [f.key]: e.target.value }))}
                            className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 w-full"
                          />
                        ))}
                      </div>
                      <textarea
                        placeholder="الوصف *"
                        required
                        value={newItem.description}
                        onChange={(e) => setNewItem((p) => ({ ...p, description: e.target.value }))}
                        rows={2}
                        className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={addLoading}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          {addLoading ? "جاري الحفظ..." : "حفظ"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddItem(false)}
                          className="px-4 py-2 bg-white/5 text-muted-foreground rounded-lg text-sm hover:bg-white/10 transition-colors"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {storeItems.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">لا توجد عناصر في المتجر</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {storeItems.map((item) => (
                    <div key={item.id} className="bg-card border border-white/5 rounded-xl p-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                        <p className="text-muted-foreground text-xs mt-0.5 truncate">{item.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-primary font-bold text-sm">{item.price}</span>
                          <span className="text-xs text-muted-foreground border border-white/10 rounded px-1.5 py-0.5">{item.category}</span>
                          {!item.available && <span className="text-xs text-red-400">غير متاح</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="shrink-0 p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
