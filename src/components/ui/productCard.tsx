import { TriangleAlert, Pencil, Trash2 } from "lucide-react";

interface ProductCardProps {
  id: number | string;
  name: string;
  price: string | number;
  image: string;
  isStockLow: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function ProductCard({
  name,
  price,
  image,
  isStockLow,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all shadow-lg group">
      {/* صورة المنتج */}
      <div className="relative h-48">
        <img
          src={
            image || "https://placehold.co/400x300/1e293b/white?text=No+Image"
          }
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={name}
        />
        {isStockLow ? (
          <div className="absolute top-3 left-3">
            <span className="bg-orange-500/20 border border-orange-500/30 backdrop-blur-md text-orange-400 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 uppercase">
              <TriangleAlert size={12} /> Low Stock
            </span>
          </div>
        ) : null}
      </div>

      <div className="p-5">
        <h3 className="text-white font-semibold text-lg truncate mb-1">
          {name}
        </h3>

        <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4">
          <div className="flex flex-col">
            <span className="text-zinc-500 text-[10px] uppercase font-bold">
              Price
            </span>
            <span className="text-2xl font-bold text-white">${price}</span>
          </div>

          {/* أيقونات الإجراءات (بدلاً من زر إدارة) */}
          {localStorage.getItem("user_type") == "admin" ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // يمنع تداخل الضغطات
                  onEdit();
                }}
                className="p-2.5 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white rounded-xl transition-all active:scale-90"
                title="Edit"
              >
                <Pencil size={18} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all active:scale-90"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

// import { TriangleAlert } from "lucide-react";

// interface ProductCardProps {
//   id: number | string;
//   name: string;
//   price: string | number;
//   image: string;
//   isStockLow: boolean;
// }

// function ProductCard({ name, price, image, isStockLow }: ProductCardProps) {
//   return (
//     <>
//       <div className="max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-xl transition-all hover:border-slate-700">
//         <div className="flex flex-col gap-4">
//           <img
//             className="rounded-lg object-cover w-full h-48"
//             src={image}
//             alt="product image"
//           />

//           {/* Product Info */}
//           <div>
//             <p className="text-lg font-semibold text-slate-100 mb-1">{name}</p>

//             <div className="flex items-center justify-between mt-4">
//               <p className="text-xl font-bold text-white">${price}</p>
//               {isStockLow ? (
//                 <div className="text-right">
//                   <span className="inline-flex items-center rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-400">
//                     <span className="p-1">
//                       <TriangleAlert />
//                     </span>
//                   </span>
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default ProductCard;
