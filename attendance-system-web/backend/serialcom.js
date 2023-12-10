const User = require('./models/UserModel')
const Attendancelog = require('./models/AttendanceLogModel')
const { SerialPort, PacketLengthParser } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
// TODO: DYNAMIC PORT PATH 

const port = new SerialPort({
    path: "COM4",
    baudRate: 9600
})

const parser = port.pipe(new ReadlineParser({ includeDelimiter: false }))
parser.on('data', async function(input) {
    var isTimeIn = true;
    try {
        const trimmedInput = input.trim()
        const existingUser = await User.findOne({ cardid: trimmedInput})
        if (!existingUser) {
            console.log('No such user!')
            return;
        }
        const latestAttendanceLogOfUser = await Attendancelog.findOne({ user: existingUser}).sort({createdAt: -1}).lean()
        const attendanceLog = await Attendancelog.create({user: existingUser, isTimeIn: !latestAttendanceLogOfUser.isTimeIn})
        console.log("attendance log: ", attendanceLog)

    } catch(error){
    }
});