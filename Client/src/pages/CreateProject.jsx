import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./CreateProject.css";

function CreateProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/projects", formData);

      alert("Project Created Successfully");

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-page">
      <form className="project-form" onSubmit={handleSubmit}>
        <h2>Create New Project</h2>

        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label>Project Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter project name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            name="description"
            placeholder="Enter project description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}

export default CreateProject;