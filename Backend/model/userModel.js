const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    name:{
        type:String,
        requir:true
    },
    role:{
        type:String,
        require:true,
        enum:['Student', 'Admin']
    }
})

module.exports = mongoose.model('User', userSchema)