import { useState, useEffect, type ChangeEvent } from "react";
import api from "../api";

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
    { product_id: "", product_name: "", quantity: 0, price: 0 },
  ]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [cashierName, setCashierName] = useState<string>("جاري التحميل...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/user");
        // تأكد من المسمى في قاعدة بياناتك (name أو username)
        setCashierName(response.data.name || response.data.username || "كاشير");
      } catch (error: any) {
        console.error("فشل جلب المستخدم:", error.response?.status);
        setCashierName("فشل في المصادقة");
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        // في لارافل، إذا استخدمت Resource أو Pagination، البيانات تكون داخل data.data
        const data = response.data.data || response.data;

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("البيانات ليست مصفوفة:", data);
        }
      } catch (error: any) {
        console.error("فشل جلب المنتجات:", error.response?.status);
      }
    };

    fetchUserData();
    fetchProducts();
  }, []);

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
        quantity: 0,
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

    if (filteredItems.length === 0) return alert("أضف منتجاً أولاً");

    setLoading(true);
    try {
      await api.post("/receipts", { items: filteredItems });
      alert("تم حفظ الفاتورة بنجاح");
      setItems([{ product_id: "", product_name: "", quantity: 0, price: 0 }]);
    } catch (error: any) {
      alert(error.response?.data?.message || "خطأ في الحفظ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center text-gray-800">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-sm p-12 border border-gray-200">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-black uppercase mb-2">Receipt</h1>
            <p className="text-gray-500">
              Date: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <label className="block text-xs font-bold text-gray-400 uppercase">
              Logged in as
            </label>
            {/* هنا يظهر اسم الكاشير تلقائياً */}
            <span className="text-xl font-bold text-blue-600">
              {cashierName}
            </span>
          </div>
        </div>

        <div className="mb-10 overflow-hidden">
          <table className="w-full border-2 border-gray-300">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-300">
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-0">
                    <select
                      value={item.product_id}
                      onChange={(e) =>
                        handleInputChange(index, "product_id", e.target.value)
                      }
                      className="w-full p-3 bg-transparent outline-none focus:bg-blue-50"
                    >
                      <option value="">-- Select Product --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-0 border-x">
                    <input
                      type="number"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "quantity",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full p-3 text-center outline-none focus:bg-blue-50"
                    />
                  </td>
                  <td className="p-3 text-right font-mono font-bold">
                    {item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-end mb-10">
          <span className="text-gray-400 font-bold">TOTAL</span>
          <span className="text-5xl font-black">{totalPrice}</span>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-10 py-3 bg-blue-600 text-white font-bold rounded shadow-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "SAVING..." : "CONFIRM & SAVE"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptForm;
