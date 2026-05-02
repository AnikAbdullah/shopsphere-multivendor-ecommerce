export default function ProductPriceFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 rounded-full border border-neutral-200 bg-white px-4 text-sm font-bold text-neutral-800 shadow-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
    >
      <option value="all">All Prices</option>
      <option value="under-10000">Under BDT 10,000</option>
      <option value="10000-20000">BDT 10,000 - 20,000</option>
      <option value="20000-50000">BDT 20,000 - 50,000</option>
      <option value="over-50000">Over BDT 50,000</option>
    </select>
  );
}
