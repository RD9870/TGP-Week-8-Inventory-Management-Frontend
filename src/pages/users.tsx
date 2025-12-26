import React, { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  Plus,
  User as UserIcon,
  AlertTriangle,
} from "lucide-react";
import api from "../api";
import toast, { Toaster } from "react-hot-toast";

interface User {
  id?: number;
  username: string;
  type: string;
  password?: string;
  salary: number | string;
}

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState<User>({
    username: "",
    type: "user",
    password: "",
    salary: "",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get<User[]>("/users");
      setUsers(response.data);
    } catch (err) {
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user: User | null = null) => {
    setCurrentUser(user);
    setShowPassword(false);
    if (user) {
      setFormData({
        username: user.username,
        type: user.type,
        password: "",
        salary: user.salary,
      });
    } else {
      setFormData({ username: "", type: "user", password: "", salary: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Saving...");
    try {
      if (currentUser?.id) {
        await api.put(`/users/${currentUser.id}`, formData);
        toast.success("User updated successfully", { id: loadingToast });
      } else {
        await api.post("/users", formData);
        toast.success("User created successfully", { id: loadingToast });
      }
      fetchUsers();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error("Operation failed", { id: loadingToast });
    }
  };

  const confirmDelete = (id: number) => {
    setUserIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!userIdToDelete) return;
    const loadingToast = toast.loading("Deleting...");
    try {
      await api.delete(`/users/${userIdToDelete}`);
      setUsers(users.filter((u) => u.id !== userIdToDelete));
      toast.success("User deleted successfully", { id: loadingToast });
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error("Failed to delete", { id: loadingToast });
    } finally {
      setUserIdToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 font-sans text-slate-100">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid #334155",
          },
        }}
      />

      <div className="max-w-5xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            User Management
          </h1>
          <p className="text-slate-400">
            Control system access, roles, and payroll.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
        >
          <Plus size={20} /> Add New User
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest">
              <th className="p-5">User</th>
              <th className="p-5">Role</th>
              <th className="p-5 text-right">Salary</th>
              <th className="p-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-20 text-center animate-pulse text-slate-500"
                >
                  Loading records...
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-800/30 transition-all"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 flex items-center justify-center font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-200">
                        {user.username}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                        user.type === "manager"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : user.type === "cashier"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {user.type}
                    </span>
                  </td>
                  <td className="p-5 text-right font-mono text-slate-300 font-medium">
                    ${Number(user.salary).toLocaleString()}
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openModal(user)}
                        className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => confirmDelete(user.id!)}
                        className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <UserIcon className="text-indigo-400" />{" "}
                {currentUser ? "Edit User" : "New User"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <input
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Username"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl p-3 outline-none"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="cashier">Cashier</option>
                </select>
                <input
                  type="number"
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl p-3 outline-none"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  placeholder="Salary"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl p-3 outline-none"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Password"
                  required={!currentUser}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button className="w-full bg-indigo-600 py-4 rounded-xl font-black text-sm tracking-widest hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all">
                SAVE USER
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex justify-center items-center p-4 z-60 animate-in zoom-in duration-150">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-4xl max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
              This account will be permanently removed from the system.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-rose-600/20 transition-all active:scale-95"
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

export default UsersPage;
