import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  CheckCircle,
  XCircle,
  Eye,
  Users,
  Store,
  TrendingUp,
  Trash2,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import AdminStatsChart from "@/components/charts/AdminStatsChart";
import CategoryManager from "@/components/categories/CategoryManager";
import CustomerManager from "@/components/customers/CustomerManager";
import AdminProductManager from "@/components/products/AdminProductManager.tsx";

interface Vendor {
  id: string;
  name: string;
  email: string;
  whatsapp_number: string;
  description: string;
  student_id: string;
  student_card_image: string;
  student_id_image: string;
  verified: boolean;
  rejection_reason: string | null;
  created_at: string;
  total_sales: number;
  total_orders: number;
  rating: number;
  is_promoted: boolean;
}

interface MonthlyData {
  month: string;
  sales: number;
  orders: number;
}

const AdminDashboard = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [adminStats, setAdminStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalVendors: 0,
    salesData: [] as MonthlyData[],
    vendorStats: [] as Array<{ status: string; count: number }>,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchVendors();
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      console.log("Fetching admin stats...");

      // Get all completed orders with dates
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("total, created_at")
        .eq("status", "completed");

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        throw ordersError;
      }

      // Get vendor statistics
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("verified, rejection_reason");

      if (vendorError) {
        console.error("Error fetching vendors:", vendorError);
        throw vendorError;
      }

      console.log("Orders data:", ordersData);
      console.log("Vendor data:", vendorData);

      const totalSales =
        ordersData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const totalOrders = ordersData?.length || 0;
      const totalVendors = vendorData?.length || 0;

      // Generate monthly sales data for the last 6 months
      const monthlyStats: { [key: string]: { sales: number; orders: number } } =
        {};
      const months = [];

      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
        const monthName = date.toLocaleDateString("en-US", { month: "short" });
        months.push({ key: monthKey, name: monthName });
        monthlyStats[monthKey] = { sales: 0, orders: 0 };
      }

      // Aggregate orders by month
      ordersData?.forEach((order) => {
        const orderMonth = order.created_at.slice(0, 7); // YYYY-MM format
        if (monthlyStats[orderMonth]) {
          monthlyStats[orderMonth].sales += Number(order.total);
          monthlyStats[orderMonth].orders += 1;
        }
      });

      // Convert to chart format
      const salesData = months.map((month) => ({
        month: month.name,
        sales: Number(monthlyStats[month.key].sales.toFixed(2)),
        orders: monthlyStats[month.key].orders,
      }));

      // Vendor distribution stats
      const verified = vendorData?.filter((v) => v.verified).length || 0;
      const pending =
        vendorData?.filter((v) => !v.verified && !v.rejection_reason).length ||
        0;
      const rejected =
        vendorData?.filter((v) => v.rejection_reason).length || 0;

      const newStats = {
        totalSales,
        totalOrders,
        totalVendors,
        salesData,
        vendorStats: [
          { status: "verified", count: verified },
          { status: "pending", count: pending },
          { status: "rejected", count: rejected },
        ],
      };

      console.log("Setting admin stats:", newStats);
      setAdminStats(newStats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch admin statistics",
        variant: "destructive",
      });
    }
  };

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast({
        title: "Error",
        description: "Failed to fetch vendor applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVendor = async (vendorId: string) => {
    setProcessing(vendorId);
    try {
      const { error } = await supabase
        .from("vendors")
        .update({ verified: true, rejection_reason: null })
        .eq("id", vendorId);

      if (error) throw error;

      toast({
        title: "Vendor Approved",
        description: "The vendor application has been approved",
      });

      fetchVendors();
      fetchAdminStats(); // Refresh stats
    } catch (error) {
      console.error("Error approving vendor:", error);
      toast({
        title: "Error",
        description: "Failed to approve vendor",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectVendor = async (vendorId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason",
        variant: "destructive",
      });
      return;
    }

    setProcessing(vendorId);
    try {
      const { error } = await supabase
        .from("vendors")
        .update({ verified: false, rejection_reason: rejectionReason })
        .eq("id", vendorId);

      if (error) throw error;

      toast({
        title: "Vendor Rejected",
        description: "The vendor application has been rejected",
      });

      setRejectionReason("");
      fetchVendors();
      fetchAdminStats(); // Refresh stats
    } catch (error) {
      console.error("Error rejecting vendor:", error);
      toast({
        title: "Error",
        description: "Failed to reject vendor",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    setProcessing(vendorId);
    try {
      const { error } = await supabase
        .from("vendors")
        .delete()
        .eq("id", vendorId);

      if (error) throw error;

      toast({
        title: "Vendor Deleted",
        description: "The vendor has been deleted successfully",
      });

      fetchVendors();
      fetchAdminStats(); // Refresh stats
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handlePromoteVendor = async (
    vendorId: string,
    currentStatus: boolean
  ) => {
    setProcessing(vendorId);
    try {
      const { error } = await supabase
        .from("vendors")
        .update({ is_promoted: !currentStatus })
        .eq("id", vendorId);

      if (error) throw error;

      toast({
        title: currentStatus ? "Vendor Demoted" : "Vendor Promoted",
        description: `The vendor has been ${
          currentStatus ? "demoted" : "promoted"
        } successfully`,
      });

      fetchVendors();
    } catch (error) {
      console.error("Error updating vendor promotion:", error);
      toast({
        title: "Error",
        description: "Failed to update vendor promotion",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const getImageUrl = async (path: string) => {
    const { data } = await supabase.storage
      .from("vendor-documents")
      .createSignedUrl(path, 3600);
    return data?.signedUrl;
  };

  const pendingVendors = vendors.filter(
    (v) => v.verified === false && !v.rejection_reason
  );
  const approvedVendors = vendors.filter((v) => v.verified === true);
  const rejectedVendors = vendors.filter((v) => v.rejection_reason);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${adminStats.totalSales.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalVendors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingVendors.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <AdminStatsChart stats={adminStats} />

      {/* Management Tabs */}
      <div className="w-full">
        <Tabs defaultValue="vendors" className="w-full">
          <TabsList className="mb-4 flex flex-wrap gap-2">
            <TabsTrigger value="vendors">Vendor Management</TabsTrigger>
            <TabsTrigger value="customers">Customer Management</TabsTrigger>
            <TabsTrigger value="categories">Category Management</TabsTrigger>
            <TabsTrigger value="products">Product Management</TabsTrigger>
          </TabsList>

          <TabsContent value="vendors" className="space-y-4">
            <Tabs defaultValue="approved" className="w-full">
              <TabsList className="mb-4 flex flex-wrap gap-2">
                <TabsTrigger value="approved">
                  Approved ({approvedVendors.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending Review ({pendingVendors.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedVendors.length})
                </TabsTrigger>
              </TabsList>

              {/* Vendor Cards */}
              <TabsContent value="approved">
                <Card>
                  <CardHeader>
                    <CardTitle>Approved Vendors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {approvedVendors.length === 0 ? (
                      <p className="text-muted-foreground">
                        No approved vendors yet
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {approvedVendors.map((vendor) => (
                          <VendorCard
                            key={vendor.id}
                            vendor={vendor}
                            onDelete={handleDeleteVendor}
                            onPromote={handlePromoteVendor}
                            processing={processing}
                            getImageUrl={getImageUrl}
                            approved
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pending">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Vendor Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pendingVendors.length === 0 ? (
                      <p className="text-muted-foreground">
                        No pending applications
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {pendingVendors.map((vendor) => (
                          <VendorCard
                            key={vendor.id}
                            vendor={vendor}
                            onApprove={handleApproveVendor}
                            onReject={handleRejectVendor}
                            onDelete={handleDeleteVendor}
                            processing={processing}
                            rejectionReason={rejectionReason}
                            setRejectionReason={setRejectionReason}
                            getImageUrl={getImageUrl}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rejected">
                <Card>
                  <CardHeader>
                    <CardTitle>Rejected Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {rejectedVendors.length === 0 ? (
                      <p className="text-muted-foreground">
                        No rejected applications
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {rejectedVendors.map((vendor) => (
                          <VendorCard
                            key={vendor.id}
                            vendor={vendor}
                            onDelete={handleDeleteVendor}
                            processing={processing}
                            getImageUrl={getImageUrl}
                            rejected
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="customers">
            <CustomerManager />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="products">
            <AdminProductManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface VendorCardProps {
  vendor: Vendor;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPromote?: (id: string, currentStatus: boolean) => void;
  processing?: string | null;
  rejectionReason?: string;
  setRejectionReason?: (reason: string) => void;
  getImageUrl: (path: string) => Promise<string | undefined>;
  approved?: boolean;
  rejected?: boolean;
}

const VendorCard = ({
  vendor,
  onApprove,
  onReject,
  onDelete,
  onPromote,
  processing,
  rejectionReason,
  setRejectionReason,
  getImageUrl,
  approved,
  rejected,
}: VendorCardProps) => {
  const [showImages, setShowImages] = useState(false);
  const [imageUrls, setImageUrls] = useState<{
    studentCard?: string;
    studentId?: string;
  }>({});

  const loadImages = async () => {
    if (vendor.student_card_image && vendor.student_id_image) {
      const [cardUrl, idUrl] = await Promise.all([
        getImageUrl(vendor.student_card_image),
        getImageUrl(vendor.student_id_image),
      ]);
      setImageUrls({
        studentCard: cardUrl,
        studentId: idUrl,
      });
    }
  };

  const handleViewImages = () => {
    if (!showImages) {
      loadImages();
    }
    setShowImages(true);
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{vendor.name}</h3>
            {vendor.is_promoted && (
              <Badge className="bg-yellow-500">
                <Star className="h-3 w-3 mr-1" />
                Promoted
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{vendor.email}</p>
          <p className="text-sm text-muted-foreground">
            WhatsApp: {vendor.whatsapp_number}
          </p>
          <p className="text-sm text-muted-foreground">
            Student ID: {vendor.student_id}
          </p>
          <p className="text-sm mt-2">{vendor.description}</p>

          {approved && (
            <div className="mt-2 text-sm">
              <span className="font-medium">Performance:</span>$
              {vendor.total_sales || 0} sales, {vendor.total_orders || 0}{" "}
              orders,
              {vendor.rating || 0}/5 rating
            </div>
          )}
        </div>

        <div className="flex flex-row sm:flex-col items-end gap-2">
          {approved && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              Approved
            </Badge>
          )}
          {rejected && <Badge variant="destructive">Rejected</Badge>}

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleViewImages}>
                <Eye className="h-4 w-4 mr-2" />
                View Documents
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Vendor Documents - {vendor.name}</DialogTitle>
                <DialogDescription>
                  Review the submitted documents for verification
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Student Card</h4>
                  {imageUrls.studentCard ? (
                    <img
                      src={imageUrls.studentCard}
                      alt="Student Card"
                      className="w-full h-48 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted rounded border flex items-center justify-center">
                      Loading...
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium mb-2">Verification Photo</h4>
                  {imageUrls.studentId ? (
                    <img
                      src={imageUrls.studentId}
                      alt="Student ID"
                      className="w-full h-48 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted rounded border flex items-center justify-center">
                      Loading...
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {rejected && vendor.rejection_reason && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-800">
            <strong>Rejection Reason:</strong> {vendor.rejection_reason}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
        {!approved && !rejected && onApprove && onReject && (
          <>
            <Button
              onClick={() => onApprove(vendor.id)}
              disabled={processing === vendor.id}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {processing === vendor.id ? "Processing..." : "Approve"}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={processing === vendor.id}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Application</DialogTitle>
                  <DialogDescription>
                    Please provide a reason for rejecting this vendor
                    application.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter rejection reason..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason?.(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => onReject(vendor.id)}
                      disabled={
                        processing === vendor.id || !rejectionReason?.trim()
                      }
                    >
                      {processing === vendor.id
                        ? "Processing..."
                        : "Confirm Rejection"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}

        {approved && onPromote && (
          <Button
            onClick={() => onPromote(vendor.id, vendor.is_promoted)}
            disabled={processing === vendor.id}
            variant={vendor.is_promoted ? "outline" : "default"}
            className={
              vendor.is_promoted ? "" : "bg-yellow-600 hover:bg-yellow-700"
            }
          >
            <Star className="h-4 w-4 mr-2" />
            {vendor.is_promoted ? "Remove Promotion" : "Promote Vendor"}
          </Button>
        )}

        {onDelete && (
          <Button
            onClick={() => onDelete(vendor.id)}
            disabled={processing === vendor.id}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
