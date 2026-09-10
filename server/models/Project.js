import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "User",
        },
        members: [
            {
            type: mongoose.Schema.Types.ObjectId,
             ref: "User",
        },
    ],
    status: {
        type: String,
        enum: ["active","on-hold","completed"],
        default: "active",
    }
    },
    { timestamps: true }
)

export default mongoose.model("Project",projectSchema)