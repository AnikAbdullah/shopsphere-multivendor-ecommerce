"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import api from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { popularProducts as fallbackProducts } from "@/data/homeData";
import ProductCard from "@/components/products/ProductCard";
import {
  getProductsFromResponse,
  mergeProductsWithFallback,
} from "@/lib/productHelpers";
import ProductSearch from "@/components/products/ProductSearch";

export default function ProductsPage() {
  const [products, setProducts] = useState(fallbackProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const response = await api.get(endpoints.products.root, {
          params: {
            limit: 12,
            sort: "-createdAt",
          },
        });

        const backendProducts = getProductsFromResponse(response.data?.data);
        const formattedProducts = mergeProductsWithFallback(
          backendProducts,
          fallbackProducts,
          12,
        );

        setProducts(formattedProducts);
      } catch (error) {
        console.log("Failed to fetch products:", error.message);
        setProducts(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-500">
              ShopSphere Collection
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-black sm:text-5xl">
              Explore Products
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
              Browse the latest marketplace products from trusted sellers.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <ProductSearch value={searchTerm} onChange={setSearchTerm} />

            {isLoading && (
              <p className="text-sm font-bold text-neutral-500">
                Loading latest products...
              </p>
            )}
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-[1.5rem] bg-neutral-100 p-8 text-center">
            <p className="text-sm font-bold text-neutral-600">
              No products found for “{searchTerm}”.
            </p>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id || product.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
