const mongoose = require('mongoose')

const Schema = mongoose.Schema

const attendanceLogSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isTimeIn: Boolean
}, { timestamps: true})

module.exports = mongoose.model('AttendanceLog', attendanceLogSchema)
