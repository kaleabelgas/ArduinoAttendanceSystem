const User = require('./models/UserModel')
const Attendancelog = require('./models/AttendanceLogModel')
const { SerialPort, PacketLengthParser } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const express = require('express')
const { EventEmitter } = require('events')


const sseEmitter = new EventEmitter()

const router = express.Router()

var path = "";

SerialPort.list().then(function (ports) {
    ports.forEach(function (port) {
        path = port.path;
    })
    if (path !== '') {
        const port = new SerialPort({
            path: path,
            baudRate: 9600
        })

        const parser = port.pipe(new ReadlineParser({ includeDelimiter: false }))
        parser.on('data', async function (input) {
            try {
                console.log(input)
                const trimmedInput = input.trim()
                // TODO: check if isactive
                const existingUser = await User.findOne({ cardid: trimmedInput })
                const existingUserLean = await User.findOne({ cardid: trimmedInput }).lean()

                if (!existingUser) {
                    port.write(`<Card not#registered!.>`, function (err) {
                        if (err) {
                            return console.log('Error on write: ', err.message)
                        }
                    })
                    return;
                }
                if (!existingUser.isActive) {
                    port.write(`<No such user!.>`, function (err) {
                        if (err) {
                            return console.log('Error on write: ', err.message)
                        }
                    })
                    return;
                }
                const latestAttendanceLogOfUser = await Attendancelog.findOne({ user: existingUser }).sort({ createdAt: -1 }).lean();

                // Determine if it's a new day
                const currentDay = new Date().setHours(0, 0, 0, 0); // Get the current day at midnight
                const isNewDay =
                    !latestAttendanceLogOfUser ||
                    new Date(latestAttendanceLogOfUser.createdAt).setHours(0, 0, 0, 0) !== currentDay;

                // Reset isTimeIn to true if it's a new day
                const isTimeIn = isNewDay ? true : latestAttendanceLogOfUser?.isTimeIn ?? false;

                console.log(isTimeIn);
                const attendanceLog = await Attendancelog.create({ fname: existingUser.fname, lname: existingUser.lname, cardid: existingUser.cardid, user: existingUser, isTimeIn: !isTimeIn })
                sseEmitter.emit('serialData', attendanceLog)
                if (latestAttendanceLogOfUser.isTimeIn !== null) {
                    var isTimeInString = latestAttendanceLogOfUser.isTimeIn ? "Time in:" : "Time out:"
                }else{
                    var isTimeInString = "Time in:"
                }
                port.write(`<${isTimeInString}#${existingUserLean.lname}>`, function (err) {
                    if (err) {
                        return console.log('Error on write: ', err.message)
                    }
                })

            } catch (error) {
                console.log(error)
            }
        })
    }
});

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
};

delay(1000)



module.exports = sseEmitter

