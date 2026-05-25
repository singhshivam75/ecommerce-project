"use client";

type Props = {
  filters: {
    search: string;
    brand: string;
    maxPrice?: number;
  };

  updateFilter: (
    key: string,
    value: string | number
  ) => void;
};

export default function FiltersSidebar({
  filters,
  updateFilter,
}: Props) {
  return (
    <div className="w-64 space-y-6">

      <h2 className="font-bold text-lg">
        Filters
      </h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search product..."
        className="w-full border p-2 rounded"
        value={filters.search}
        onChange={(e) =>
          updateFilter("search", e.target.value)
        }
      />

      {/* BRAND */}
      <select
        className="w-full border p-2 rounded"
        value={filters.brand}
        onChange={(e) =>
          updateFilter("brand", e.target.value)
        }
      >
        <option value="">All Brands</option>
        <option value="Nike">Nike</option>
        <option value="Adidas">Adidas</option>
        <option value="Puma">Puma</option>
      </select>

      {/* PRICE */}
      <div>
<label className="text-sm">
  Max Price: ₹{filters.maxPrice || 50000}
</label>

<input
  type="range"
  min="0"
  max="50000"
  value={filters.maxPrice || 50000}
  onChange={(e) =>
    updateFilter(
      "maxPrice",
      Number(e.target.value)
    )
  }
  className="w-full"
/>
      </div>
    </div>
  );
}