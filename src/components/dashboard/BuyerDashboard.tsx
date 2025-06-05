
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BuyerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to CampusEats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Start exploring food options from student vendors around campus.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Button onClick={() => navigate("/market")}>
              Browse Food Options
            </Button>
            <Button variant="outline" onClick={() => navigate("/vendor/register")}>
              Become a Vendor
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You haven't placed any orders yet. Visit the marketplace to find delicious food options!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerDashboard;
