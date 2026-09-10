import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/projects/${project._id}`} className="project-card">
      <div className="project-card-header">
        <h3>{project.title}</h3>
        <span className={`status-pill status-${project.status}`}>{project.status}</span>
      </div>
      <p className="project-card-desc">
        {project.description || "No description yet"}
      </p>
      <div className="project-card-members">
        {project.members.slice(0, 4).map((m) => (
          <div key={m?._id || m} className="avatar avatar-small" style={{ background: m.avatarColor }}>
            {m.name ? m.name.charAt(0).toUpperCase() : "?"}
          </div>
        ))}
        {project.members.length > 4 && (
          <div className="avatar avatar-small avatar-more">+{project.members.length - 4}</div>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;