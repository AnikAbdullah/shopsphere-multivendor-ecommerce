export default function ProductSort({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 rounded-full border border-neutral-200 bg-white px-4 text-sm font-bold text-neutral-800 shadow-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
    >
      <option value="default">Default</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="rating-high">Top Rated</option>
      <option value="name-az">Name: A to Z</option>
    </select>
  );
}
