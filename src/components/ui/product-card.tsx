
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { name, description, price, image, available } = product;
  
  return (
    <Card className="overflow-hidden transition-shadow border hover:shadow-md">
      <div className="relative h-48 bg-gray-100">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full"
          loading="lazy"
        />
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <p className="px-3 py-1 text-sm font-medium text-white bg-black rounded">
              Currently Unavailable
            </p>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold line-clamp-1">{name}</h3>
          <p className="font-bold text-primary-500">
            {formatCurrency(price)}
          </p>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(product)}
          variant="default"
          className="w-full"
          disabled={!available}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
