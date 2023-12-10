const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    fname: String,
    lname: String,
    address: String,
    contact: String,
    email: String,
    isActive: Boolean,
    cardid: String
}, { timestamps: true})

module.exports = mongoose.model('User', userSchema)