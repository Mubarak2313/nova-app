import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate("owner", "name email avatarColor")
      .populate("members", "name email avatarColor")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch projects" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email avatarColor")
      .populate("members", "name email avatarColor");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isAllowed =
      project.owner._id.toString() === req.user._id.toString() ||
      project.members.some((m) => m._id.toString() === req.user._id.toString());

    if (!isAllowed) {
      return res.status(403).json({ message: "You don't have access to this project" });
    }

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch project" });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Project needs a title" });
    }

  const project = await Project.create({
  title,
  description,
  owner: req.user._id,
  members: [req.user._id],
});

const populated = await project.populate([
  { path: "owner", select: "name email avatarColor" },
  { path: "members", select: "name email avatarColor" },
]);

res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create project" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the owner can edit this project" });
    }

    const { title, description, status } = req.body;
    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (status) project.status = status;

    const updated = await project.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the owner can delete this project" });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete project" });
  }
};

export const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the owner can add members" });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    if (project.members.includes(userToAdd._id)) {
      return res.status(400).json({ message: "That user is already on this project" });
    }

    project.members.push(userToAdd._id);
    await project.save();

    const updated = await project.populate("members", "name email avatarColor");
    res.json(updated.members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not add member" });
  }
};