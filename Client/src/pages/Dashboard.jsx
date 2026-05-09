import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
    fetchProjects();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data);
    } catch (err) {
      setError("Failed to load dashboard");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Team Task Dashboard</h1>
          <p>Manage your projects and tasks efficiently</p>
        </div>

        <div className="dashboard-actions">
          <button
            className="btn primary-btn"
            onClick={() => navigate("/create-project")}
          >
            + Create Project
          </button>
        </div>
      </div>

      
      {error && <p className="error">{error}</p>}

      
      <div className="stats-grid">
        <div className="stat-card total-card">
          <h3>Total Projects</h3>
          <p>{stats.totalProjects}</p>
        </div>

        <div className="stat-card tasks-card">
          <h3>Total Tasks</h3>
          <p>{stats.totalTasks}</p>
        </div>

        <div className="stat-card todo-card">
          <h3>TODO</h3>
          <p>{stats.todo}</p>
        </div>

        <div className="stat-card progress-card">
          <h3>IN PROGRESS</h3>
          <p>{stats.inProgress}</p>
        </div>

        <div className="stat-card done-card">
          <h3>DONE</h3>
          <p>{stats.done}</p>
        </div>

        <div className="stat-card overdue-card">
          <h3>OVERDUE</h3>
          <p>{stats.overdue}</p>
        </div>
      </div>

      {/* STATUS OVERVIEW */}
      <div className="status-section">
        <h2>Task Status Overview</h2>

        <div className="status-container">
          <div className="status-box todo">
            <span className="dot"></span>
            <h4>TODO</h4>
            <p>{stats.todo} Tasks</p>
          </div>

          <div className="status-box progress">
            <span className="dot"></span>
            <h4>IN PROGRESS</h4>
            <p>{stats.inProgress} Tasks</p>
          </div>

          <div className="status-box done">
            <span className="dot"></span>
            <h4>DONE</h4>
            <p>{stats.done} Tasks</p>
          </div>
        </div>
      </div>

      {/* PROJECT LIST */}
      <div className="projects-section">
        <div className="section-header">
          <h2>Recent Projects</h2>

          <button
            className="view-all-btn"
            onClick={() => navigate("/projects")}
          >
            View All
          </button>
        </div>

        {loading ? (
          <p className="loading">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <h3>No Projects Found</h3>
            <p>Create your first project to get started</p>

            <button
              className="btn primary-btn"
              onClick={() => navigate("/create-project")}
            >
              + Create Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div className="project-card" key={project.id}>
                <div className="project-top">
                  <h3>{project.name}</h3>

                  <span className="task-count">
                    {project.tasks?.length || 0} Tasks
                  </span>
                </div>

                <p className="project-description">
                  {project.description || "No description available"}
                </p>

                <div className="project-members">
                  <h4>Members</h4>

                  <div className="member-list">
                    {project.members?.slice(0, 4).map((member) => (
                      <div className="member-badge" key={member.id}>
                        {member.user.name?.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className="open-project-btn"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  Open Project
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;