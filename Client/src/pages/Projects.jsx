import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getUser } from "../api";

function Projects() {
  const user = getUser();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      setError("Failed to load projects");
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/projects", form);
      setForm({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div className="page">
      <h1>Projects</h1>

      {user?.role === "ADMIN" && (
        <form className="card form-inline" onSubmit={handleCreateProject}>
          <h3>Create Project</h3>

          <input
            type="text"
            placeholder="Project name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <button type="submit">Create</button>
        </form>
      )}

      {error && <p className="error">{error}</p>}

      <div className="grid">
        {projects.map((project) => (
          <div className="card" key={project.id}>
            <h3>{project.name}</h3>
            <p>{project.description || "No description"}</p>
            <p>Members: {project.members.length}</p>
            <p>Tasks: {project.tasks.length}</p>
            <Link className="link-button" to={`/projects/${project.id}`}>
              Open Project
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;