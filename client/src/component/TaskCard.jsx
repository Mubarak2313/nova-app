const PRIORITY_LABEL = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const TaskCard = ({ task, members, onStatusChange, onAssign, onDelete }) => {
  return (
    <div className="task-card">
      <div className="task-card-top">
        <span className={`priority-dot priority-${task.priority}`} />
        <span className="task-title">{task.title}</span>
        <button className="task-delete" onClick={() => onDelete(task._id)} title="Delete task">
          x
        </button>
      </div>

      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-card-footer">
        <select value={task.status} onChange={(e) => onStatusChange(task._id, e.target.value)}>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={task.assignedTo?._id || ""}
          onChange={(e) => onAssign(task._id, e.target.value)}
        >
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="task-priority-label">{PRIORITY_LABEL[task.priority]} priority</div>
    </div>
  );
};

export default TaskCard;