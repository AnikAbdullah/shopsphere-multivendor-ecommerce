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
import Pagination from "@/components/common/Pagination";
import ProductPriceFilter from "@/components/products/ProductPriceFilter";
import {
  getProductsFromResponse,
  mergeProductsWithFallback,
} from "@/lib/productHelpers";

const getPriceParams = (priceRange) => {
  if (priceRange === "under-10000") {
    return {
      maxPrice: 9999,
    };
  }

  if (priceRange === "10000-20000") {
    return {
      minPrice: 10000,
      maxPrice: 20000,
    };
  }

  if (priceRange === "20000-50000") {
    return {
      minPrice: 20000,
      maxPrice: 50000,
    };
  }

  if (priceRange === "over-50000") {
    return {
      minPrice: 50001,
    };
  }

  return {};
};

const getSortParam = (sortBy) => {
  if (sortBy === "price-low") return "price";
  if (sortBy === "price-high") return "-price";
  if (sortBy === "rating-high") return "-ratingAverage";
  if (sortBy === "name-az") return "name";

  return "-createdAt";
};

export default function ProductsPage() {
  const [products, setProducts] = useState(fallbackProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(fallbackProducts.length);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";
  const urlSearchTerm = searchParams.get("search") || "";

  useEffect(() => {
    setSearchTerm(urlSearchTerm);
  }, [urlSearchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy, priceRange]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const hasActiveFilters =
          searchTerm ||
          selectedCategory ||
          sortBy !== "default" ||
          priceRange !== "all";

        const response = await api.get(endpoints.products.root, {
          params: {
            search: searchTerm || undefined,
            category: selectedCategory || undefined,
            sort: getSortParam(sortBy),
            page: currentPage,
            limit: 8,
            ...getPriceParams(priceRange),
          },
        });

        const responseData = response.data?.data;
        const backendProducts = getProductsFromResponse(responseData);

        const total =
          responseData?.pagination?.totalProducts ||
          responseData?.totalProducts ||
          responseData?.total ||
          backendProducts.length;

        if (backendProducts.length > 0) {
          const formattedProducts = mergeProductsWithFallback(
            backendProducts,
            [],
            8,
          );

          setProducts(formattedProducts);
          setTotalProducts(total);
          return;
        }

        if (hasActiveFilters) {
          setProducts([]);
          setTotalProducts(0);
          return;
        }

        setProducts(fallbackProducts);
        setTotalProducts(fallbackProducts.length);
      } catch (error) {
        console.log("Failed to fetch products:", error.message);

        const hasActiveFilters =
          searchTerm ||
          selectedCategory ||
          sortBy !== "default" ||
          priceRange !== "all";

        if (hasActiveFilters) {
          setProducts([]);
          setTotalProducts(0);
        } else {
          setProducts(fallbackProducts);
          setTotalProducts(fallbackProducts.length);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy, priceRange, currentPage]);

  const totalPages = Math.ceil(totalProducts / 8);

  const hasActiveFilters =
    searchTerm ||
    selectedCategory ||
    sortBy !== "default" ||
    priceRange !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("default");
    setPriceRange("all");
    setCurrentPage(1);
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
            Showing <span className="text-black">{products.length}</span> of{" "}
            <span className="text-black">{totalProducts}</span> product
            {totalProducts === 1 ? "" : "s"}
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

        {products.length === 0 && (
          <div className="rounded-[1.5rem] bg-neutral-100 p-8 text-center">
            <p className="text-sm font-bold text-neutral-600">
              No products found
              {searchTerm ? ` for “${searchTerm}”` : ""}.
            </p>
          </div>
        )}

        {products.length > 0 && (
          <>
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

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </main>
  );
}
