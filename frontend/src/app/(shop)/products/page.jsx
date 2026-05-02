"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { popularProducts as fallbackProducts } from "@/data/homeData";
import ProductCard from "@/components/products/ProductCard";
import ProductSearch from "@/components/products/ProductSearch";
import ProductSort from "@/components/products/ProductSort";
import ProductCategoryFilter from "@/components/products/ProductCategoryFilter";
import ProductPriceFilter from "@/components/products/ProductPriceFilter";
import {
  getProductsFromResponse,
  mergeProductsWithFallback,
} from "@/lib/productHelpers";

export default function ProductsPage() {
  const [products, setProducts] = useState(fallbackProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

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

  const getNumericPrice = (price) => {
    return Number(String(price).replace(/[^\d]/g, ""));
  };

  const matchesPriceRange = (price, range) => {
    const numericPrice = getNumericPrice(price);

    if (range === "under-10000") {
      return numericPrice < 10000;
    }

    if (range === "10000-20000") {
      return numericPrice >= 10000 && numericPrice <= 20000;
    }

    if (range === "20000-50000") {
      return numericPrice >= 20000 && numericPrice <= 50000;
    }

    if (range === "over-50000") {
      return numericPrice > 50000;
    }

    return true;
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory
        ? String(product.category || "")
            .toLowerCase()
            .includes(selectedCategory.toLowerCase())
        : true;

      const matchesPrice = matchesPriceRange(product.price, priceRange);

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((firstProduct, secondProduct) => {
      const firstPrice = getNumericPrice(firstProduct.price);
      const secondPrice = getNumericPrice(secondProduct.price);

      if (sortBy === "price-low") {
        return firstPrice - secondPrice;
      }

      if (sortBy === "price-high") {
        return secondPrice - firstPrice;
      }

      if (sortBy === "rating-high") {
        return (
          Number(secondProduct.rating || 0) - Number(firstProduct.rating || 0)
        );
      }

      if (sortBy === "name-az") {
        return firstProduct.name.localeCompare(secondProduct.name);
      }

      return 0;
    });

  const hasActiveFilters =
    searchTerm ||
    selectedCategory ||
    sortBy !== "default" ||
    priceRange !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("default");
    setPriceRange("all");
    router.push("/products");
  };

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

            {selectedCategory && (
              <p className="mt-2 text-sm font-bold text-orange-500">
                Filtering by category: {selectedCategory}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex flex-col gap-3 sm:flex-row">
              <ProductSearch value={searchTerm} onChange={setSearchTerm} />
              <ProductSort value={sortBy} onChange={setSortBy} />
              <ProductPriceFilter value={priceRange} onChange={setPriceRange} />
            </div>

            {isLoading && (
              <p className="text-sm font-bold text-neutral-500">
                Loading latest products...
              </p>
            )}
          </div>
        </div>

        <div className="mb-8">
          <ProductCategoryFilter />
        </div>

        <div className="mb-6 flex flex-col justify-between gap-3 rounded-[1.25rem] bg-neutral-50 px-4 py-3 sm:flex-row sm:items-center">
          <p className="text-sm font-bold text-neutral-600">
            Showing{" "}
            <span className="text-black">{filteredProducts.length}</span>{" "}
            product{filteredProducts.length === 1 ? "" : "s"}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="w-fit rounded-full bg-black px-4 py-2 text-sm font-black text-white transition hover:bg-orange-500"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-[1.5rem] bg-neutral-100 p-8 text-center">
            <p className="text-sm font-bold text-neutral-600">
              No products found
              {searchTerm ? ` for “${searchTerm}”` : ""}.
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
