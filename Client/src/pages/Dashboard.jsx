import { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data);
    } catch (err) {
      setError("Failed to load dashboard");
    }
  };

  return (
    <div className="page">
      <h1>Dashboard</h1>

      {error && <p className="error">{error}</p>}

      <div className="grid">
        <div className="card stat-card">
          <h3>Total Tasks</h3>
          <p>{stats.total}</p>
        </div>

        <div className="card stat-card">
          <h3>Todo</h3>
          <p>{stats.todo}</p>
        </div>

        <div className="card stat-card">
          <h3>In Progress</h3>
          <p>{stats.inProgress}</p>
        </div>

        <div className="card stat-card">
          <h3>Done</h3>
          <p>{stats.done}</p>
        </div>

        <div className="card stat-card">
          <h3>Overdue</h3>
          <p>{stats.overdue}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;