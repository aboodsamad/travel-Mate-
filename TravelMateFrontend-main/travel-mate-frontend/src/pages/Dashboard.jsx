import React, { useState, useMemo } from "react";
import YelpDataLoader from "../components/YelpDataLoader.jsx";
import FilterPanel from "../components/FilterPanel.jsx";
import StatsPanel from "../components/StatsPanel.jsx";
import BarChart from "../components/BarChart.jsx";

export default function Dashboard({ data, setData }) {
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [statsField, setStatsField] = useState("Rating");
  const [chartField, setChartField] = useState("Visitors");

  const filtered = useMemo(() => {
    return data.filter((row) =>
      (country ? row.Country === country : true) &&
      (category ? row.Category === category : true)
    );
  }, [data, country, category]);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", padding: 20 }} className="app-container">
      <h1>🇱🇧 Lebanon Tourism Dashboard</h1>
      <YelpDataLoader onData={setData} />

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 20 }} className="dashboard-grid">
        <FilterPanel className="filters-panel"
          data={data}
          country={country}
          setCountry={setCountry}
          category={category}
          setCategory={setCategory}
        />
        <div style={{ display: "grid", gap: 20 }}>
          <StatsPanel rows={filtered} field={statsField} />
          <BarChart rows={filtered} field={chartField} />
        </div>
      </div>
    </div>
  );
}
