import { useEffect, useState } from "react";
import api from "../api";
import { Loader, Plus, AlertTriangle, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast"; // Professional notification library
import SearchAndFilter from "../components/searchAndFilter";
import PageLoader from "./pageLoader";
import ProductCard from "../components/ui/productCard";
import ProductModal from "../components/productModal";

function ProductsPage() {
  // --- Interfaces ---
  interface subcat {
    id: number;
    name: string;
    category_id: number;
  }

  interface filterResponse {
    "number-results": number;
    results: Product[];
  }

  interface Product {
    id: number;
    code: string;
    name: string;
    subcategory_id: number;
    price: string;
    manufacture_id: number;
    import_company_id: number;
    isStockLow: boolean;
    minimum: number;
    image: string;
    subcategory: subcat;
  }

  interface links {
    url: null | string;
    label: string;
    page: null | number;
    active: boolean;
  }

  interface ProductPaginatioResponse {
    current_page: number;
    data: Product[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: links[];
  }

  // --- State ---
  const [products, setProducts] = useState<Product[]>([]);
  const [pageLinks, setpageLinks] = useState<links[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete Confirmation States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Logic Functions ---

  const getStackedData = async (url: string = "/products") => {
    setIsLoading(true);
    try {
      const response = await api.get<ProductPaginatioResponse>(url);
      setProducts(response.data.data);
      setpageLinks(response.data.links);
    } catch (err: any) {
      console.error("Fetch error", err);
      toast.error("Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm) {
      getStackedData();
      return;
    }
    try {
      const response = await api.get(`products?q=${searchTerm}`);
      if (Array.isArray(response.data)) {
        setProducts(response.data);
        setpageLinks([]);
      } else {
        setProducts(response.data.data || response.data);
        setpageLinks(response.data.links || []);
      }
    } catch (err) {
      toast.error("Search failed. Please try again.");
    }
  };

  const onApplyFilter = async (subCategory: string) => {
    setIsLoading(true);
    setpageLinks([]);
    try {
      const res = await api.get<filterResponse>(`products/sub/${subCategory}`);
      setProducts(res.data["number-results"] === 0 ? [] : res.data.results);
    } catch (err) {
      toast.error("Filter application failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSuccess = () => {
    const message = editingProduct
      ? "Product updated successfully! "
      : "New product added successfully! ";

    toast.success(message);
    setIsModalOpen(false);
    setEditingProduct(null);
    getStackedData(); // Refresh list
  };

  const openDeleteConfirm = (id: number) => {
    setProductIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productIdToDelete === null) return;
    setIsDeleting(true);

    try {
      await api.delete(`products/${productIdToDelete}`);
      setProducts(products.filter((p) => p.id !== productIdToDelete));
      toast.success("Product deleted successfully.");
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error("Could not delete product. Try again later.");
    } finally {
      setIsDeleting(false);
      setProductIdToDelete(null);
    }
  };

  useEffect(() => {
    getStackedData();
  }, []);

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-white">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-7xl mx-auto">
        <SearchAndFilter
          onSearch={handleSearch}
          onClear={getStackedData}
          onFilter={onApplyFilter}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {isLoading ? (
            <div className="text-center py-20 col-span-full flex flex-col items-center justify-center">
              <PageLoader />
            </div>
          ) : (
            <>
              {products.length === 0 ? (
                <div className="text-center col-span-full py-20 flex flex-col items-center justify-center">
                  <h1 className="text-2xl font-bold">No products found</h1>
                  <p className="text-slate-400">
                    Try adjusting your filters or search terms.
                  </p>
                </div>
              ) : (
                <>
                  <div className="col-span-full flex justify-end mb-2">
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                    >
                      <Plus size={20} strokeWidth={3} />
                      Add Product
                    </button>
                  </div>

                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      onEdit={() => {
                        setEditingProduct(product);
                        setIsModalOpen(true);
                      }}
                      onDelete={() => openDeleteConfirm(product.id)}
                    />
                  ))}

                  <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => {
                      setIsModalOpen(false);
                      setEditingProduct(null);
                    }}
                    editingProduct={editingProduct}
                    onSuccess={handleModalSuccess}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && pageLinks.length > 0 && (
        <nav className="flex justify-center mt-10">
          <ul className="inline-flex -space-x-px text-sm">
            {pageLinks.map((link, idx) => {
              if (idx === 0 || idx === pageLinks.length - 1) return null;
              return (
                <li key={idx}>
                  <button
                    disabled={!link.url}
                    onClick={() => link.url && getStackedData(link.url)}
                    className={`flex items-center justify-center w-10 h-10 border transition-colors
                      ${
                        link.active
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                  >
                    {link.page}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-900/20 mb-6">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Delete Product?
              </h3>
              <p className="text-slate-400 mb-8 text-lg">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>

              <div className="flex gap-4">
                <button
                  disabled={isDeleting}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <Loader className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      <Trash2 size={18} /> Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
