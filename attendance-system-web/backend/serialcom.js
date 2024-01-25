const User = require('./models/UserModel')
const Attendancelog = require('./models/AttendanceLogModel')
const { SerialPort, PacketLengthParser } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const express = require('express')
const { EventEmitter } = require('events')


const sseEmitter = new EventEmitter()

const router = express.Router()

var path = "";

SerialPort.list().then(function(ports){
    ports.forEach(function(port){
      path = port.path;
    })
  });

if(path !== ''){
    const port = new SerialPort({
        path: path,
        baudRate: 9600
    })
    
    const parser = port.pipe(new ReadlineParser({ includeDelimiter: false }))
    parser.on('data', async function(input) {
        try {
            console.log(input)
            const trimmedInput = input.trim()
            // TODO: check if isactive
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
            console.log(isTimeIn)
            const attendanceLog = await Attendancelog.create({user: existingUser, isTimeIn: !isTimeIn})
            sseEmitter.emit('serialData', attendanceLog)
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
    
    module.exports = sseEmitter
}


