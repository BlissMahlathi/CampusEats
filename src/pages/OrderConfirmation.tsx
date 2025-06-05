import React, { useEffect, useState } from "react";
import { useLocation, Link, Navigate, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { generateWhatsAppLink, formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types";
import { CheckCircle, MessageCircle } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  whatsappNumber: string;
}

interface OrderDetails {
  items: CartItem[];
  buyerName: string;
  buyerPhone: string;
  deliveryLocation: string;
  paymentMethod: string;
  paymentAmount: number;
  total: number;
}

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [checkingOrder, setCheckingOrder] = useState(true); // <-- NEW STATE

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedOrder = localStorage.getItem("orderDetails");
    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));
      console.log(
        "Order details loaded from localStorage:",
        JSON.parse(storedOrder)
      );
      localStorage.removeItem("orderDetails");
    }
    setCheckingOrder(false); // <-- Mark checking as done
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      const { data, error } = await supabase.from("vendors").select("*");
      if (!error && data) {
        setVendors(
          data.map((vendor: any) => ({
            id: vendor.id,
            name: vendor.name,
            whatsappNumber: vendor.whatsapp_number,
          }))
        );
      }
      setLoading(false);
    };
    fetchVendors();
  }, []);

  if (checkingOrder || loading) {
    return <div>Loading...</div>;
  }

  if (!orderDetails) {
    return <Navigate to="/" />;
  }

  const vendorId = orderDetails.items[0]?.product.vendorId;
  const vendor = vendors.find((v) => v.id === vendorId);

  if (!vendor) {
    return <Navigate to="/" />;
  }

  const message = `🛒 *New Order from ${orderDetails.buyerName}*
📍 Delivery to: ${orderDetails.deliveryLocation}
📞 Phone: ${orderDetails.buyerPhone}

*Ordered Items:*
${orderDetails.items
  .map(
    (item) =>
      `- ${item.product.name} x${item.quantity} (${formatCurrency(
        item.product.price * item.quantity
      )})`
  )
  .join("\n")}

💰 *Total: ${formatCurrency(orderDetails.total)}*
💳 *Payment: ${orderDetails.paymentMethod}*
${
  orderDetails.paymentMethod === "Cash"
    ? `💵 *Customer will pay with: ${formatCurrency(
        orderDetails.paymentAmount
      )}*`
    : ""
}`;

  const whatsappLink = generateWhatsAppLink(vendor.whatsappNumber, message);

  return (
    <>
      <Navbar />
      <main className="container px-4 py-8 mx-auto md:py-12">
        <div className="max-w-2xl mx-auto p-6 border rounded-2xl shadow-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
          <div className="flex flex-col items-center p-4 mb-6 bg-green-50 dark:bg-green-900/30 rounded-xl">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mb-2" />
            <h1 className="text-2xl font-bold text-green-700 dark:text-green-300">
              Order Placed Successfully!
            </h1>
            <p className="mt-2 text-gray-700 dark:text-gray-200 text-center">
              Thank you for your order. The vendor will contact you soon.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">
                Order Details
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Vendor
                  </h3>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {vendor.name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Delivery Information
                  </h3>
                  <p className="text-slate-900 dark:text-slate-100">
                    <span className="block">{orderDetails.buyerName}</span>
                    <span className="block">{orderDetails.buyerPhone}</span>
                    <span className="block">
                      {orderDetails.deliveryLocation}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Payment Method
                  </h3>
                  <p className="text-slate-900 dark:text-slate-100">
                    {orderDetails.paymentMethod}
                  </p>
                  {orderDetails.paymentMethod === "Cash" && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      You indicated you'll pay with{" "}
                      {formatCurrency(orderDetails.paymentAmount)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Order Summary
              </h3>
              <div className="mt-2 divide-y border-t border-slate-200 dark:border-slate-700">
                {orderDetails.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="py-2 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {item.product.name}
                      </span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                <span className="font-semibold text-primary-700 dark:text-primary-300">
                  Total
                </span>
                <span className="font-semibold text-primary-700 dark:text-primary-300">
                  {formatCurrency(orderDetails.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Button
              asChild
              className="w-full text-lg font-bold flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              size="lg"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5" />
                Message Vendor on WhatsApp
              </a>
            </Button>

            <div className="text-center">
              <Link
                to="/market"
                className="text-primary-500 hover:underline font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
