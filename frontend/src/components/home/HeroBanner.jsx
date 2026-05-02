"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { heroSlides } from "@/data/homeData";

export default function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[activeSlide];

  const goPrevious = () => {
    setActiveSlide((current) =>
      current === 0 ? heroSlides.length - 1 : current - 1,
    );
  };

  const goNext = () => {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] bg-linear-to-br ${slide.bannerBg} text-neutral-950 shadow-[0_22px_70px_rgba(15,23,42,0.12)] ring-1 ring-black/5`}
    >
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/70 blur-3xl" />
      <div className="absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-white/60 blur-3xl" />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, x: 70 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -70 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative grid min-h-[460px] items-center gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10"
        >
          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-xs font-bold uppercase tracking-[0.28em] text-neutral-500"
            >
              {slide.eyebrow}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-4 max-w-xl text-4xl font-black leading-[0.95] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
            >
              {slide.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-5 max-w-md text-sm leading-6 text-neutral-600 sm:text-base"
            >
              {slide.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <Link
                href="/products"
                className={`inline-flex items-center justify-center rounded-full ${slide.accent} px-5 py-2.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:brightness-110`}
              >
                {slide.button}
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          <div className="relative min-h-[320px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, rotate: 3 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="absolute right-0 top-0 h-[320px] w-[76%] overflow-hidden rounded-[1.75rem] bg-white shadow-2xl"
            >
              <img
                src={slide.image}
                alt={slide.product}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-transparent" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -12, 0], rotate: [-2, 1, -2] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-0 top-16 w-[58%] rounded-[1.75rem] bg-white p-4 text-black shadow-2xl"
            >
              <div className="overflow-hidden rounded-[1.25rem]">
                <img
                  src={slide.cardImage}
                  alt={slide.product}
                  className="h-40 w-full object-cover"
                />
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star
                      key={item}
                      className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <h3 className="text-base font-black">{slide.product}</h3>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-black text-orange-500">
                    {slide.price}
                  </span>
                  <span className="text-xs font-semibold text-neutral-400 line-through">
                    {slide.oldPrice}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={goPrevious}
        className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-black shadow-lg transition hover:scale-105 md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-black shadow-lg transition hover:scale-105 md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm backdrop-blur">
        {heroSlides.map((item, index) => (
          <button
            key={item.title}
            onClick={() => setActiveSlide(index)}
            className={`h-2 rounded-full transition-all ${
              activeSlide === index
                ? "w-8 bg-neutral-950"
                : "w-2 bg-neutral-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
