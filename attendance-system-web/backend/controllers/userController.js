const User = require('../models/UserModel')
const mongoose = require('mongoose')

// register user
const registerUser = async (req, res) => {
    const {fname, lname, address, contact, email, isActive, cardid} = req.body

    try {
        const user = await User.create({fname, lname, address, contact, email, isActive, cardid})
        res.status(200).json(user)
    } catch(error){
        res.status(400).json({error: error.message})
    }
    res.json({mssg: 'ADD LOG'})
}

// edit user
const editUser = async(req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such user!'})
    }
    try {
        const user = await User.findByIdAndUpdate(id, {$set:req.body})
        res.status(200).json(user)
    } catch(error){
        res.status(400).json({error: error.message})
    } 
}

// get user
const getUser = async(req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such user!'})
    }
    const user = await User.findById(id)
    
    if (!user){
        return res.status(404).json({error: 'No such user!'})
    }
    res.status(200).json(user)
}


// get all users
const getAllUsers = async (req, res) => {
    const users = await User.find({}).sort({createdAt: 1})

    res.status(200).json(users)
}

module.exports = {
    registerUser,
    getUser,
    getAllUsers,
    editUser
}