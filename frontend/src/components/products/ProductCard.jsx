import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";

const fallbackImage =
  "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=600&q=80";

export default function ProductCard({ product }) {
  const productLink = product.slug ? `/products/${product.slug}` : "/products";

  return (
    <div className="group rounded-[1.5rem] bg-[#fafafa] p-4 transition hover:-translate-y-1 hover:shadow-md">
      <Link href={productLink} className="block">
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
            <span className="text-neutral-600">{product.rating || 0}</span>
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
  );
}
