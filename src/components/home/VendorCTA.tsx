import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";

const VendorCTA = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-100 via-primary-50 to-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center bg-white/90 rounded-2xl shadow-xl px-8 py-12 relative overflow-hidden">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-200 shadow">
              <ChefHat className="w-8 h-8 text-primary-600" />
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-extrabold text-primary-700 md:text-4xl">
            Are You a Student with Food to Sell?
          </h2>
          <p className="mb-8 text-gray-700 text-lg">
            Join{" "}
            <span className="font-semibold text-primary-600">CampusEats</span>{" "}
            as a vendor and start selling your food, snacks, or drinks to other
            students on campus. Easy registration, flexible hours, and direct
            communication with buyers.
          </p>
          <Button
            asChild
            size="lg"
            className="font-bold shadow-lg text-lg px-8 py-4"
          >
            <Link to="/vendor/register">Become a Vendor Today</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VendorCTA;
