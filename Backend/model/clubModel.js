const mongoose = require('mongoose')

const clubSchema = new mongoose.Schema({
    image:{
        type:String,
        // required: true
    },
    title:{
        type:String,
        required: true
    },
    venue:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Club',clubSchema)