"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function BottomDealBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-[2rem] bg-[#f7f7f7]"
    >
      <div className="grid items-center gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
            Galaxy Sale is live now
          </p>

          <h3 className="mt-3 text-3xl font-black tracking-tight text-black sm:text-4xl">
            Save more on smart devices
          </h3>

          <p className="mt-3 max-w-md text-sm leading-6 text-neutral-600">
            Get limited-time discounts on phones, smart watches, earbuds, and
            selected premium accessories.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 text-sm font-black text-black transition hover:gap-3"
          >
            Shop now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"
            alt="Smart device offer"
            className="h-[220px] w-full max-w-md rounded-[1.5rem] object-cover shadow-xl"
          />
        </div>
      </div>
    </motion.div>
  );
}
