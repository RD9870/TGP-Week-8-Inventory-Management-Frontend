import { useEffect, useState } from "react";
import api from "../api";
import { TrendingUp, Package, DollarSign, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfitDetail {
  product: string;
  quantity_sold: number;
  profit: number;
}

function ProfitDetails() {
  const [profits, setProfits] = useState<ProfitDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetailedProfits = async () => {
      try {
        setLoading(true);
        const response = await api.get<ProfitDetail[]>("/detailed");
        setProfits(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch profit data");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedProfits();
  }, []);

  const totalProfitSum = profits.reduce((acc, curr) => acc + curr.profit, 0);
  const totalUnits = profits.reduce((sum, item) => sum + item.quantity_sold, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-3 text-slate-400 mt-4 font-medium italic">
          Analyzing profit records...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 font-sans text-slate-100">
      <div className="max-w-5xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-4 text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <TrendingUp className="text-emerald-400" size={32} />
            Profit Analytics
          </h1>
          <p className="text-slate-400 mt-1">
            Detailed breakdown of net margins per product.
          </p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl shadow-xl shadow-emerald-500/5 min-w-60">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <DollarSign size={20} className="text-emerald-400" />
            </div>
            <span className="text-slate-400 text-[10px] uppercase tracking-widest font-black">
              Total Net Profit
            </span>
          </div>
          <span className="text-3xl font-black text-emerald-400">
            $
            {totalProfitSum.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="p-6">Product Item</th>
                <th className="p-6 text-center">Units Sold</th>
                <th className="p-6 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {profits.length > 0 ? (
                profits.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-800/30 transition-all group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:border-indigo-500/50 group-hover:bg-slate-700 transition-all">
                          <Package size={20} />
                        </div>
                        <span className="font-bold text-slate-200 group-hover:text-white transition-colors">
                          {item.product}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="inline-block bg-slate-800 text-slate-300 px-4 py-1 rounded-lg text-sm font-mono border border-slate-700 group-hover:border-slate-600 transition-colors">
                        {item.quantity_sold}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <span className="text-lg font-black text-emerald-400 font-mono">
                        +$
                        {item.profit.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="p-20 text-center text-slate-500 italic"
                  >
                    No data found for this period.
                  </td>
                </tr>
              )}
            </tbody>

            {profits.length > 0 && (
              <tfoot className="bg-slate-800/30 border-t border-slate-700">
                <tr className="text-slate-300 font-bold">
                  <td className="p-6 text-[10px] uppercase tracking-widest text-slate-500">
                    Summary Statistics
                  </td>
                  <td className="p-6 text-center font-mono text-indigo-400">
                    {totalUnits} Units
                  </td>
                  <td className="p-6 text-right text-xl font-black text-emerald-400">
                    $
                    {totalProfitSum.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {error && (
        <div className="max-w-5xl mx-auto mt-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 animate-pulse">
          <p className="text-sm font-bold"> {error}</p>
        </div>
      )}
    </div>
  );
}

export default ProfitDetails;
