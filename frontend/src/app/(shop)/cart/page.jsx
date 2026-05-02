"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatCurrency } from "@/lib/formatCurrency";

const fallbackImage =
  "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=600&q=80";

export default function CartPage() {
  const [hasMounted, setHasMounted] = useState(false);

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const subtotal = items.reduce((total, item) => {
    return total + Number(item.rawPrice || 0) * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 0 && subtotal < 2000 ? 120 : 0;
  const total = subtotal + deliveryFee;

  if (!hasMounted) {
    return (
      <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-72 animate-pulse rounded-[2rem] bg-neutral-100" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-500">
              Shopping Cart
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-black sm:text-5xl">
              Your Cart
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
              Review your selected products before checkout.
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="w-fit rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-800 transition hover:bg-neutral-100"
            >
              Clear cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-[2rem] bg-neutral-100 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-neutral-800 shadow-sm">
              <ShoppingBag className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-2xl font-black text-black">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-neutral-600">
              Add products to your cart and they will appear here.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center rounded-full bg-black px-6 py-3 text-sm font-black text-white transition hover:bg-orange-500"
            >
              Continue shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <section className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-4 rounded-[1.75rem] bg-[#fafafa] p-4 sm:grid-cols-[120px_1fr_auto]"
                >
                  <Link
                    href={item.slug ? `/products/${item.slug}` : "/products"}
                    className="overflow-hidden rounded-[1.25rem] bg-white"
                  >
                    <img
                      src={item.image || fallbackImage}
                      alt={item.name}
                      className="h-32 w-full object-cover transition hover:scale-105 sm:h-full"
                    />
                  </Link>

                  <div>
                    <Link
                      href={item.slug ? `/products/${item.slug}` : "/products"}
                      className="text-lg font-black text-black transition hover:text-orange-500"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-2 text-sm font-bold text-orange-500">
                      {item.price}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-neutral-500 transition hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:justify-between">
                    <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white p-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="rounded-full bg-neutral-100 p-2 text-neutral-700 transition hover:bg-neutral-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="w-12 text-center text-sm font-black">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="rounded-full bg-neutral-100 p-2 text-neutral-700 transition hover:bg-neutral-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-sm font-black text-black">
                      {formatCurrency(
                        Number(item.rawPrice || 0) * item.quantity,
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            <aside className="h-fit rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-black">Order Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm font-bold text-neutral-600">
                  <span>Subtotal</span>
                  <span className="text-black">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-sm font-bold text-neutral-600">
                  <span>Delivery</span>
                  <span className="text-black">
                    {deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}
                  </span>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-black">
                      Total
                    </span>
                    <span className="text-2xl font-black text-orange-500">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-black text-white transition hover:bg-orange-500"
              >
                Proceed to checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/products"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-neutral-100"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
