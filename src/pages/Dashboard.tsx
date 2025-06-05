import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import BuyerDashboard from "@/components/dashboard/BuyerDashboard";
import VendorDashboard from "@/components/dashboard/VendorDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

const Dashboard = () => {
  const { user, profile, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If user exists but no profile, show a message to create profile
  if (user && !profile) {
    return (
      <>
        <Navbar />
        <main className="container px-2 py-8 mx-auto md:py-12">
          <Card>
            <CardHeader>
              <CardTitle>Profile Setup Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                It looks like your profile hasn't been created yet. This usually
                happens automatically when you sign up.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  onClick={() => navigate("/login")}
                >
                  Sign In Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  // If no user at all, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDashboardTitle = () => {
    switch (profile?.role) {
      case UserRole.ADMIN:
        return "Admin Dashboard";
      case UserRole.VENDOR:
        return "Vendor Dashboard";
      case UserRole.BUYER:
      default:
        return "Dashboard";
    }
  };

  return (
    <>
      <Navbar />
      <main className="container px-2 py-8 mx-auto md:py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {getDashboardTitle()}
          </h1>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full md:w-auto"
          >
            Sign Out
          </Button>
        </div>

        {profile && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm sm:text-base">
                <div>
                  <span className="font-medium">Name:</span> {profile.name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {profile.email}
                </div>
                <div>
                  <span className="font-medium">Role:</span> {profile.role}
                </div>
                {profile.phone && (
                  <div>
                    <span className="font-medium">Phone:</span> {profile.phone}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          {profile?.role === UserRole.ADMIN && <AdminDashboard />}
          {profile?.role === UserRole.VENDOR && <VendorDashboard />}
          {profile?.role === UserRole.BUYER && <BuyerDashboard />}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
