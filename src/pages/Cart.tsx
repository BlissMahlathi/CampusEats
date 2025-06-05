import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const paymentMethods = [
  "Cash",
  "eWallet",
  "Capitec",
  "FNB",
  "Standard Bank",
  "Absa",
  "Nedbank",
];

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const navigate = useNavigate();

  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [paymentAmount, setPaymentAmount] = useState(total.toFixed(2));

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number (SA format)
    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    if (!phoneRegex.test(buyerPhone)) {
      toast({
        title: "Invalid Phone",
        description: "Enter a valid South African phone number.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "Cash") {
      const amountNum = parseFloat(paymentAmount);
      if (isNaN(amountNum) || amountNum < total) {
        toast({
          title: "Insufficient Cash",
          description: `Enter an amount equal to or more than ${formatCurrency(
            total
          )}.`,
          variant: "destructive",
        });
        return;
      }
    }

    const order = {
      items,
      buyerName,
      buyerPhone,
      deliveryLocation,
      paymentMethod,
      paymentAmount:
        paymentMethod === "Cash" ? parseFloat(paymentAmount) : total,
      total,
    };

    localStorage.setItem("orderDetails", JSON.stringify(order));
    toast({
      title: "Order placed!",
      description: "Redirecting to confirmation...",
    });
    navigate("/confirmation");
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="container px-4 py-16 mx-auto text-center">
          <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>
          <p className="mb-8">Your cart is empty</p>
          <Button asChild>
            <Link to="/market">Browse Products</Link>
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container px-2 py-6 mx-auto md:py-12">
        <h1 className="mb-6 text-2xl font-extrabold text-primary-700 dark:text-primary-300 text-center">
          Your Cart
        </h1>
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="p-4 sm:p-6 border rounded-2xl shadow bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
              <h2 className="mb-4 text-lg font-semibold text-primary-700 dark:text-primary-300">
                Cart Items
              </h2>
              <div className="divide-y dark:divide-slate-700">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="py-4 flex flex-col sm:flex-row items-center gap-4"
                  >
                    <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <h3 className="font-semibold truncate text-slate-900 dark:text-slate-100">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(item.product.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-medium text-slate-900 dark:text-slate-100">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                      onClick={() => removeItem(item.product.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between items-center pt-6 mt-6 border-t border-slate-200 dark:border-slate-700 gap-4">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="rounded-lg w-full sm:w-auto"
                >
                  Clear Cart
                </Button>
                <div className="text-lg font-bold text-primary-700 dark:text-primary-300">
                  Total: {formatCurrency(total)}
                </div>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div>
            <form
              onSubmit={handleCheckout}
              className="p-4 sm:p-6 border rounded-2xl shadow bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 sticky top-24"
            >
              <h2 className="mb-4 text-lg font-semibold text-primary-700 dark:text-primary-300 text-center sm:text-left">
                Delivery Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-1 text-sm font-medium text-slate-900 dark:text-slate-100"
                  >
                    Your Name
                  </label>
                  <Input
                    id="name"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-1 text-sm font-medium text-slate-900 dark:text-slate-100"
                  >
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    required
                    placeholder="e.g. 0812345678"
                    className="bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block mb-1 text-sm font-medium text-slate-900 dark:text-slate-100"
                  >
                    Delivery Location
                  </label>
                  <Input
                    id="location"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    required
                    placeholder="Your residence/building"
                    className="bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label
                    htmlFor="payment-method"
                    className="block mb-1 text-sm font-medium text-slate-900 dark:text-slate-100"
                  >
                    Payment Method
                  </label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900">
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === "Cash" && (
                  <div>
                    <label
                      htmlFor="payment-amount"
                      className="block mb-1 text-sm font-medium text-slate-900 dark:text-slate-100"
                    >
                      Amount You Will Pay (for change)
                    </label>
                    <Input
                      id="payment-amount"
                      type="number"
                      min={total}
                      step="0.01"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      required
                      className="bg-slate-50 dark:bg-slate-800"
                    />
                    {parseFloat(paymentAmount) > total && (
                      <p className="text-sm text-green-600 mt-1">
                        Expected Change:{" "}
                        {formatCurrency(parseFloat(paymentAmount) - total)}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full font-semibold text-lg rounded-lg shadow bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-700 dark:hover:bg-primary-800"
                >
                  Place Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
