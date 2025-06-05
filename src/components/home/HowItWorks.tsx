import React from "react";
import { Search, ShoppingCart, Wallet, Sandwich } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Browse Products",
    description:
      "Explore snacks, drinks and meals from student vendors on campus",
    icon: <Search className="w-8 h-8 text-primary-500" />,
  },
  {
    id: 2,
    title: "Place Your Order",
    description: "Add items to cart and provide your delivery details",
    icon: <ShoppingCart className="w-8 h-8 text-primary-500" />,
  },
  {
    id: 3,
    title: "Pay on Delivery",
    description: "Pay with cash, eWallet, bank transfer or other methods",
    icon: <Wallet className="w-8 h-8 text-primary-500" />,
  },
  {
    id: 4,
    title: "Enjoy Your Food",
    description: "Receive your order directly from the student vendor",
    icon: <Sandwich className="w-8 h-8 text-primary-500" />,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-primary-50 via-white to-white">
      <div className="container px-4 mx-auto">
        <h2 className="mb-2 text-3xl font-extrabold text-center text-primary-700 md:text-4xl">
          How CampusEats Works
        </h2>
        <p className="max-w-2xl mx-auto mb-10 text-center text-gray-600">
          Quick and easy food ordering from student vendors on campus
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="relative p-8 pt-12 text-center bg-white rounded-2xl border border-primary-100 shadow transition-transform duration-200 hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full shadow-lg border-4 border-white">
                  {step.icon}
                </span>
                <span className="mt-2 text-xs font-bold text-primary-500 tracking-widest uppercase">
                  Step {idx + 1}
                </span>
              </div>
              <h3 className="mb-2 mt-6 text-lg font-semibold text-slate-800">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
