require('dotenv').config()

const express = require('express')
const attendancelogs = require('./routes/attendancelogs')
const users = require('./routes/users')

const app = express()

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})  

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/attendancelogs', attendancelogs)
app.use('/api/users', users)

app.listen(process.env.PORT, () => {
    console.log('listening on port ', process.env.PORT)
})