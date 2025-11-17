import { useEffect, useState } from "react";

export default function YelpDataLoader({ onData }) {
  const [status, setStatus] = useState("Loading data...");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setStatus("Loading Lebanon places from saved data...");
        
        // Load from the JSON file you just saved
        const response = await fetch('/lebanon_google_places.json');
        
        if (!response.ok) {
          throw new Error('Failed to load data file');
        }
        
        const places = await response.json();
        
        setStatus(`✅ Loaded ${places.length} places from Google Places!`);
        onData(places);
        setIsLoading(false);

      } catch (err) {
        setError(`Error: ${err.message}`);
        setIsLoading(false);
      }
    }

    loadData();
  }, [onData]);

  return (
    <div style={{
      padding: "20px",
      backgroundColor: isLoading ? "#fff3cd" : error ? "#f8d7da" : "#d4edda",
      border: "1px solid " + (isLoading ? "#ffc107" : error ? "#dc3545" : "#28a745"),
      borderRadius: "5px",
      marginBottom: "20px"
    }}>
      {isLoading && (
        <div>
          <strong>⏳ Loading data...</strong>
          <p style={{ margin: "10px 0", fontSize: "14px" }}>{status}</p>
        </div>
      )}
      
      {error && (
        <div>
          <strong>❌ Error loading data</strong>
          <p style={{ margin: "10px 0", fontSize: "14px", color: "#721c24" }}>{error}</p>
          <p style={{ fontSize: "12px", marginTop: "10px" }}>
            Make sure <code>lebanon_google_places.json</code> is in the <code>public</code> folder.
          </p>
        </div>
      )}
      
      {!isLoading && !error && (
        <div>
          <strong>✅ Dataset loaded!</strong>
          <p style={{ margin: "10px 0", fontSize: "14px" }}>{status}</p>
        </div>
      )}
    </div>
  );
}