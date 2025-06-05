import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    id: "1",
    name: "Drinks",
    image: "/drinks.jpeg",
    link: "/market?category=Drinks",
  },
  {
    id: "2",
    name: "Snacks",
    image: "/snacks.jpeg",
    link: "/market?category=Snacks",
  },
  {
    id: "3",
    name: "Hot Meals",
    image: "/hot-meals.jpeg",
    link: "/market?category=Hot-meals",
  },
  {
    id: "4",
    name: "Budget Deals",
    image: "/budget.jpeg",
    link: "/market?filter=under-r20",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-14 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 mx-auto">
        <h2 className="mb-10 text-3xl font-extrabold text-center text-primary-700 md:text-4xl">
          Browse Popular Categories
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} to={category.link} className="group">
              <Card className="overflow-hidden rounded-2xl shadow-md transition-transform duration-200 group-hover:scale-105 group-hover:shadow-xl border-0 bg-white">
                <div className="relative h-36 md:h-48">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-110"
                  />
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg mb-2">
                      {category.name}
                    </h3>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="inline-block px-4 py-1 bg-white/90 text-primary-700 rounded-full text-sm font-semibold shadow">
                        View
                      </span>
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
