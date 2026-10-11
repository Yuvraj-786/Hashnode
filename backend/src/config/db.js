const mongoose = require('mongoose')

async function connectToDB() {
    if (!process.env.MONGODB_URL) {
        throw new Error("MONGODB_URL is not configured")
    }

    await mongoose.connect(process.env.MONGODB_URL)
    console.log('connected to database')
}

module.exports = connectToDB