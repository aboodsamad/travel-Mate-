import { useState, useMemo } from "react";
import CustomDropdown from "./CustomDropdown"; // adjust path if needed

export default function DataTable({ rows }) {
  const rowsPerPage = 10;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({});
  const [selectedPlaceId, setSelectedPlaceId] = useState(null); // for modal
  const [selectedPlace, setSelectedPlace] = useState(null);


  if (!rows || !rows.length) return <div>No data found.</div>;

  // Columns to show
  const allowedColumns = [
    "Location",
    "Country",
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
    <>
      {/* Search bar */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #cbd5e1",
            boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            width: "280px",
            maxWidth: "100%",
            outline: "none",
          }}
        />
      </div>

      {/* Filters with CustomDropdown */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {allowedColumns.map((col) => (
          <CustomDropdown
            key={col}
            label={col}
            value={filters[col] || ""}
            options={uniqueFilters[col]}
            onChange={(val) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, [col]: val || null }));
            }}
          />
        ))}
      </div>

      {/* Table + pagination */}
      <div
        style={{
          overflow: "auto",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          background: "white",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        <table
          width="100%"
          cellPadding="10"
          style={{ borderCollapse: "collapse", minWidth: "100%" }}
        >
          <thead>
            <tr
              style={{
                background: "#f9fafb",
                textAlign: "left",
                fontWeight: 600,
              }}
            >
              {allowedColumns.map((h) => (
                <th
                  key={h}
                  onClick={() => handleSort(h)}
                  style={{
                    borderBottom: "2px solid #e5e7eb",
                    padding: 12,
                    cursor: "pointer",
                    userSelect: "none",
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
                  borderBottom: "2px solid #e5e7eb",
                  padding: 12,
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
                  borderBottom: "1px solid #f0f0f0",
                  backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9fafb",
                }}
              >
                {allowedColumns.map((h) => (
                  <td key={h} style={{ padding: 12, verticalAlign: "middle" }}>
                    {h === "Rating" ? renderStars(r[h]) : r[h]}
                  </td>
                ))}

                {/* View column */}
                <td style={{ padding: 12 }}>
                  <button
                  onClick={() =>
                    setSelectedPlace({
                      lat: r.Latitude,
                      lng: r.Longitude,
                      name: r.Location
                    })
                  }
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    padding: "6px 14px",
                    borderRadius: 6,
                    fontSize: 14,
                    border: "none",
                    cursor: "pointer",
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
                  style={{ padding: 16, textAlign: "center", color: "#6b7280" }}
                >
                  No results match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem",
            borderTop: "1px solid #eee",
            background: "#fafafa",
          }}
        >
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            style={{
              padding: "8px 14px",
              background: currentPage === 1 ? "#ddd" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            ◀ Prev
          </button>

          <span style={{ fontSize: 14, fontWeight: 500 }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 14px",
              background: currentPage === totalPages ? "#ddd" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* Maps modal */}
      {selectedPlace && (
  <div
    onClick={() => setSelectedPlace(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
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
        background: "white",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)"
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
          padding: "8px 12px",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 600,
          zIndex: 10,
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

    </>
  );
}
