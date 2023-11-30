const express = require('express')

const router = express.Router()

// GET ALL
router.get('/', (req, res) => {

})

// ADD LOG
router.post('/', (req, res) => {
    res.json({mssg: 'ADD LOG'})
})

module.exports = router