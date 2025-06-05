import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import HowItWorks from "@/components/home/HowItWorks";
import VendorCTA from "@/components/home/VendorCTA";
import ProductCard from "@/components/ui/product-card";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

const Index = () => {
  const { addItem } = useCart();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data) {
        setProducts(data);
      }
    };
    fetchProducts();
  }, []);

  // Get popular products (limited to 4)
  const popularProducts = products.slice(0, 4);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        <FeaturedCategories />

        <section className="py-12">
          <div className="container px-4 mx-auto">
            <h2 className="mb-8 text-2xl font-bold text-center md:text-3xl">
              Popular Items
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popularProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addItem}
                />
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href="/market"
                className="inline-block px-6 py-2 font-medium text-primary-500 border-2 border-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-colors"
              >
                View All Products
              </a>
            </div>
          </div>
        </section>

        <HowItWorks />

        <VendorCTA />
      </main>
      <Footer />
    </>
  );
};

export default Index;
