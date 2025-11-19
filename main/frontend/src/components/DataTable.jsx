import { useState, useMemo } from "react";
import CustomDropdown from "./CustomDropdown"; // adjust path if needed

export default function DataTable({ rows }) {
  const rowsPerPage = 10;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({});
  const [selectedPlace, setSelectedPlace] = useState(null);

  if (!rows || !rows.length) return <div>No data found.</div>;

  // Columns to show
  const allowedColumns = [
    "Location",
    "City",
    "Category",
    "Visitors",
    "Rating",
    "Accommodation_Available",
    "Address",
  ];

  // Build filter options from data
  const uniqueFilters = {};
  allowedColumns.forEach((column) => {
    const vals = rows
      .map((r) => r[column])
      .filter((v) => v !== null && v !== undefined && v !== "");
    uniqueFilters[column] = Array.from(new Set(vals));
  });

  // SORTING
  const handleSort = (col) => {
    let dir = "asc";
    if (sortConfig.key === col && sortConfig.direction === "asc") {
      dir = "desc";
    }
    setSortConfig({ key: col, direction: dir });
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return rows;

    return [...rows].sort((a, b) => {
      const A = a[sortConfig.key];
      const B = b[sortConfig.key];

      if (A == null && B == null) return 0;
      if (A == null) return 1;
      if (B == null) return -1;

      if (typeof A === "number" && typeof B === "number") {
        return sortConfig.direction === "asc" ? A - B : B - A;
      }
      return sortConfig.direction === "asc"
        ? String(A).localeCompare(String(B))
        : String(B).localeCompare(String(A));
    });
  }, [rows, sortConfig]);

  // SEARCH + FILTERS
  const filteredRows = useMemo(() => {
    return sortedRows.filter((row) => {
      // search across visible columns
      const matchesSearch = allowedColumns.some((col) =>
        String(row[col] ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
      if (!matchesSearch) return false;

      // individual column filters
      for (const key in filters) {
        const filterVal = filters[key];
        if (filterVal && row[key] !== filterVal) return false;
      }

      return true;
    });
  }, [sortedRows, search, filters]);

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(start, start + rowsPerPage);

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  // RATING STARS
  const renderStars = (rating) => {
    if (rating == null || rating === "") return "-";
    const val = Number(rating);
    if (Number.isNaN(val)) return rating;

    const stars = Math.max(0, Math.min(5, Math.round(val)));
    return (
      <span style={{ fontSize: 16 }}>
        <span style={{ color: "#fbbf24" }}>{"★".repeat(stars)}</span>
        <span style={{ color: "#d1d5db" }}>{"★".repeat(5 - stars)}</span>
        <span style={{ marginLeft: 6, fontSize: 12, color: "#6b7280" }}>
          {val.toFixed(1)}
        </span>
      </span>
    );
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0f2fe, #eef2ff)",
        minHeight: "100vh",
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* BIG DASHBOARD-STYLE HEADER CARD */}
        <section
          style={{
            background: "linear-gradient(135deg, #4f46e5, #9333ea)",
            borderRadius: 28,
            padding: "26px 30px",
            marginBottom: 30,
            color: "white",
            boxShadow: "0 18px 40px rgba(15,23,42,0.35)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.9 }}>
            🌍 Lebanon Travel Insights
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              margin: 0,
            }}
          >
            Lebanon Places Explorer
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              opacity: 0.95,
              maxWidth: 520,
            }}
          >
            Browse all locations, filter by city and category, and quickly open
            any place on the map.
          </p>
        </section>

        {/* SEARCH + FILTERS CARD */}
        <section
          style={{
            background: "white",
            borderRadius: 22,
            padding: "20px 22px",
            marginBottom: 26,
            boxShadow: "0 10px 26px rgba(15,23,42,0.15)",
          }}
        >
          {/* Search */}
          <div style={{ marginBottom: 18 }}>
            <input
              type="text"
              placeholder="Search places, cities or categories..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              style={{
                padding: "12px 16px",
                borderRadius: 999,
                border: "1px solid #cbd5e1",
                boxShadow: "0 2px 6px rgba(15,23,42,0.06)",
                width: "320px",
                maxWidth: "100%",
                outline: "none",
                fontSize: 14,
              }}
            />
          </div>

          {/* Filters row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
            }}
          >
            {allowedColumns.map((col) => (
              <div key={col} style={{ minWidth: 150 }}>
                <CustomDropdown
                  label={col.toUpperCase()}
                  value={filters[col] || ""}
                  options={uniqueFilters[col]}
                  onChange={(val) => {
                    setPage(1);
                    setFilters((prev) => ({ ...prev, [col]: val || null }));
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* TABLE CARD */}
        <section
          style={{
            borderRadius: 22,
            background: "white",
            boxShadow: "0 14px 32px rgba(15,23,42,0.18)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              width="100%"
              cellPadding="12"
              style={{ borderCollapse: "collapse", minWidth: "100%" }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f1f5f9",
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {allowedColumns.map((h) => (
                    <th
                      key={h}
                      onClick={() => handleSort(h)}
                      style={{
                        padding: 14,
                        cursor: "pointer",
                        userSelect: "none",
                        borderBottom: "2px solid #e2e8f0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}{" "}
                      {sortConfig.key === h
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                  ))}
                  <th
                    style={{
                      padding: 14,
                      borderBottom: "2px solid #e2e8f0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    View
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentRows.map((r, i) => (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {allowedColumns.map((h) => (
                      <td
                        key={h}
                        style={{
                          padding: 12,
                          verticalAlign: "middle",
                          fontSize: 14,
                        }}
                      >
                        {h === "Rating" ? renderStars(r[h]) : r[h]}
                      </td>
                    ))}

                    <td style={{ padding: 12 }}>
                      <button
                        onClick={() =>
                          setSelectedPlace({
                            lat: r.Latitude,
                            lng: r.Longitude,
                            name: r.Location,
                          })
                        }
                        style={{
                          background: "#6366f1",
                          color: "white",
                          padding: "8px 16px",
                          borderRadius: 999,
                          fontSize: 13,
                          border: "none",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {currentRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={allowedColumns.length + 1}
                      style={{
                        padding: 18,
                        textAlign: "center",
                        color: "#6b7280",
                        fontSize: 14,
                      }}
                    >
                      No results match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            style={{
              padding: "16px 18px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              background: "#f9fafb",
            }}
          >
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              style={{
                padding: "8px 14px",
                background: currentPage === 1 ? "#cbd5e1" : "#6366f1",
                color: "white",
                border: "none",
                borderRadius: 999,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                fontSize: 13,
              }}
            >
              ◀ Prev
            </button>

            <span style={{ fontSize: 14, fontWeight: 600 }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 14px",
                background: currentPage === totalPages ? "#cbd5e1" : "#6366f1",
                color: "white",
                border: "none",
                borderRadius: 999,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                fontSize: 13,
              }}
            >
              Next ▶
            </button>
          </div>
        </section>
      </div>

      {/* Maps modal */}
      {selectedPlace && (
        <div
          onClick={() => setSelectedPlace(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "80%",
              height: "80%",
              maxWidth: "1000px",
              background: "white",
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 20px 45px rgba(15,23,42,0.6)",
            }}
          >
            <button
              onClick={() => setSelectedPlace(null)}
              style={{
                position: "absolute",
                right: 20,
                top: 20,
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: 999,
                cursor: "pointer",
                fontWeight: 600,
                zIndex: 10,
                fontSize: 13,
              }}
            >
              Close
            </button>

            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${selectedPlace.lat},${selectedPlace.lng}&hl=en&z=17&output=embed`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
