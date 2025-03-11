const mongoose = require('mongoose')
require('dotenv').config()


const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.mongodbURL)
        console.log('database connected successfully')

    }catch(err){
        console.log('failed to connect mongodb',err)
        process.exit(1)
    }
}


module.exports = connectDB;
