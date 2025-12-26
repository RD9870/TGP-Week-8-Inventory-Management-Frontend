import MetricCard from "../components/ui/MetricCard";
import { ThumbsDown, ShoppingCart, TrendingUp, Medal } from "lucide-react";
import LineChart from "../components/charts/LineChart";
import api from "../api";
import { useEffect, useState } from "react";

interface ProductSale {
  product_id: number;
  name: string;
  total_quantity: string;
}

interface ProductsOverviewResponse {
  "best sellers": ProductSale[];
  "worst sellers": ProductSale[];
}

interface MonthlyRateResponse {
  month: number;
  year: number;
  total_profit: number;
}

interface lowStockCountResponse {
  "number-of-low-stock-items": number;
}

function Dashboard() {
  const [worstAndBestSellers, setworstAndBestSellers] =
    useState<ProductsOverviewResponse | null>(null);
  const [MonthlyProfit, setMonthlyProfit] =
    useState<MonthlyRateResponse | null>(null);
  const [lowStockCount, setlowStockCount] =
    useState<lowStockCountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const chartData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 500 },
    { name: "Jun", value: 700 },
  ];

  const getStackedData = async () => {
    try {
      setLoading(true);
      const worstAndBestResponse = await api.get<ProductsOverviewResponse>(
        "/products/overview/1"
      );
      setworstAndBestSellers(worstAndBestResponse.data);
      console.log(worstAndBestResponse.data);

      const MonthlyProfitResponse = await api.get<MonthlyRateResponse>(
        "/monthly-rate"
      );
      setMonthlyProfit(MonthlyProfitResponse.data);
      console.log(MonthlyProfitResponse.data);

      const lowStockCountResponse = await api.get<lowStockCountResponse>(
        "/lowStockCount"
      );
      setlowStockCount(lowStockCountResponse.data);
      console.log(MonthlyProfitResponse.data);
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        console.log(err.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStackedData();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Best seller"
          value={
            loading
              ? "Loading..."
              : worstAndBestSellers?.["best sellers"]?.[0]?.name!
          }
          icon={<Medal size={24} />}
        />

        <MetricCard
          title="Worset seller"
          value={
            loading
              ? "Loading..."
              : worstAndBestSellers?.["worst sellers"]?.[0]?.name!
          }
          icon={<ThumbsDown size={24} />}
        />

        <MetricCard
          title="Low stock items"
          value={
            loading
              ? "Loading..."
              : lowStockCount?.["number-of-low-stock-items"]!
          }
          icon={<ShoppingCart size={24} />}
        />

        <MetricCard
          title="Profit"
          value={loading ? "Loading..." : MonthlyProfit?.total_profit!}
          icon={<TrendingUp size={24} />}
        />
      </div>

      <div className="mt-6">
        <LineChart data={chartData} title="Monthly Revenue" />
      </div>
    </div>
  );
}

export default Dashboard;
