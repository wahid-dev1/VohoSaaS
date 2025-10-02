// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login"); // redirect if not logged in
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch(
          `${window.location.protocol}//${window.location.hostname}:4000/api/metrics`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Unauthorized");

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    }

    fetchData();
  }, [navigate]);

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>📊 Number of calls: {data.callsCount}</p>
      <p>👥 Active users: {data.activeUsers}</p>
    </div>
  );
}

export default Dashboard;
