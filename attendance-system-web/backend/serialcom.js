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
    try {
        console.log(input)
        const trimmedInput = input.trim()
        const existingUser = await User.findOne({ cardid: trimmedInput})
        const existingUserLean = await User.findOne({ cardid: trimmedInput}).lean()
        if (!existingUser) {
            port.write(`<No such user!#CID:${trimmedInput}.>`, function(err) {
                if (err) {
                  return console.log('Error on write: ', err.message)
                }
            })
            return;
        }
        const latestAttendanceLogOfUser = await Attendancelog.findOne({ user: existingUser}).sort({createdAt: -1}).lean()
        var isTimeIn = latestAttendanceLogOfUser?.isTimeIn ?? false;
        const attendanceLog = await Attendancelog.create({user: existingUser, isTimeIn: !isTimeIn})
        var isTimeInString = latestAttendanceLogOfUser.isTimeIn ? "Time in:" : "Time out:"
        port.write(`<${isTimeInString}#${existingUserLean.lname}>`, function(err) {
            if (err) {
              return console.log('Error on write: ', err.message)
            }
        })

    } catch(error){ 
        console.log(error)
    }
})

