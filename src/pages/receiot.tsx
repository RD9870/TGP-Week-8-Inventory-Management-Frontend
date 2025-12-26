import { useState, useEffect } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ReceiptItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

const ReceiptForm = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<ReceiptItem[]>([
    { product_id: "", product_name: "", quantity: 1, price: 0 },
  ]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [cashierName, setCashierName] = useState<string>("...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userResponse, productsResponse] = await Promise.all([
          api.get("/user"),
          api.get("/products"),
        ]);
        setCashierName(userResponse.data.username);

        const prodData = productsResponse.data.data;
        setProducts(Array.isArray(prodData) ? prodData : []);
      } catch (error) {
        setCashierName("Unknown User");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleInputChange = (
    index: number,
    field: keyof ReceiptItem,
    value: any
  ) => {
    const newItems = [...items];
    if (field === "product_id") {
      const selectedProduct = products.find((p) => p.id.toString() === value);
      if (selectedProduct) {
        newItems[index] = {
          ...newItems[index],
          product_id: value,
          product_name: selectedProduct.name,
          price: selectedProduct.price,
        };
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }

    if (index === items.length - 1 && value !== "" && value !== 0) {
      newItems.push({
        product_id: "",
        product_name: "",
        quantity: 1,
        price: 0,
      });
    }
    setItems(newItems);
  };

  useEffect(() => {
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    setTotalPrice(total);
  }, [items]);

  const handleSave = async () => {
    const filteredItems = items
      .filter((item) => item.product_id !== "" && item.quantity > 0)
      .map((item) => ({
        product_id: parseInt(item.product_id),
        quantity: item.quantity,
      }));

    if (filteredItems.length === 0)
      return toast.error("Please select at least one product");

    setLoading(true);
    try {
      await api.post("/receipts", { items: filteredItems });
      toast.success("Receipt saved successfully!");
      setItems([{ product_id: "", product_name: "", quantity: 1, price: 0 }]);
      setTotalPrice(0);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error saving receipt");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
      <div role="status">
        <svg
          aria-hidden="true"
          className="w-12 h-12 text-slate-800 animate-spin fill-blue-500"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-slate-950 py-10 px-4 flex justify-center text-slate-200 selection:bg-blue-500/30">
      <div className="w-full max-w-4xl bg-slate-900 shadow-2xl rounded-2xl p-8 md:p-12 border border-slate-800">
        {/* Logout Button positioned at the top right */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors font-bold text-sm tracking-widest uppercase"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 bg-linear-to-r  from-blue-400 to-indigo-500 bg-clip-text text-transparent inline-block">
              New Receipt
            </h1>
            <p className="text-slate-500 font-mono text-sm">
              {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 w-full md:w-auto">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
              Authorized Cashier
            </label>
            <span className="text-lg font-bold text-blue-400">
              {cashierName}
            </span>
          </div>
        </div>

        {/* Table Area */}
        <div className="mb-10 overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 text-xs uppercase tracking-widest">
                <th className="p-4 font-bold border-b border-slate-700">
                  Product Description
                </th>
                <th className="p-4 font-bold border-b border-slate-700 text-center">
                  Qty
                </th>
                <th className="p-4 font-bold border-b border-slate-700 text-right">
                  Unit Price
                </th>
                <th className="p-4 font-bold border-b border-slate-700 text-right">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((item, index) => (
                <tr
                  key={index}
                  className="group hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-0">
                    <select
                      value={item.product_id}
                      onChange={(e) =>
                        handleInputChange(index, "product_id", e.target.value)
                      }
                      className="w-full p-4 bg-transparent outline-none focus:text-blue-400 transition-colors font-medium appearance-none"
                    >
                      <option value="" className="bg-slate-900 text-slate-400">
                        {" "}
                        Select Product{" "}
                      </option>
                      {products.map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                          className="bg-slate-900 text-slate-200"
                        >
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-0 w-24">
                    <input
                      type="number"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full p-4 text-center bg-transparent outline-none focus:bg-slate-800/50 font-mono font-bold text-blue-400"
                      placeholder="0"
                    />
                  </td>
                  <td className="p-4 text-right font-mono text-slate-400">
                    {item.price.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-slate-100">
                    {(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Area */}
        <div className="flex flex-col items-end mb-10 pt-6">
          <div className="bg-blue-500/5 px-6 py-4 rounded-2xl border border-blue-500/20 text-right min-w-240px">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] block mb-1">
              Grand Total (USD)
            </span>
            <span className="text-5xl font-black text-white tracking-tighter">
              <span className="text-blue-500 mr-2">$</span>
              {totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 border-t border-slate-800 pt-8">
          <button
            onClick={() =>
              setItems([
                { product_id: "", product_name: "", quantity: 1, price: 0 },
              ])
            }
            className="px-8 py-4 text-slate-400 font-bold hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            Clear All
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`group relative px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              "PROCESSING..."
            ) : (
              <>
                <span>CONFIRM & SAVE</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptForm;
