import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-500 to-primary-400 text-white">
      {/* Decorative SVG blob */}
      <svg
        className="absolute left-0 top-0 w-96 h-96 opacity-30 -z-10"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="200" cy="200" r="200" fill="#fff" fillOpacity="0.1" />
      </svg>

      <div className="container px-4 py-20 mx-auto md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl drop-shadow-lg">
              Student Food, For Students, By Students
            </h1>
            <p className="mt-6 text-xl opacity-90 max-w-xl">
              Order snacks, drinks and meals from student vendors on campus, or
              become a vendor yourself.
            </p>
            <div className="flex flex-col gap-4 mt-10 sm:flex-row">
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="font-semibold shadow-lg"
              >
                <Link to="/market">Order Snacks Fast</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-semibold text-slate-500 border-white hover:text-primary-500 hover:bg-white shadow-lg"
              >
                <Link to="/vendor/register">Sell Your Food on Campus</Link>
              </Button>
            </div>
          </div>

          <div className="hidden md:flex justify-center">
            <div className="relative">
              <img
                src="/logo.png"
                alt="CampusEats"
                className="w-[420px] h-auto rounded-2xl shadow-2xl border-4 border-white/30"
              />
              {/* Decorative badge */}
              <div className="absolute bottom-4 left-4 bg-white/80 text-primary-700 px-4 py-2 rounded-full font-semibold shadow">
                100% Student Vendors
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
