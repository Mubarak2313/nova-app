import mongoose, { Schema } from "mongoose"

const userSchema = new mongoose.Schema (
{
    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please add a email"],
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    avatarColor: {
        type: String,
        default: "#6366f1",
    },
},
{ timestamps: true}
);

const User = mongoose.model("User", userSchema)
export default User

