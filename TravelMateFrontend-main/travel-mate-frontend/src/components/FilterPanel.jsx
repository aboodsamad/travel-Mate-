export default function FilterPanel({ data, country, setCountry, category, setCategory }) {
  const countries = Array.from(new Set(data.map((d) => d.Country))).sort();
  const categories = Array.from(new Set(data.map((d) => d.Category))).sort();

  return (
    <div style={{ background: "#f9fafb", padding: 16, borderRadius: 10 }}>
      <h3>Filters</h3>
      <label>
        Country:
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{ display: "block", marginBottom: 10, marginTop: 5 }}
        >
          <option value="">All</option>
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>

      <label>
        Category:
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ display: "block", marginTop: 5 }}
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
