import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import YelpDataLoader from "../components/YelpDataLoader.jsx";
import FilterPanel from "../components/FilterPanel.jsx";
import StatsPanel from "../components/StatsPanel.jsx";
import BarChart from "../components/BarChart.jsx";
import "../styles/Dashboard.css";

export default function Dashboard({ data, setData }) {
  const [searchParams] = useSearchParams();
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [statsField, setStatsField] = useState("Rating");
  const [chartField, setChartField] = useState("Visitors");

  // Read city and category from URL parameters when component mounts or data changes
  useEffect(() => {
    const cityParam = searchParams.get('city');
    const categoryParam = searchParams.get('category');
    
    if (cityParam && data.length > 0) {
      setCountry(cityParam);
    }
    
    if (categoryParam && data.length > 0) {
      setCategory(categoryParam);
    }
  }, [searchParams, data]);

  const filtered = useMemo(() => {
    return data.filter((row) =>
      (country ? row.Country === country : true) &&
      (category ? row.Category === category : true)
    );
  }, [data, country, category]);

  const clearFilters = () => {
    setCountry("");
    setCategory("");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Hero Header */}
        <div className="dashboard-hero">
          <div className="dashboard-hero-content">
            <div className="dashboard-title-wrapper">
              <span className="dashboard-icon">🌍</span>
              <h1 className="dashboard-title">Lebanon Tourism Dashboard</h1>
              <img
                src="https://img.icons8.com/color/48/lebanon.png"
                alt="Lebanon"
                style={{ width: 48, height: 48, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}
              />
            </div>
            <p className="dashboard-subtitle">
              Explore insights, ratings, and tourism trends across Lebanon 🌴
            </p>
          </div>
        </div>

        <YelpDataLoader onData={setData} />

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Filter Panel */}
          <FilterPanel
            data={data}
            country={country}
            setCountry={setCountry}
            category={category}
            setCategory={setCategory}
            onClearFilters={clearFilters}
          />

          {/* Main Content */}
          <div>
            <StatsPanel rows={filtered} field={statsField} />
            <BarChart rows={filtered} field={chartField} />
          </div>
        </div>
      </div>
    </div>
  );
}