const express = require('express')
const {
    registerUser,
    getUser,
    getAllUsers,
    editUser
} = require('../controllers/userController')

const router = express.Router()

// GET ALL
router.get('/', getAllUsers)

// GET ONE
router.get('/:id', getUser)

// REGISTER USER
router.post('/', registerUser)

// EDIT USER
router.patch('/:id', editUser)

module.exports = router;