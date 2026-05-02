"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatCurrency } from "@/lib/formatCurrency";

export default function CheckoutPage() {
  const [hasMounted, setHasMounted] = useState(false);

  const items = useCartStore((state) => state.items);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "cash_on_delivery",
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const subtotal = items.reduce((total, item) => {
    return total + Number(item.rawPrice || 0) * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 0 && subtotal < 2000 ? 120 : 0;
  const total = subtotal + deliveryFee;

  const isFormValid =
    formData.fullName.trim() &&
    formData.phone.trim() &&
    formData.address.trim() &&
    formData.city.trim() &&
    items.length > 0;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    if (!isFormValid) return;

    alert("Checkout UI is ready. Next step: connect this to backend orders.");
  };

  if (!hasMounted) {
    return (
      <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-72 animate-pulse rounded-[2rem] bg-neutral-100" />
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-neutral-100 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-neutral-800 shadow-sm">
            <ShoppingBag className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-3xl font-black text-black">
            Your cart is empty
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-neutral-600">
            Add products to your cart before going to checkout.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-black text-white transition hover:bg-orange-500"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/cart"
          className="mb-6 inline-flex items-center gap-2 text-sm font-black text-neutral-500 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cart
        </Link>

        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-500">
            Checkout
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-black sm:text-5xl">
            Complete your order
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
            Add your delivery details and choose a payment method.
          </p>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <Truck className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-black">
                    Delivery Information
                  </h2>
                  <p className="text-sm font-semibold text-neutral-500">
                    We’ll deliver your order to this address.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-black">
                    <UserRound className="h-4 w-4" />
                    Full Name
                  </span>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 px-4 text-sm font-semibold outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-black">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 px-4 text-sm font-semibold outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-black">
                    <MapPin className="h-4 w-4" />
                    Delivery Address
                  </span>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House, road, area details"
                    rows={4}
                    className="w-full resize-none rounded-[1.5rem] border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black text-black">
                    City
                  </span>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Dhaka"
                    className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 px-4 text-sm font-semibold outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <CreditCard className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-black">
                    Payment Method
                  </h2>
                  <p className="text-sm font-semibold text-neutral-500">
                    Stripe test payment will be added later.
                  </p>
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-[1.5rem] border border-orange-200 bg-orange-50 p-4">
                <div>
                  <p className="font-black text-black">Cash on Delivery</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-600">
                    Pay when the product arrives.
                  </p>
                </div>

                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={formData.paymentMethod === "cash_on_delivery"}
                  onChange={handleChange}
                  className="h-5 w-5 accent-orange-500"
                />
              </label>
            </div>
          </section>

          <aside className="h-fit rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-black">Order Summary</h2>

            <div className="mt-6 max-h-72 space-y-4 overflow-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />

                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-black text-black">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs font-bold text-neutral-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-black text-orange-500">
                    {formatCurrency(Number(item.rawPrice || 0) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4 border-t border-neutral-200 pt-5">
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

              <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
                <span className="text-base font-black text-black">Total</span>
                <span className="text-2xl font-black text-orange-500">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-black text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Place Order
            </button>

            <p className="mt-4 text-center text-xs font-semibold leading-5 text-neutral-500">
              By placing this order, you agree to ShopSphere’s checkout policy.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}
