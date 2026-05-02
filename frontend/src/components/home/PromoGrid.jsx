"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { promoCards } from "@/data/homeData";

export default function PromoGrid() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {promoCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: index * 0.08 }}
          className="group overflow-hidden rounded-[1.75rem] bg-[#f7f7f7] p-5 transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="grid items-center gap-5 sm:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                {card.subtitle}
              </p>

              <h3 className="mt-2 text-2xl font-black tracking-tight text-black">
                {card.title}
              </h3>

              <Link
                href="/products"
                className="mt-5 inline-flex rounded-full bg-orange-500 px-4 py-2 text-xs font-black text-white transition hover:bg-orange-600"
              >
                Shop Now
              </Link>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] bg-white">
              <img
                src={card.image}
                alt={card.title}
                className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
