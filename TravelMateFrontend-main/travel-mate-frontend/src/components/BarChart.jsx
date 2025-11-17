import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ rows, field }) {
  if (!rows.length) return <div>No data available for chart.</div>;

  const top10 = rows.slice(0, 10);
  const labels = top10.map((r) => r.Location);
  const values = top10.map((r) => +r[field]);

  const data = {
    labels,
    datasets: [
      {
        label: field,
        data: values,
        backgroundColor: "rgba(37, 99, 235, 0.6)"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "top" }, title: { display: true, text: `Top 10 by ${field}` } }
  };

  return (
    <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
