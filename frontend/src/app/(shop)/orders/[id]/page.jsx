"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  MapPin,
  PackageCheck,
  Phone,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";
import api from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { formatCurrency } from "@/lib/formatCurrency";

const fallbackImage =
  "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=600&q=80";

const getOrderFromResponse = (responseData) => {
  if (!responseData) return null;
  if (responseData.order) return responseData.order;
  if (responseData.item) return responseData.item;
  if (responseData.data) return responseData.data;

  return responseData;
};

const formatDate = (date) => {
  if (!date) return "Unknown date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
};

const getStatusStyle = (status = "pending") => {
  if (status === "delivered") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "cancelled") {
    return "bg-red-50 text-red-700";
  }

  if (status === "shipped") {
    return "bg-blue-50 text-blue-700";
  }

  if (status === "processing") {
    return "bg-orange-50 text-orange-700";
  }

  return "bg-neutral-100 text-neutral-700";
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params?.id;

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await api.get(`${endpoints.orders.root}/${orderId}`);
        const backendOrder = getOrderFromResponse(response.data?.data);

        if (!backendOrder) {
          setErrorMessage("Order not found.");
          setOrder(null);
          return;
        }

        setOrder(backendOrder);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "Failed to load order details. Please try again.",
        );
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="h-40 animate-pulse rounded-[2rem] bg-neutral-100" />
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="h-96 animate-pulse rounded-[2rem] bg-neutral-100" />
            <div className="h-96 animate-pulse rounded-[2rem] bg-neutral-100" />
          </div>
        </div>
      </main>
    );
  }

  if (errorMessage || !order) {
    return (
      <main className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-red-50 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
            <ShoppingBag className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-3xl font-black text-black">
            Order not found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-red-600">
            {errorMessage || "This order does not exist."}
          </p>

          <Link
            href="/orders"
            className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-black text-white transition hover:bg-orange-500"
          >
            Back to orders
          </Link>
        </div>
      </main>
    );
  }

  const orderNumber = String(order._id || order.id || orderId)
    .slice(-8)
    .toUpperCase();

  const orderStatus = order.orderStatus || "pending";
  const paymentStatus = order.paymentStatus || "pending";
  const paymentMethod = order.paymentMethod || "cash_on_delivery";

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm font-black text-neutral-500 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>

        <div className="mb-8 rounded-[2rem] bg-neutral-50 p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-500">
                Order Details
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight text-black sm:text-5xl">
                Order #{orderNumber}
              </h1>

              <div className="mt-4 flex flex-wrap gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black capitalize ${getStatusStyle(
                    orderStatus,
                  )}`}
                >
                  {orderStatus}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-neutral-700">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-white p-4 shadow-sm sm:text-right">
              <p className="text-sm font-bold text-neutral-500">Order Total</p>
              <p className="mt-1 text-3xl font-black text-orange-500">
                {formatCurrency(order.total || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <PackageCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-black text-black">Ordered Items</h2>
                <p className="text-sm font-semibold text-neutral-500">
                  Products included in this order.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="grid gap-4 rounded-[1.5rem] bg-neutral-50 p-4 sm:grid-cols-[90px_1fr_auto]"
                >
                  <img
                    src={item.image || fallbackImage}
                    alt={item.name}
                    onError={(event) => {
                      event.currentTarget.src = fallbackImage;
                    }}
                    className="h-24 w-full rounded-[1.25rem] object-cover sm:w-24"
                  />

                  <div>
                    <h3 className="font-black text-black">{item.name}</h3>

                    <p className="mt-1 text-sm font-bold text-neutral-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 text-sm font-bold text-neutral-500">
                      Unit price: {formatCurrency(item.price || 0)}
                    </p>
                  </div>

                  <p className="text-sm font-black text-orange-500 sm:text-right">
                    {formatCurrency((item.price || 0) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <Truck className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-black text-black">Delivery</h2>
              </div>

              <div className="space-y-3 text-sm font-semibold text-neutral-600">
                <p className="flex gap-2">
                  <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  <span>{order.shippingAddress?.fullName || "N/A"}</span>
                </p>

                <p className="flex gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  <span>{order.shippingAddress?.phone || "N/A"}</span>
                </p>

                <p className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  <span>
                    {order.shippingAddress?.address || "N/A"},{" "}
                    {order.shippingAddress?.city || "N/A"}
                  </span>
                </p>
              </div>
            </section>

            <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <CreditCard className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-black text-black">Payment</h2>
              </div>

              <div className="space-y-3 text-sm font-bold text-neutral-600">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="text-black">
                    {paymentMethod === "cash_on_delivery"
                      ? "Cash on Delivery"
                      : "Stripe"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="capitalize text-black">{paymentStatus}</span>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-black">Summary</h2>

              <div className="mt-5 space-y-4 text-sm font-bold text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-black">
                    {formatCurrency(order.subtotal || 0)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-black">
                    {order.deliveryFee === 0
                      ? "Free"
                      : formatCurrency(order.deliveryFee || 0)}
                  </span>
                </div>

                <div className="flex justify-between border-t border-neutral-200 pt-4">
                  <span className="text-black">Total</span>
                  <span className="text-xl font-black text-orange-500">
                    {formatCurrency(order.total || 0)}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
