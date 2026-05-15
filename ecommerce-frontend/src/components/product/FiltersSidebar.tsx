"use client";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  brand: string;
  setBrand: (v: string) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
};

export default function FiltersSidebar({
  search,
  setSearch,
  brand,
  setBrand,
  maxPrice,
  setMaxPrice,
}: Props) {
  return (
    <div className="w-64 space-y-6">
      <h2 className="font-bold text-lg">Filters</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search product..."
        className="w-full border p-2 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* BRAND */}
      <select
        className="w-full border p-2 rounded"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      >
        <option value="">All Brands</option>
        <option value="Nike">Nike</option>
        <option value="Adidas">Adidas</option>
        <option value="Puma">Puma</option>
      </select>

      {/* PRICE */}
      <div>
        <label className="text-sm">Max Price: ₹{maxPrice}</label>
        <input
          type="range"
          min="0"
          max="50000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}