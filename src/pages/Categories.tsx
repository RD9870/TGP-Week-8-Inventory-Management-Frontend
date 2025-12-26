import React, { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  X,
  Plus,
  Layers,
  Tag,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  FolderPlus,
} from "lucide-react";
import api from "../api";
import toast, { Toaster } from "react-hot-toast";

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

function CategoriesPage() {
  const userType = localStorage.getItem("user_type");

  const isAdmin = userType === "admin";

  const catBaseUrl = isAdmin ? "/categories" : "/categoriesm";
  const subBaseUrl = isAdmin ? "/subcategories" : "/subcategoriesm";

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentCat, setCurrentCat] = useState<Category | null>(null);
  const [currentSub, setCurrentSub] = useState<Subcategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    type: "cat" | "sub";
  } | null>(null);

  const [catForm, setCatForm] = useState({ name: "" });
  const [subForm, setSubForm] = useState({ name: "", category_id: 0 });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, subRes] = await Promise.all([
        api.get<Category[]>(catBaseUrl),
        api.get<Subcategory[]>(subBaseUrl),
      ]);
      setCategories(catRes.data);
      setSubCategories(subRes.data);
    } catch (err) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCatModal = (cat: Category | null = null) => {
    if (!isAdmin && cat !== null) return;
    setCurrentCat(cat);
    setCatForm({ name: cat?.name || "" });
    setIsCatModalOpen(true);
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tid = toast.loading("Saving category...");
    try {
      if (currentCat?.id) {
        await api.put(`${catBaseUrl}/${currentCat.id}`, catForm);
        toast.success("Category updated", { id: tid });
      } else {
        await api.post(catBaseUrl, catForm);
        toast.success("Category created", { id: tid });
      }
      fetchData();
      setIsCatModalOpen(false);
    } catch (err: any) {
      toast.error("Action failed", { id: tid });
    }
  };

  const openSubModal = (sub: Subcategory | null = null, catId?: number) => {
    if (!isAdmin && sub !== null) return;
    setCurrentSub(sub);
    setSubForm({
      name: sub?.name || "",
      category_id: catId || sub?.category_id || 0,
    });
    setIsSubModalOpen(true);
  };

  const handleSubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tid = toast.loading("Saving subcategory...");
    try {
      if (currentSub?.id) {
        await api.put(`${subBaseUrl}/${currentSub.id}`, subForm);
        toast.success("Subcategory updated", { id: tid });
      } else {
        await api.post(subBaseUrl, subForm);
        toast.success("Subcategory created", { id: tid });
      }
      fetchData();
      setIsSubModalOpen(false);
    } catch (err: any) {
      toast.error("Action failed", { id: tid });
    }
  };

  const confirmDelete = (id: number, type: "cat" | "sub") => {
    if (!isAdmin) return;
    setDeleteTarget({ id, type });
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTarget || !isAdmin) return;
    const tid = toast.loading("Deleting...");
    try {
      const endpoint = deleteTarget.type === "cat" ? catBaseUrl : subBaseUrl;
      await api.delete(`${endpoint}/${deleteTarget.id}`);
      toast.success("Deleted successfully", { id: tid });
      fetchData();
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error("Failed to delete", { id: tid });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 font-sans text-slate-100">
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: "#1e293b", color: "#fff" } }}
      />

      <div className="max-w-4xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Categories</h1>
          <p className="text-slate-400">
            Organize your products into main and sub-categories.
          </p>
        </div>
        <button
          onClick={() => openCatModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <Plus size={20} /> New Category
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest">
              <th className="p-5 w-12"></th>
              <th className="p-5">Category Name</th>
              <th className="p-5">Sub-items</th>
              <th className="p-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-10 text-center animate-pulse">
                  Loading categories...
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <React.Fragment key={cat.id}>
                  <tr
                    className={`hover:bg-slate-800/30 transition-all ${
                      expandedId === cat.id ? "bg-indigo-500/5" : ""
                    }`}
                  >
                    <td className="p-5">
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === cat.id ? null : cat.id!)
                        }
                        className="text-slate-500 hover:text-indigo-400"
                      >
                        {expandedId === cat.id ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </button>
                    </td>
                    <td className="p-5 font-bold text-slate-200 flex items-center gap-3">
                      <Layers size={18} className="text-indigo-500" />{" "}
                      {cat.name}
                    </td>
                    <td className="p-5 text-slate-500 text-sm">
                      {
                        subCategories.filter((s) => s.category_id === cat.id)
                          .length
                      }{" "}
                      Subcategories
                    </td>
                    <td className="p-5 flex justify-center gap-3">
                      <button
                        onClick={() => openSubModal(null, cat.id)}
                        title="Add Subcategory"
                        className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg"
                      >
                        <FolderPlus size={18} />
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => openCatModal(cat)}
                            className="p-2 text-slate-400 hover:text-white"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => confirmDelete(cat.id!, "cat")}
                            className="p-2 text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>

                  {expandedId === cat.id && (
                    <tr className="bg-slate-950/50">
                      <td colSpan={4} className="p-0">
                        <div className="px-16 py-4 space-y-2 border-l-4 border-indigo-600/30 ml-8 my-2">
                          {subCategories.filter((s) => s.category_id === cat.id)
                            .length === 0 ? (
                            <p className="text-slate-600 text-sm italic">
                              No subcategories yet.
                            </p>
                          ) : (
                            subCategories
                              .filter((s) => s.category_id === cat.id)
                              .map((sub) => (
                                <div
                                  key={sub.id}
                                  className="flex items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-800/50"
                                >
                                  <span className="text-slate-300 flex items-center gap-2">
                                    <Tag size={14} className="text-slate-500" />{" "}
                                    {sub.name}
                                  </span>
                                  {isAdmin && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => openSubModal(sub)}
                                        className="p-1.5 text-slate-500 hover:text-white"
                                      >
                                        <Pencil size={14} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          confirmDelete(sub.id!, "sub")
                                        }
                                        className="p-1.5 text-slate-500 hover:text-rose-500"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isCatModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Layers className="text-indigo-500" />{" "}
                {currentCat ? "Edit Category" : "New Category"}
              </h2>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCatSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Category Name
                </label>
                <input
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500/50"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ name: e.target.value })}
                  placeholder="e.g. Electronics"
                  required
                />
              </div>
              <button className="w-full bg-indigo-600 py-4 rounded-xl font-black text-sm tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
                SAVE CATEGORY
              </button>
            </form>
          </div>
        </div>
      )}

      {isSubModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <FolderPlus className="text-emerald-500" />{" "}
                {currentSub ? "Edit Subcategory" : "Add Subcategory"}
              </h2>
              <button
                onClick={() => setIsSubModalOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Main Category
                </label>
                <select
                  disabled
                  className="w-full bg-slate-800/30 border border-slate-700 text-slate-400 rounded-xl p-3 cursor-not-allowed outline-none"
                  value={subForm.category_id}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Subcategory Name
                </label>
                <input
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500/50"
                  value={subForm.name}
                  onChange={(e) =>
                    setSubForm({ ...subForm, name: e.target.value })
                  }
                  placeholder="e.g. Smartphones"
                  required
                />
              </div>
              <button className="w-full bg-emerald-600 py-4 rounded-xl font-black text-sm tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20">
                SAVE SUB-ITEM
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && isAdmin && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex justify-center items-center p-4 z-60  animate-in zoom-in duration-150">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-4xl max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Are you sure?</h3>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
              {deleteTarget?.type === "cat"
                ? "Warning: Deleting a category will also delete all its subcategories!"
                : "This subcategory will be permanently removed."}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-rose-500 active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
