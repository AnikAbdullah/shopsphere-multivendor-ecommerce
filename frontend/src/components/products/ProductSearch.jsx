import { Search } from "lucide-react";

export default function ProductSearch({ value, onChange }) {
  return (
    <div className="flex w-full items-center rounded-full border border-neutral-200 bg-white px-4 shadow-sm transition focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100 sm:max-w-md">
      <Search className="h-5 w-5 text-neutral-400" />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search products..."
        className="h-12 flex-1 bg-transparent px-3 text-sm font-semibold text-neutral-900 outline-none placeholder:text-neutral-400"
      />
    </div>
  );
}
