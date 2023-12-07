const express = require('express')
const {
    createLog,
    getAllLogs,
    getByUser,
    getByDate
} = require('../controllers/attendanceLogController')

const router = express.Router()

// GET ALL
router.get('/', getAllLogs)

// ADD LOG
router.post('/', createLog)

// GET BY USER
router.get('/byuser', getByUser)

// GET BY TIMESTAMP
router.get('/bydaterange', getByDate)

module.exports = router