"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { fallbackCategories } from "@/data/homeData";

const getCategoriesFromResponse = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.categories)) return responseData.categories;
  if (Array.isArray(responseData?.items)) return responseData.items;
  if (Array.isArray(responseData?.data)) return responseData.data;

  return [];
};

const formatCategory = (category) => ({
  id: category._id || category.id || category.slug || category.name,
  name: category.name,
  slug: category.slug || category._id || category.id || category.name,
});

const mergeWithFallbackCategories = (backendCategories) => {
  const formattedBackendCategories = backendCategories
    .filter((category) => category && category.name)
    .map(formatCategory);

  const backendNames = formattedBackendCategories.map((category) =>
    category.name.toLowerCase(),
  );

  const missingFallbackCategories = fallbackCategories.filter(
    (category) => !backendNames.includes(category.name.toLowerCase()),
  );

  return [...formattedBackendCategories, ...missingFallbackCategories];
};

export default function ProductCategoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(endpoints.categories.root);
        const backendCategories = getCategoriesFromResponse(
          response.data?.data,
        );

        if (backendCategories.length > 0) {
          setCategories(mergeWithFallbackCategories(backendCategories));
        } else {
          setCategories(fallbackCategories);
        }
      } catch (error) {
        console.log("Failed to fetch category filters:", error.message);
        setCategories(fallbackCategories);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categorySlug) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!categorySlug) {
      params.delete("category");
    } else {
      params.set("category", categorySlug);
    }

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => handleCategoryChange("")}
        className={`rounded-full px-4 py-2 text-sm font-black transition ${
          !selectedCategory
            ? "bg-black text-white"
            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
        }`}
      >
        All
      </button>

      {categories.map((category) => {
        const isActive =
          selectedCategory.toLowerCase() ===
          String(category.slug || category.name).toLowerCase();

        return (
          <button
            key={category.id || category.slug || category.name}
            type="button"
            onClick={() => handleCategoryChange(category.slug || category.name)}
            className={`rounded-full px-4 py-2 text-sm font-black transition ${
              isActive
                ? "bg-orange-500 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
