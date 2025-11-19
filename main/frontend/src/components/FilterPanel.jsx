import CustomDropdown from "./CustomDropdown.jsx";

export default function FilterPanel({
  data,
  country,
  setCountry,
  category,
  setCategory,
  onClearFilters,
}) {
  const countries = Array.from(new Set(data.map((d) => d.City))).sort();
  const categories = Array.from(new Set(data.map((d) => d.Category))).sort();

  const hasActiveFilters = country || category;

  return (
    <div className="filter-panel">
      <h3>Filters</h3>

      <div className="filter-group">
        <CustomDropdown
          label="City"
          value={country}
          onChange={setCountry}
          options={countries}
        />
      </div>

      <div className="filter-group">
        <CustomDropdown
          label="Category"
          value={category}
          onChange={setCategory}
          options={categories}
        />
      </div>

      {hasActiveFilters && (
        <>
          <button className="clear-filters-btn" onClick={onClearFilters}>
            Clear All Filters
          </button>
          
          <div className="active-filters">
            <div className="active-filters-title">Active Filters:</div>
            {country && <span className="filter-badge">📍 {country}</span>}
            {category && <span className="filter-badge">🏷️ {category}</span>}
          </div>
        </>
      )}
    </div>
  );
}