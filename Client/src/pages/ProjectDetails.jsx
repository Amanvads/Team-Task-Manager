import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { getUser } from "../api";

function ProjectDetails() {
  const { id } = useParams();
  const user = getUser();

  const [project, setProject] = useState(null);
  const [memberEmail, setMemberEmail] = useState("");
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedToId: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      setError("Failed to load project");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post(`/projects/${id}/members`, {
        email: memberEmail
      });
      setMemberEmail("");
      fetchProject();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/tasks", {
        title: taskForm.title,
        description: taskForm.description,
        dueDate: taskForm.dueDate || null,
        assignedToId: taskForm.assignedToId || null,
        projectId: Number(id)
      });

      setTaskForm({
        title: "",
        description: "",
        dueDate: "",
        assignedToId: ""
      });

      fetchProject();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      fetchProject();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  if (!project) {
    return <div className="page">Loading...</div>;
  }

  return (
    <div className="page">
      <h1>{project.name}</h1>
      <p>{project.description || "No description"}</p>

      {error && <p className="error">{error}</p>}

      {user?.role === "ADMIN" && (
        <form className="card form-inline" onSubmit={handleAddMember}>
          <h3>Add Member</h3>
          <input
            type="email"
            placeholder="Member email"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            required
          />
          <button type="submit">Add Member</button>
        </form>
      )}

      <div className="card">
        <h3>Members</h3>
        <ul>
          {project.members.map((member) => (
            <li key={member.id}>
              {member.user.name} - {member.user.email} ({member.user.role})
            </li>
          ))}
        </ul>
      </div>

      {user?.role === "ADMIN" && (
        <form className="card form-inline" onSubmit={handleCreateTask}>
          <h3>Create Task</h3>

          <input
            type="text"
            placeholder="Task title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) =>
              setTaskForm({ ...taskForm, description: e.target.value })
            }
          />

          <input
            type="date"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
          />

          <select
            value={taskForm.assignedToId}
            onChange={(e) =>
              setTaskForm({ ...taskForm, assignedToId: e.target.value })
            }
          >
            <option value="">Select member</option>
            {project.members.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {member.user.name}
              </option>
            ))}
          </select>

          <button type="submit">Create Task</button>
        </form>
      )}

      <div className="card">
        <h3>Tasks</h3>

        {project.tasks.length === 0 ? (
          <p>No tasks yet</p>
        ) : (
          <div className="task-list">
            {project.tasks.map((task) => {
              const canUpdate =
                user?.role === "ADMIN" || task.assignedToId === user?.id;

              return (
                <div className="task-item" key={task.id}>
                  <h4>{task.title}</h4>
                  <p>{task.description || "No description"}</p>
                  <p>
                    Assigned To: {task.assignedTo ? task.assignedTo.name : "Unassigned"}
                  </p>
                  <p>Status: {task.status}</p>
                  <p>
                    Due Date:{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No due date"}
                  </p>

                  <select
                    value={task.status}
                    disabled={!canUpdate}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;