const Attendancelog = require('../models/AttendanceLogModel')
const User = require('../models/UserModel')

// get all logs
const getAllLogs = async (req, res) => {
    const logs = await Attendancelog.find({}).populate('user').sort({createdAt: -1})

    res.status(200).json(logs)
}

const getLimited = async (req, res) => {
    const { count } = req.params
    const logs = await Attendancelog.find({}).limit(count).populate('user').sort({createdAt: -1})

    res.status(200).json(logs)
}

// add log
const createLog = async (req, res) => {
    const { cardid, isTimeIn } = req.body
    // TODO: number validation
    try {
        const existingUser = await User.findOne({ cardid: cardid})
        if (!existingUser) {
            res.status(404).json({})
            console.log('No such user!')
            return;
        }
        const attendanceLog = await Attendancelog.create({fname: existingUser.fname, lname: existingUser.lname, cardid: existingUser.cardid, user: existingUser, isTimeIn: isTimeIn})
        res.status(200).json(attendanceLog)
    } catch(error){
        res.status(400).json({error: error.message})
    }
}

// filter logs by timestamp
const getByDate = async (req, res) => {
    const { from, to } = req.query
    var startDate = new Date(from)
    var endDate = new Date(to)
    const logs = await Attendancelog.find({
        createdAt: {
            $gte: startDate,
            $lte: endDate
        }
    }).populate('user').sort({createdAt: 1})
    console.log(logs)
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
    console.log(user.fname)
    const userLogs = await Attendancelog.find({user: user}).populate({
        path: 'user',
        match: {
            _id : user._id
        }
    }).sort({createdAt: 1})
    console.log(userLogs)
    res.status(200).json(userLogs)
}

module.exports = {
    createLog,
    getAllLogs,
    getByUser,
    getByDate,
    getLimited
}