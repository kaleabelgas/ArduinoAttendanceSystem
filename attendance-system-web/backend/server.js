require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const attendancelogs = require('./routes/attendanceLogs')
const users = require('./routes/users')

const app = express()

//middleware

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})  

//routes
app.use('/api/attendancelogs', attendancelogs)
app.use('/api/users', users)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('listening on port ', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })

