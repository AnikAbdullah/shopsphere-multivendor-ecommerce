"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { formatCurrency } from "@/lib/formatCurrency";
import { popularProducts as fallbackProducts } from "@/data/homeData";

const fallbackImage =
  "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=600&q=80";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const backendBaseUrl = apiBaseUrl.replace("/api", "");

const getImageUrl = (image) => {
  if (!image) return fallbackImage;

  if (typeof image === "string") {
    if (image.startsWith("http")) return image;
    return `${backendBaseUrl}${image}`;
  }

  if (image.url) {
    if (image.url.startsWith("http")) return image.url;
    return `${backendBaseUrl}${image.url}`;
  }

  return fallbackImage;
};

const formatBackendProduct = (product) => {
  const finalPrice = product.salePrice || product.price || 0;
  const oldPrice = product.salePrice ? product.price : null;

  return {
    id: product._id,
    name: product.name,
    slug: product.slug,
    image: getImageUrl(product.images?.[0]),
    rating: product.ratingAverage || 0,
    price: formatCurrency(finalPrice),
    oldPrice: oldPrice ? formatCurrency(oldPrice) : "",
  };
};

export default function PopularProducts() {
  const [products, setProducts] = useState(fallbackProducts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setIsLoading(true);

        const response = await api.get(endpoints.products.featured);

        const responseData = response.data?.data;

        const backendProducts = Array.isArray(responseData)
          ? responseData
          : responseData?.products || responseData?.items || [];

        if (Array.isArray(backendProducts) && backendProducts.length > 0) {
          const formattedProducts = backendProducts
            .slice(0, 8)
            .map(formatBackendProduct);

          setProducts(formattedProducts);
        } else {
          setProducts(fallbackProducts);
        }
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
            <div className="group rounded-[1.5rem] bg-[#fafafa] p-4 transition hover:-translate-y-1 hover:shadow-md">
              <Link
                href={product.slug ? `/products/${product.slug}` : "/products"}
                className="block"
              >
                <div className="relative overflow-hidden rounded-[1.25rem] bg-white">
                  <img
                    src={product.image || fallbackImage}
                    alt={product.name}
                    className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-3 rounded-full bg-white p-2 text-neutral-700 shadow-sm transition hover:text-rose-500"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center gap-1 text-[11px] font-bold text-yellow-500">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-neutral-600">
                      {product.rating || 0}
                    </span>
                  </div>

                  <h3 className="line-clamp-1 text-sm font-black text-neutral-900 sm:text-base">
                    {product.name}
                  </h3>
                </div>
              </Link>

              <div className="mt-2 flex items-center justify-between gap-2">
                <div>
                  <span className="text-sm font-black text-orange-500">
                    {product.price}
                  </span>

                  {product.oldPrice && (
                    <span className="ml-2 text-xs font-semibold text-neutral-400 line-through">
                      {product.oldPrice}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="rounded-full bg-black p-2 text-white transition hover:bg-orange-500"
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
