import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  available_from: string | null;
  available_to: string | null;
  categories: { name: string };
}

interface ProductListProps {
  onSuccess?: () => void | Promise<void>;
}

const ProductList: React.FC<ProductListProps> = ({ onSuccess }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch products on mount and after changes
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      // Get vendor ID for current user
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .eq("verified", true)
        .single();

      if (vendorError || !vendorData) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Fetch products for this vendor
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          categories (name)
        `
        )
        .eq("vendor_id", vendorData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      await fetchProducts();
      if (onSuccess) await onSuccess();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const toggleAvailability = async (
    productId: string,
    currentStatus: boolean
  ) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ available: !currentStatus })
        .eq("id", productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Product ${
          !currentStatus ? "enabled" : "disabled"
        } successfully`,
      });

      await fetchProducts();
      if (onSuccess) await onSuccess();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            You haven't added any products yet. Start by adding your first
            product!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col h-full">
          <CardHeader>
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-base sm:text-lg break-words">
                {product.name}
              </CardTitle>
              <Badge variant={product.available ? "default" : "secondary"}>
                {product.available ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-1">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-36 object-cover rounded mb-3"
            />
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
              <span className="text-lg font-bold">R{product.price}</span>
              <Badge variant="outline" className="w-fit">
                {product.categories?.name}
              </Badge>
            </div>
            {(product.available_from || product.available_to) && (
              <p className="text-xs text-muted-foreground mb-3">
                Available: {product.available_from} - {product.available_to}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-2 mt-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toggleAvailability(product.id, product.available)
                }
                className="w-full sm:w-auto"
              >
                {product.available ? "Disable" : "Enable"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(product.id)}
                className="w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;
