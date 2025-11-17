export default function StatsPanel({ rows, field }) {
  if (!rows.length) return <div>No data loaded.</div>;

  const nums = rows.map((r) => +r[field]).filter((n) => !isNaN(n));
  const count = nums.length;
  const mean = (nums.reduce((a, b) => a + b, 0) / count).toFixed(2);
  const min = Math.min(...nums).toFixed(2);
  const max = Math.max(...nums).toFixed(2);
  const median = nums.sort((a, b) => a - b)[Math.floor(count / 2)].toFixed(2);

  return (
    <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <h3>Descriptive Statistics – {field}</h3>
      <p><b>Average Rating:</b> {mean}</p>
      <p><b>Min:</b> {min}</p>
      <p><b>Max:</b> {max}</p>
    </div>
  );
}
