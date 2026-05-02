"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import api from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { formatCurrency } from "@/lib/formatCurrency";
import { getImageUrl } from "@/lib/getImageUrl";
import { useCartStore } from "@/stores/cartStore";

const fallbackImage =
  "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=900&q=80";

const getProductFromResponse = (responseData) => {
  if (!responseData) return null;
  if (responseData.product) return responseData.product;
  if (responseData.item) return responseData.item;
  if (responseData.data) return responseData.data;

  return responseData;
};

const formatDetailProduct = (product) => {
  const finalPrice = product.salePrice || product.price || 0;
  const oldPrice = product.salePrice ? product.price : null;

  return {
    id: product._id || product.id,
    name: product.name || "Product",
    slug: product.slug || "",
    brand: product.brand || "ShopSphere",
    description:
      product.description ||
      "A premium marketplace product from trusted ShopSphere sellers.",
    category: product.category?.name || product.category || "General",
    image: getImageUrl(product.images?.[0], fallbackImage),
    images:
      product.images?.length > 0
        ? product.images.map((image) => getImageUrl(image, fallbackImage))
        : [fallbackImage],
    rating: product.ratingAverage || 0,
    ratingCount: product.ratingCount || 0,
    stock:
      product.stock ??
      product.quantity ??
      product.availableQuantity ??
      product.countInStock ??
      10,
    rawPrice: finalPrice,
    price: formatCurrency(finalPrice),
    oldPrice: oldPrice ? formatCurrency(oldPrice) : "",
  };
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug;

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(fallbackImage);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);

        const response = await api.get(`${endpoints.products.root}/${slug}`);
        const backendProduct = getProductFromResponse(response.data?.data);

        if (backendProduct) {
          const formattedProduct = formatDetailProduct(backendProduct);

          setProduct(formattedProduct);
          setActiveImage(formattedProduct.image);
        }
      } catch (error) {
        console.log("Failed to fetch product:", error.message);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((current) => (current > 1 ? current - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        rawPrice: product.rawPrice,
      },
      quantity,
    );
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="h-[520px] animate-pulse rounded-[2rem] bg-neutral-100" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 animate-pulse rounded-full bg-neutral-100" />
              <div className="h-12 w-full animate-pulse rounded-full bg-neutral-100" />
              <div className="h-32 w-full animate-pulse rounded-[1.5rem] bg-neutral-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-neutral-100 p-10 text-center">
          <h1 className="text-3xl font-black text-black">Product not found</h1>

          <p className="mt-3 text-sm font-semibold text-neutral-600">
            This product may not exist or may not be published yet.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-black px-5 py-3 text-sm font-black text-white transition hover:bg-orange-500"
          >
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/products"
          className="mb-6 inline-flex text-sm font-black text-neutral-500 transition hover:text-black"
        >
          ← Back to products
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <section>
            <div className="overflow-hidden rounded-[2rem] bg-[#f7f7f7] p-5">
              <img
                src={activeImage}
                alt={product.name}
                className="h-[420px] w-full rounded-[1.5rem] object-cover"
              />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`overflow-hidden rounded-[1.25rem] border p-1 transition ${
                    activeImage === image
                      ? "border-orange-500"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={product.name}
                    className="h-24 w-full rounded-[1rem] object-cover"
                  />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">
              {product.brand}
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-black sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-black text-neutral-800">
                  {product.rating}
                </span>
                <span className="text-sm font-semibold text-neutral-500">
                  ({product.ratingCount} reviews)
                </span>
              </div>

              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black text-neutral-700">
                {product.category}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  product.stock > 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {product.stock > 0 ? "In stock" : "Out of stock"}
              </span>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <p className="text-3xl font-black text-orange-500">
                {product.price}
              </p>

              {product.oldPrice && (
                <p className="text-lg font-bold text-neutral-400 line-through">
                  {product.oldPrice}
                </p>
              )}
            </div>

            <p className="mt-6 leading-7 text-neutral-600">
              {product.description}
            </p>

            <div className="mt-8">
              <p className="mb-3 text-sm font-black text-black">Quantity</p>

              <div className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 p-1">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="rounded-full bg-white p-3 text-neutral-700 shadow-sm transition hover:bg-neutral-100"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="w-14 text-center text-sm font-black">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  className="rounded-full bg-white p-3 text-neutral-700 shadow-sm transition hover:bg-neutral-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-black text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to cart
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-neutral-100"
              >
                <Heart className="mr-2 h-4 w-4" />
                Wishlist
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
