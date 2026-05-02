"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { getImageUrl } from "@/lib/getImageUrl";
import { fallbackCategories, defaultCategoryImage } from "@/data/homeData";

const getCategoriesFromResponse = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.categories)) return responseData.categories;
  if (Array.isArray(responseData?.items)) return responseData.items;
  if (Array.isArray(responseData?.data)) return responseData.data;

  return [];
};

const formatBackendCategory = (category) => {
  return {
    id: category._id || category.id,
    name: category.name,
    slug: category.slug || category._id || category.id || category.name,
    image: getImageUrl(
      category.image || category.thumbnail,
      defaultCategoryImage,
    ),
  };
};

const mergeWithFallbackCategories = (backendCategories) => {
  const formattedBackendCategories = backendCategories
    .filter((category) => category && category.name)
    .slice(0, 5)
    .map(formatBackendCategory);

  const backendNames = formattedBackendCategories.map((category) =>
    category.name.toLowerCase(),
  );

  const missingFallbackCategories = fallbackCategories.filter(
    (category) => !backendNames.includes(category.name.toLowerCase()),
  );

  return [...formattedBackendCategories, ...missingFallbackCategories].slice(
    0,
    5,
  );
};

export default function CategoryShowcase() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);

        const response = await api.get(endpoints.categories.root);
        const backendCategories = getCategoriesFromResponse(
          response.data?.data,
        );

        if (backendCategories.length > 0) {
          const mergedCategories =
            mergeWithFallbackCategories(backendCategories);

          setCategories(mergedCategories);
        } else {
          setCategories(fallbackCategories);
        }
      } catch (error) {
        console.log("Failed to fetch categories:", error.message);
        setCategories(fallbackCategories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-black">
            Trending Categories
          </h2>

          {isLoading && (
            <p className="mt-1 text-sm font-semibold text-neutral-500">
              Checking latest categories...
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category, index) => (
          <motion.div
            key={category.id || category.slug || category.name}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * index }}
          >
            <Link
              href={`/products?category=${encodeURIComponent(
                category.slug || category.name,
              )}`}
              className="group block rounded-[1.5rem] bg-[#f7f7f7] p-4 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-3 overflow-hidden rounded-[1.25rem] bg-white">
                <img
                  src={category.image || defaultCategoryImage}
                  alt={category.name}
                  onError={(event) => {
                    event.currentTarget.src = defaultCategoryImage;
                  }}
                  className="h-28 w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              <p className="text-center text-sm font-bold text-neutral-800">
                {category.name}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
