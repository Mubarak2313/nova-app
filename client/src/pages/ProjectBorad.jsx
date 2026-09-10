
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import TaskCard from "../component/TaskCard.jsx";

const COLUMNS = [
  { key: "todo", label: "To do" },
  { key: "in-progress", label: "In progress" },
  { key: "done", label: "Done" },
];

const ProjectBoard = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");

  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState("");

  const loadData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error("Failed to load project", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await api.post(`/tasks/project/${id}`, {
        title: newTaskTitle,
        priority: newTaskPriority,
      });
      setTasks([res.data, ...tasks]);
      setNewTaskTitle("");
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    try {
      await api.put(`/tasks/${taskId}`, { status });
    } catch (err) {
      console.error("Failed to update status", err);
      loadData();
    }
  };

  const handleAssign = async (taskId, assignedTo) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { assignedTo: assignedTo || null });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
    } catch (err) {
      console.error("Failed to assign task", err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError("");
    try {
      const res = await api.post(`/projects/${id}/members`, { email: memberEmail });
      setProject((prev) => ({ ...prev, members: res.data }));
      setMemberEmail("");
    } catch (err) {
      setMemberError(err.response?.data?.message || "Could not add member");
    }
  };

  if (loading) return <div className="page-container">Loading project...</div>;
  if (!project) return <div className="page-container">Project not found</div>;

  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        ← All projects
      </Link>

      <div className="board-header">
        <div>
          <h1>{project.title}</h1>
          <p className="project-card-desc">{project.description}</p>
        </div>

        <div className="board-members">
          {project.members.map((m) => (
            <div
              key={m._id}
              className="avatar avatar-small"
              style={{ background: m.avatarColor }}
              title={m.name}
            >
              {m.name.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      <form className="inline-form" onSubmit={handleAddMember}>
        <input
          placeholder="Add member by email"
          value={memberEmail}
          onChange={(e) => setMemberEmail(e.target.value)}
        />
        <button type="submit">Add</button>
        {memberError && <span className="auth-error">{memberError}</span>}
      </form>

      <form className="inline-form" onSubmit={handleAddTask}>
        <input
          placeholder="New task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Add task</button>
      </form>

      <div className="board">
        {COLUMNS.map((col) => (
          <div key={col.key} className="board-column">
            <h3>
              {col.label}{" "}
              <span className="column-count">
                {tasks.filter((t) => t.status === col.key).length}
              </span>
            </h3>
            {tasks
              .filter((t) => t.status === col.key)
              .map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  members={project.members}
                  onStatusChange={handleStatusChange}
                  onAssign={handleAssign}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectBoard;