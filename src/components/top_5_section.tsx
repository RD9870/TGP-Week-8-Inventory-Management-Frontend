import { Medal, ThumbsDown, ShoppingCart, X } from "lucide-react";

interface GenericProduct {
  product_id?: number | string;
  id?: number | string;
  name: string;
  image: string;
  price?: number | string;
  total_quantity?: number | string;
}

interface ProductInsightSectionProps {
  type: "best" | "worst" | "low-stock";
  products: GenericProduct[];
  onClose: () => void;
}

const THEMES = {
  best: {
    containerBorder: "border-blue-100",
    iconBg: "bg-yellow-50",
    iconBorder: "border-yellow-100",
    iconColor: "text-yellow-500",
    Icon: Medal,
    title: "Best Selling Products",
    subtitle: "Products with the best sales volume",
    badge: "Top 5",
    badgeBg: "bg-blue-600",
    hoverBorder: "hover:border-blue-400",
  },
  worst: {
    containerBorder: "border-red-100",
    iconBg: "bg-red-50",
    iconBorder: "border-red-100",
    iconColor: "text-red-500",
    Icon: ThumbsDown,
    title: "Worst Selling Products",
    subtitle: "Products with the lowest sales volume",
    badge: "Bottom 5",
    badgeBg: "bg-red-600",
    hoverBorder: "hover:border-red-400",
  },
  "low-stock": {
    containerBorder: "border-red-100",
    iconBg: "bg-red-50",
    iconBorder: "border-red-100",
    iconColor: "text-orange-500",
    Icon: ShoppingCart,
    title: "Low Stock Products",
    subtitle: "Products with low stock levels",
    badge: "Most Needed 5",
    badgeBg: "bg-orange-600",
    hoverBorder: "hover:border-red-400",
  },
};

function ProductsDetailsSection({
  type,
  products,
  onClose,
}: ProductInsightSectionProps) {
  const theme = THEMES[type];
  const { Icon } = theme;

  return (
    <div
      className={`mt-8 p-8 bg-white rounded-2xl border ${theme.containerBorder} shadow-xl animate-in fade-in slide-in-from-top-4 duration-500`}
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 ${theme.iconBg} rounded-2xl border ${theme.iconBorder}`}
          >
            <Icon className={theme.iconColor} size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                {theme.title}
              </h2>
              <span
                className={`${theme.badgeBg} text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase`}
              >
                {theme.badge}
              </span>
            </div>
            {theme.subtitle && (
              <p className="text-sm text-gray-500 mt-1 font-medium">
                {theme.subtitle}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {products.slice(0, 5).map((product, index) => {
          const productId = product.product_id || product.id;

          return (
            <div
              key={productId}
              className={`group bg-white rounded-2xl p-4 border border-gray-100 ${theme.hoverBorder} hover:shadow-lg transition-all relative`}
            >
              <div
                className={`absolute -top-3 -left-2 w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg z-10 rotate-[-10deg] group-hover:rotate-0 transition-transform ${
                  type === "best"
                    ? index === 0
                      ? "bg-linear-to-br from-yellow-400 to-orange-500"
                      : index === 1
                      ? "bg-linear-to-br from-gray-300 to-gray-500"
                      : index === 2
                      ? "bg-linear-to-br from-amber-600 to-amber-800"
                      : "bg-linear-to-br from-blue-400 to-blue-600"
                    : "bg-linear-to-br from-red-400 to-red-600"
                }`}
              >
                #{index + 1}
              </div>

              <div className="aspect-square w-full mb-4 overflow-hidden rounded-xl bg-gray-50 border border-gray-100 p-2 group-hover:bg-white transition-colors">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <h3
                className="text-base font-bold text-gray-900 truncate mb-3"
                title={product.name}
              >
                {product.name}
              </h3>

              {type !== "low-stock" && (
                <div
                  className={`flex justify-between items-center p-2.5 rounded-xl transition-colors ${
                    type === "best"
                      ? "bg-blue-50"
                      : "bg-gray-50 group-hover:bg-red-50"
                  }`}
                >
                  <span
                    className={`${
                      type === "best" ? "text-blue-600" : "text-red-700"
                    } font-black text-sm`}
                  >
                    {product.price} $
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] uppercase font-bold text-gray-400 leading-none mb-0.5">
                      Sold
                    </span>
                    <span className="text-base font-black text-gray-800 leading-none">
                      {product.total_quantity}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductsDetailsSection;
