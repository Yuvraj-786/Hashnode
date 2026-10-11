const mongoose = require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required to be added in blacklist"],
        index: true,
        unique: true
    },
    expiresAt: {
        type: Date, 
        required: true,
        index: {expires: 0}
    }
}, {
    timestamps: true
})

const tokenBlacklistModel = mongoose.model("blacklistToken", blacklistTokenSchema)

module.exports = tokenBlacklistModel