import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/product-card";
import ProductFilters from "@/components/market/ProductFilters";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";

// Hook to read query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Market = () => {
  const { addItem } = useCart();
  const query = useQuery();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBudget, setShowBudget] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const resetFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setShowBudget(false);
    setShowAvailableOnly(false);
  };

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products and apply filters from query params
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase.from("products").select("*");

      if (!error && data) {
        setProducts(data);

        // Read and apply query params
        const categoryFromQuery = query.get("category");
        if (categoryFromQuery) {
          setSelectedCategory(categoryFromQuery);
        }

        const budgetFromQuery = query.get("filter");
        if (budgetFromQuery === "under-r20") {
          setShowBudget(true);
        }
      }

      setLoading(false);
    };

    fetchProducts();
  }, []); // Run once on load

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (showBudget && product.price > 20) {
        return false;
      }

      if (showAvailableOnly && !product.available) {
        return false;
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery, showBudget, showAvailableOnly]);

  return (
    <>
      <Navbar />
      <main>
        <div className="container px-4 py-8 mx-auto md:py-12">
          <h1 className="mb-6 text-3xl font-bold">CampusEats Market</h1>

          <ProductFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showBudget={showBudget}
            setShowBudget={setShowBudget}
            showAvailableOnly={showAvailableOnly}
            setShowAvailableOnly={setShowAvailableOnly}
            resetFilters={resetFilters}
          />

          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addItem}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <h3 className="text-xl font-semibold">No products found</h3>
              <p className="mt-2 text-gray-600">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 text-primary-500 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Market;
