const Attendancelog = require('../models/AttendanceLogModel')
const UserModel = require('../models/UserModel')
const User = require('../models/UserModel')

// get all logs
const getAllLogs = async (req, res) => {
    const logs = await Attendancelog.find({}).sort({createdAt: 1})

    res.status(200).json(logs)
}

// add log
const createLog = async (req, res) => {
    const { cardid, logType } = req.body
    // TODO: number validation
    try {
        const existingUser = await User.findOne({ cardid: cardid})
        if (!existingUser) {
            res.status(404).json({})
            console.log('No such user!')
        return;
        }
        const attendanceLog = await Attendancelog.create({user: existingUser, logType: logType})
        res.status(200).json(attendanceLog)
    } catch(error){
        res.status(400).json({error: error.message})
    }
}

// filter logs by timestamp
const getByDate = async (req, res) => {
    const { from, to } = req.query
    var startDate = new Date(from).toISOString()
    var endDate = new Date(to).toISOString()
    const logs = await Attendancelog.find({
        createdAt: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({createdAt: 1})
    // TODO: frontend should check if json is empty
    res.status(200).json(logs)
}

// filter logs by user
const getByUser = async (req, res) => {
    const { fname, lname } = req.query
    const user = await User.findOne({ fname: fname, lname: lname})
    if (!user) {
        res.status(404).json({})
        console.log('No such user!')
        return;
    }
    console.log(user._id)
    const userLogs = await Attendancelog.find().populate({
        path: 'user',
        match: {
            _id : user._id
        }
    }).sort({createdAt: 1})
    res.status(200).json(userLogs)
}

module.exports = {
    createLog,
    getAllLogs,
    getByUser,
    getByDate
}