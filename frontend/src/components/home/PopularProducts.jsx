"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { popularProducts as fallbackProducts } from "@/data/homeData";
import ProductCard from "@/components/products/ProductCard";
import {
  getProductsFromResponse,
  mergeProductsWithFallback,
} from "@/lib/productHelpers";

export default function PopularProducts() {
  const [products, setProducts] = useState(fallbackProducts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setIsLoading(true);

        const featuredResponse = await api.get(endpoints.products.featured);
        const featuredProducts = getProductsFromResponse(
          featuredResponse.data?.data,
        );

        if (featuredProducts.length > 0) {
          const mergedProducts = mergeProductsWithFallback(
            backendProducts,
            fallbackProducts,
            8,
          );
          return;
        }

        const latestResponse = await api.get(endpoints.products.root, {
          params: {
            limit: 8,
            sort: "-createdAt",
          },
        });

        const latestProducts = getProductsFromResponse(
          latestResponse.data?.data,
        );

        if (latestProducts.length > 0) {
          const mergedProducts = mergeWithFallbackProducts(latestProducts);
          setProducts(mergedProducts);
          return;
        }

        setProducts(fallbackProducts);
      } catch (error) {
        console.log("Failed to fetch popular products:", error.message);
        setProducts(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPopularProducts();
  }, []);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-black">
            Popular Products
          </h2>

          {isLoading && (
            <p className="mt-1 text-sm font-semibold text-neutral-500">
              Checking latest products...
            </p>
          )}
        </div>

        <Link
          href="/products"
          className="text-sm font-bold text-neutral-600 transition hover:text-black"
        >
          Show More →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
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
    </div>
  );
}
