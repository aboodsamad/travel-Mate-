import DataTable from "../components/DataTable";

export default function DataTablePage({ rows }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>
  Explore 🧭
</h2>


      <DataTable rows={rows} />
    </div>
  );
}
