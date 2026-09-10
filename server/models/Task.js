import mongoose, { mongo } from "mongoose";
import project from "./Project.js";

const taskSchema = new mongoose.Schema(
    {
        project: {
            type:mongoose.Types.ObjectId,
            ref: "Project",
            require: true,
        },
        title: {
            type: String,
            trim: "true",
            require: true,
        },
        description: {
            type: String,
            require: true,
        },
        status: {
            type: String,
            enum: ["todo","in-progress","done"],
            default: "todo",
        },
        priority: {
            type: String,
            enum: ["low","medium","high"],
            default: "medium",
        },
        assignedTo: {
            type:mongoose.Types.ObjectId,
            ref: "User",
            default: null,
        },
        dueDate: {
            type: Date,
            default: null,
        },
        createdBy: {
            type:mongoose.Types.ObjectId,
            ref: "User",
            require: true,
        },
    },
    { timestamps: true }
)

export default mongoose.model("Task", taskSchema)