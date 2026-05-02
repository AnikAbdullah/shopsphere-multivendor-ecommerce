"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import api from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { formatCurrency } from "@/lib/formatCurrency";

const getOrdersFromResponse = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.orders)) return responseData.orders;
  if (Array.isArray(responseData?.items)) return responseData.items;
  if (Array.isArray(responseData?.data)) return responseData.data;

  return [];
};

const formatDate = (date) => {
  if (!date) return "Unknown date";

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const getStatusStyle = (status) => {
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

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await api.get(endpoints.orders.root);
        const backendOrders = getOrdersFromResponse(response.data?.data);

        setOrders(backendOrders);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "Failed to load orders. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-500">
              Order History
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-black sm:text-5xl">
              My Orders
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
              View your recent orders and track their current status.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit items-center rounded-full bg-black px-5 py-3 text-sm font-black text-white transition hover:bg-orange-500"
          >
            Continue shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-[2rem] bg-neutral-100"
              />
            ))}
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="rounded-[2rem] bg-red-50 p-8 text-center">
            <p className="text-sm font-bold text-red-600">{errorMessage}</p>
          </div>
        )}

        {!isLoading && !errorMessage && orders.length === 0 && (
          <div className="rounded-[2rem] bg-neutral-100 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-neutral-800 shadow-sm">
              <ShoppingBag className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-2xl font-black text-black">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-neutral-600">
              When you place an order, it will appear here.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-black text-white transition hover:bg-orange-500"
            >
              Start shopping
            </Link>
          </div>
        )}

        {!isLoading && !errorMessage && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order._id}
                className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-black text-black">
                        Order #{String(order._id).slice(-8).toUpperCase()}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black capitalize ${getStatusStyle(
                          order.orderStatus,
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm font-bold text-neutral-500">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(order.createdAt)}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        {order.paymentMethod === "cash_on_delivery"
                          ? "Cash on Delivery"
                          : "Stripe"}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-sm font-bold text-neutral-500">Total</p>
                    <p className="text-2xl font-black text-orange-500">
                      {formatCurrency(order.total || 0)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_260px]">
                  <div className="space-y-3">
                    {order.items?.map((item, index) => (
                      <div
                        key={`${item.name}-${index}`}
                        className="flex items-center gap-3 rounded-[1.25rem] bg-neutral-50 p-3"
                      >
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

                        <p className="text-sm font-black text-neutral-800">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[1.5rem] bg-neutral-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <PackageCheck className="h-5 w-5 text-orange-500" />
                      <h3 className="font-black text-black">Delivery</h3>
                    </div>

                    <p className="text-sm font-bold text-neutral-700">
                      {order.shippingAddress?.fullName}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      {order.shippingAddress?.address},{" "}
                      {order.shippingAddress?.city}
                    </p>

                    <p className="mt-2 text-sm font-bold text-neutral-600">
                      Phone: {order.shippingAddress?.phone}
                    </p>

                    <Link
                      href={`/orders/${order._id}`}
                      className="mt-4 inline-flex text-sm font-black text-orange-500 transition hover:text-black"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
