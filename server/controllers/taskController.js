import Task from "../models/Task.js";
import Project from "../models/Project.js";

const userHasAccess = (project, userId) => {
  return (
    project.owner.toString() === userId.toString() ||
    project.members.some((m) => m.toString() === userId.toString())
  );
};

export const getTasksForProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!userHasAccess(project, req.user._id)) {
      return res.status(403).json({ message: "You don't have access to this project" });
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email avatarColor")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch tasks" });
  }
};

export const createTask = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!userHasAccess(project, req.user._id)) {
      return res.status(403).json({ message: "You don't have access to this project" });
    }

    const { title, description, priority, assignedTo, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Task needs a title" });

    const task = await Task.create({
      project: project._id,
      title,
      description,
      priority,
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      createdBy: req.user._id,
    });

    const populated = await task.populate("assignedTo", "name email avatarColor");
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!userHasAccess(task.project, req.user._id)) {
      return res.status(403).json({ message: "You don't have access to this task" });
    }

    const fields = ["title", "description", "status", "priority", "assignedTo", "dueDate"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    const updated = await task.save();
    const populated = await updated.populate("assignedTo", "name email avatarColor");
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!userHasAccess(task.project, req.user._id)) {
      return res.status(403).json({ message: "You don't have access to this task" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete task" });
  }
};