require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const attendancelogs = require('./routes/attendanceLogs')
const users = require('./routes/users')
const path = require('path');

const serialcom = require('./serialcom')
const { EventEmitter } = require('events')




const app = express()
//middleware

app.use(cors())

app.use(express.json())

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use((req, res, next) => {
  console.log(req.path, req.method, req.query)
  next()
})

//routes
app.use('/api/attendancelogs', attendancelogs)
app.use('/api/users', users)

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sseEmitter = require('./serialcom')

  // Listen for events emitted from the serial port reader
  sseEmitter.on('serialData', (data) => {
    // Send serial port data as SSE event
    res.write(`data: ${data}\n\n`);
  });

  // Clean up the SSE connection on client disconnect
  req.on('close', () => {
    res.end();
  });
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

//connect to db
mongoose.connect('mongodb://127.0.0.1:27017/projectuno')
  .then(() => {
    console.log("test")
    app.listen(4000, () => {
      console.log('listening on port ', 4000)
    })
  })
  .catch((error) => {
    console.log("error: ", error)
  })

