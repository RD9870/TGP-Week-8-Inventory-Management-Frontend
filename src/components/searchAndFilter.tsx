import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  Search,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import api from "../api";
import toast from "react-hot-toast";

interface categoryAndSumCategories {
  label: string;
  options: string[];
}

interface catsResponse {
  cats: categoryAndSumCategories[];
}

interface SearchAndFilterProps {
  onSearch: (searchTerm: string) => void;
  onClear: () => void;
  onFilter: (subcategory: string) => void;
}

function SearchAndFilter({
  onSearch,
  onClear,
  onFilter,
}: SearchAndFilterProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [filterData, setfilterData] = useState<categoryAndSumCategories[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  const getCats = async () => {
    try {
      const res = await api.get<catsResponse>("categoriesfilter");
      const finalCats = res.data.cats.filter((cat) => cat.options.length > 0);
      setfilterData(finalCats);
    } catch (error) {
      console.error("Could not load categories", error);
    }
  };

  const handleSubSelection = (opt: string) => {
    setSelectedSub((prev) => (prev === opt ? null : opt));
  };

  const handleApplyFilters = () => {
    if (selectedSub) {
      onFilter(selectedSub);
      setSelectedSub(null);
      setOpenSubMenu(null);
      setIsPanelOpen(false);
    } else {
      toast.error("please select a subcategory");
    }
  };

  const clearEverything = () => {
    setInputValue("");
    setSelectedSub(null);
    onClear();
  };

  useEffect(() => {
    getCats();
  }, []);

  return (
    <div className="w-full bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="sticky top-0 z-40 border-y border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <button
            onClick={clearEverything}
            className="flex items-center space-x-2 text-xs font-medium text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors group"
          >
            <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform" />
            <span className="hidden sm:inline">Clear all</span>
          </button>

          <div className="flex-1 max-w-xl relative group flex items-center bg-slate-100 dark:bg-slate-900 rounded-full p-1 border border-transparent focus-within:border-blue-500/50 transition-all">
            <Search className="ml-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              placeholder="Search products..."
              className="w-full bg-transparent border-none py-1 px-3 text-sm focus:ring-0 dark:text-white placeholder:text-slate-500"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full transition-colors"
            >
              Search
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                handleApplyFilters();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 sm:py-1.5 rounded-full text-xs font-bold transition-all 
               bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 border border-transparent"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>

            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 sm:py-1.5 rounded-full text-xs font-bold transition-all border
    ${
      isPanelOpen
        ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 shadow-lg"
        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
    }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="">Filters</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-300 ${
                  isPanelOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {isPanelOpen && (
          <div className="absolute top-full left-0 w-full bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl z-30">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filterData.map((section) => (
                  <div key={section.label} className="relative">
                    <button
                      onClick={() =>
                        setOpenSubMenu(
                          openSubMenu === section.label ? null : section.label
                        )
                      }
                      className="flex items-center justify-between w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-all group"
                    >
                      {section.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          openSubMenu === section.label
                            ? "rotate-180 text-blue-500"
                            : ""
                        }`}
                      />
                    </button>

                    {openSubMenu === section.label && (
                      <div className="absolute top-[110%] left-0 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="space-y-3">
                          {section.options.map((opt) => (
                            <label
                              key={opt}
                              className="flex items-center space-x-3 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSub === opt}
                                onChange={() => handleSubSelection(opt)}
                                className="peer w-4 h-4 rounded-full border-slate-300 dark:border-slate-700 bg-transparent checked:bg-blue-600 transition-all cursor-pointer"
                              />
                              <span
                                className={`text-xs font-medium transition-colors ${
                                  selectedSub === opt
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-slate-600 dark:text-slate-400"
                                }`}
                              >
                                {opt}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8"></div>
    </div>
  );
}

export default SearchAndFilter;
