"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  UserRound,
} from "lucide-react";

const navItems = [
  "New Arrivals",
  "Best Sellers",
  "Fashion",
  "Electronics",
  "Watches",
  "Beauty",
  "Deals",
];

export default function StoreHeader() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  const cartItems = useCartStore((state) => state.items);

  const totalCartItems = cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      router.push("/products");
      return;
    }

    router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#f8f3ea]/90 backdrop-blur-xl">
      <div className="bg-linear-to-r from-[#ff6a00] via-[#ffb000] to-[#ff3d00] px-4 py-2 text-center text-xs font-black tracking-wide text-white shadow-sm sm:text-sm">
        <span className="inline-flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-white" />
          Weekend Sale is live — save up to 35% on selected marketplace picks
        </span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-950 text-white shadow-sm transition group-hover:-translate-y-0.5">
            <ShoppingBag className="h-5 w-5" />

            <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-[#db2777] ring-4 ring-[#f8f3ea]" />
          </div>

          <div className="leading-none">
            <p className="text-2xl font-black tracking-tight">
              <span className="text-stone-950">Shop</span>
              <span className="text-[#db2777]">Sphere</span>
            </p>
            <p className="mt-1 hidden text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 sm:block">
              Premium marketplace
            </p>
          </div>
        </Link>

        <form
          onSubmit={handleSearchSubmit}
          className="hidden flex-1 items-center rounded-full border border-stone-300/80 bg-white px-3 shadow-sm transition focus-within:border-[#db2777]/40 focus-within:ring-4 focus-within:ring-[#db2777]/10 lg:flex"
        >
          <Search className="ml-2 h-5 w-5 text-stone-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search products, brands, categories..."
            className="h-12 flex-1 bg-transparent px-3 text-sm font-semibold text-stone-900 outline-none placeholder:text-stone-400"
          />

          <button
            type="submit"
            className="rounded-full bg-stone-950 px-6 py-2.5 text-sm font-black text-white transition hover:bg-[#db2777]"
          >
            Search
          </button>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/wishlist"
            className="hidden rounded-full border border-stone-200 bg-white p-2.5 text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#db2777]/30 hover:bg-pink-50 hover:text-[#db2777] sm:inline-flex"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            href="/login"
            className="hidden rounded-full border border-stone-200 bg-white p-2.5 text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#db2777]/30 hover:bg-pink-50 hover:text-[#db2777] sm:inline-flex"
            aria-label="Account"
          >
            <UserRound className="h-5 w-5" />
          </Link>

          <Link
            href="/cart"
            className="relative rounded-full bg-stone-950 p-2.5 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#db2777]"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />

            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#db2777] px-1 text-[10px] font-black text-white ring-2 ring-[#f8f3ea]">
              {hasMounted ? totalCartItems : 0}
            </span>
          </Link>

          <button
            className="rounded-full border border-stone-200 bg-white p-2.5 text-stone-700 shadow-sm transition hover:bg-stone-100 lg:hidden"
            aria-label="Open menu"
            type="button"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="border-t border-stone-200/70 bg-white/60">
        <div className="mx-auto hidden max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:flex lg:px-8">
          <nav className="flex items-center gap-7 text-sm font-black text-stone-700">
            {navItems.map((item) => (
              <Link
                key={item}
                href="/products"
                className="group relative transition hover:text-stone-950"
              >
                {item}
                <span className="absolute -bottom-3 left-0 h-0.5 w-0 rounded-full bg-[#db2777] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <Link
            href="/seller"
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-black text-stone-800 shadow-sm transition hover:-translate-y-0.5 hover:border-[#db2777]/30 hover:bg-pink-50 hover:text-[#db2777]"
          >
            Become a seller
          </Link>
        </div>

        <div className="px-4 py-3 lg:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center rounded-full border border-stone-300 bg-white px-3 shadow-sm focus-within:border-[#db2777]/40 focus-within:ring-4 focus-within:ring-[#db2777]/10"
          >
            <Search className="h-5 w-5 text-stone-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products..."
              className="h-11 flex-1 bg-transparent px-3 text-sm font-semibold text-stone-900 outline-none placeholder:text-stone-400"
            />
          </form>
        </div>
      </div>
    </header>
  );
}
