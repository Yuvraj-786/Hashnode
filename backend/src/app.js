const express = require('express')
const cors = require('cors')

const app = express()

const errorHandler = require("../src/middleware/error.middleware")

// middleware to parse JSON
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use(express.json())
// requiring routes here
const authRouter = require("./routes/auth.routes")
const postRouter = require("./routes/post.routes")
const tagRouter = require("./routes/tag.routes")
const userRouter = require("./routes/user.routes")

// Using routes here
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/tags", tagRouter)
app.use("/api/users", userRouter)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    })
})
app.use(errorHandler)

module.exports = app