const dns = require("dns");

dns.setServers(["8.8.8.8"]);

require('dotenv').config()   // requiring config() we can use dotenv variables anywhere in the project

const PORT = process.env.PORT || 3000

const app = require('./src/app.js')
const connectToDB = require('./src/config/db.js')

async function startServer() {
    await connectToDB()
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`)
    })
}

startServer().catch((error) => {
    console.error("Server startup failed:", error)
    process.exitCode = 1
})