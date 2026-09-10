import express from "express";
import protect from "../middleware/auth.js"
import { getTasksForProject,createTask,updateTask,deleteTask } from "../controllers/taskController.js";

const router = express.Router();

router.use(protect);

router.get("/project/:projectId",getTasksForProject)
router.post("/project/:projectId",createTask)
router.route("/:id").put(updateTask).delete(deleteTask)

export default router;