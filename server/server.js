import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js"


dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req,res) => {
    res.send("NOVA API IS RUNNING");
});

app.use("/api/auth", authRoutes)
app.use("/api/projects",projectRoutes)
app.use("/api/tasks", taskRoutes)

app.use((err, req, res, next)=>{
    res.status(404).json({ message: "Route not found" })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(err.status  || 500).json({ message: err.message || "Something went wrong" })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))