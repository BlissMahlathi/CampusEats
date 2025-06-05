import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import ProductForm from "@/components/products/ProductForm";
import ProductList from "@/components/products/ProductList";
import VendorPerformanceChart from "@/components/charts/VendorPerformanceChart";
import CategoryManager from "@/components/categories/CategoryManager";
import { Plus } from "lucide-react";

interface VendorStats {
  total_sales: number;
  total_orders: number;
  rating: number;
  is_promoted: boolean;
}

interface VendorData {
  id: string;
  total_sales: number;
  total_orders: number;
  rating: number;
  is_promoted: boolean;
}

interface Order {
  id: string;
  buyer_name: string;
  total: number;
  status: string;
  created_at: string;
}

const VendorDashboard = () => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [stats, setStats] = useState<VendorStats>({
    total_sales: 0,
    total_orders: 0,
    rating: 0,
    is_promoted: false,
  });
  const [vendorId, setVendorId] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    if (!user) return;

    try {
      // Get vendor stats
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("id, total_sales, total_orders, rating, is_promoted")
        .eq("user_id", user.id)
        .maybeSingle();

      if (vendorError) {
        console.error("Error fetching vendor data:", vendorError);
      } else if (vendorData) {
        setStats({
          total_sales: vendorData.total_sales || 0,
          total_orders: vendorData.total_orders || 0,
          rating: vendorData.rating || 0,
          is_promoted: vendorData.is_promoted || false,
        });
        setVendorId(vendorData.id);

        // Get recent orders using the vendor ID
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("id, buyer_name, total, status, created_at")
          .eq("vendor_id", vendorData.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
        } else {
          setOrders(ordersData || []);
        }
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch vendor data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stats.is_promoted && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center justify-center py-4">
            <Badge variant="default" className="bg-yellow-500 text-white">
              ⭐ PROMOTED VENDOR ⭐
            </Badge>
          </CardContent>
        </Card>
      )}

      <VendorPerformanceChart stats={stats} />

      <Tabs defaultValue="orders">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-muted-foreground">
                  You don't have any recent orders. Add products to start
                  selling!
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-4 border rounded"
                    >
                      <div>
                        <p className="font-medium">{order.buyer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.total}</p>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <div className="space-y-6">
            {!showProductForm ? (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Products</CardTitle>
                  <Button onClick={() => setShowProductForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </CardHeader>
              </Card>
            ) : (
              <ProductForm
                onSuccess={() => {
                  setShowProductForm(false);
                  // Refresh the product list
                  window.location.reload();
                }}
              />
            )}

            {showProductForm && (
              <Button
                variant="outline"
                onClick={() => setShowProductForm(false)}
                className="mb-4"
              >
                Cancel
              </Button>
            )}

            <ProductList onSuccess={fetchVendorData} />
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorDashboard;
