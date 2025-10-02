import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";

function Dashboard() {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/metrics", {}, token)
      .then(setMetrics)
      .catch((err) => console.error(err.message));
  }, [token]);

  return (
    <div>
      <h1>Dashboard</h1>
      {metrics ? (
        <pre>{JSON.stringify(metrics, null, 2)}</pre>
      ) : (
        <p>Loading metrics...</p>
      )}
    </div>
  );
}

export default Dashboard;
