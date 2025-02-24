const User = require('../model/userModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const signup = async(req,res)=>{
    try{

      

        const {name, email, password, role} = req.body;

        console.log(name, email, password, role)

        if(!name ||!email ||!password ||!role){
            return res.status(400).json({
                success:false,
                message: "Please provide all data for signup..."
            })
        }

        const userResponse = await User.findOne({email})

        if(userResponse){
            return res.status(401).json({
                success:false,
                message:'user already exist by this email...'
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)

        if(!hashedPassword){
            return res.status(401).json({
                success:false,
                message:'password did not hashed....'
            })
        }

        const response  = await User.create({name, email, password:hashedPassword, role})

        res.status(200).json({
            success:true,
            message:'acount created successfully...',
            response
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:'Failed to sign up....'
        })
    }
}


const login = async (req,res)=>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:'please provide all data for login...'
            })
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({
                success:false,
                message:'first create your account and try again'
            })
        }

        const comparePassword = await bcrypt.compare(password, user.password)


        if(!comparePassword){
            return res.status(401).json({
                success:false,
                message:'Invalid password failed to login...'
            })
        }



        const payload = {
            id :	user._id,
            role :	user.role,
            email :	user.email
        }

        let token = jwt.sign(payload, process.env.jwt_secret, {expiresIn:'3d'})

        if(!token){
            return res.status(401).json({
                success:false,
                message:'failed to create token'
            })
        }

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly:true,
            // secure:true,
        }

        
        res.cookie('tokenCookie',token, options).status(200).json({
            success:true,
            message:'login successfully........',
            user,
            token
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:'Failed to Login ....'
        }) 
    }
}

module.exports = {signup, login}