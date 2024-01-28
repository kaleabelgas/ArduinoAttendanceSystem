const express = require('express')
const {
    createLog,
    getAllLogs,
    getByUser,
    getByDate,
    getLimited,
    getByUserAndDate
} = require('../controllers/attendanceLogController')

const router = express.Router()

// GET ALL
router.get('/', getAllLogs)

//GET LIMITED
router.get('/count/:count', getLimited)

// ADD LOG
router.post('/', createLog)

// GET BY USER
router.get('/byuser', getByUser)
router.get('/byuseranddate', getByUserAndDate)

// GET BY TIMESTAMP
router.get('/bydaterange', getByDate)

// TODO: PATCH TIMESTAMP DATE (take exact timestamp via query)
// hide _id of attendance logs on frontend but pass it on delete & patch

// TODO: DELETE TIMESTAMP (just in case of duplicate)

module.exports = router