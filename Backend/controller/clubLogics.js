const Club = require("../model/clubModel");
const User = require('../model/userModel')


const path = require('path')
require('dotenv').config()
const nodemailer = require('nodemailer')

const cloudinary = require('cloudinary').v2

async function fileUploadToCloudinary(filePath,folder){
  return  await cloudinary.uploader.upload(filePath, 
    {folder,resource_type:'auto'} )
}


function checkFileType(supportedFile, fileExtension){
  return supportedFile.includes(fileExtension)
}


async function sendNotification(docs){

  const  transporter = nodemailer.createTransport({
    host:  process.env.host,
    auth:{
      user:  process.env.user,
      pass: process.env.pass 
    }
  })


const mailResponse = await transporter.sendMail({
    from:  'From CampusHum official',
    to:  docs.email,
    html:`<h1>congratulation club created successfully</h1> <a href="${docs.image}">Click to View Image</a> `,
    subject:`New Club created successfully`
  })

  return mailResponse;

}


const createClub = async (req, res) => {
  try {
  
    const { title, venue} = req.body;

    const {image} = req.files

    const {email} = req.user

    if (!title || !venue || !image || !email) {
      return res.status(400).json({
        success: false,
        message: "please provide all data for club creation",
      });
    }

    // console.log(image)

    const supportedFile = ['.jpeg', '.jpg', '.png']
    const fileExtension = path.extname(image.name)


    // console.log(checkFileType(supportedFile, fileExtension))

    if(checkFileType(supportedFile, fileExtension)){
       console.log('success')
        var cloudinaryResponse = await fileUploadToCloudinary(image.tempFilePath, 'campusHub')

      console.log('cloudinary response',cloudinaryResponse) 
    }else{
      return res.status(400).json({
        success: false,
        message: "image file not supported...",
      });
    }

   const response = await Club.create({ title, venue, email, image:cloudinaryResponse.secure_url });

   if(!response){
    return res.status(500).json({
      success: false,
      message: "failed to created club in mongodb...",
    });
   }

   const updateUser = await User.findOneAndUpdate({email}, {$push:{club:response._id}}, {new:true})

   const allUser = await User.find()


   for(let user of allUser){

      const emailResponse = await sendNotification(user)
      
      if(emailResponse){
        console.log('email response',emailResponse)
        
      }else{
        console.log('failed to send email')
      }
    
   }




    res.status(200).json({
      success: true,
      message: "club created successfully",
      data: response,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "failed to create Club data",
      err,
    });
  }
};

const showClub = async (req, res) => {
  try {
    const response = await Club.find();

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "club data not found",
        err,
      });
    }

    res.status(200).json({
      success: true,
      message: "club fetched successfully",
      response,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to get Club data",
      err,
    });
  }
};

const deleteClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    if (!clubId) {
      return res.status(400).json({
        success: false,
        message: "please provide Club id for deletion",
        err,
      });
    }

    const response = await Club.findByIdAndDelete(clubId);

    res.status(200).json({
      success: true,
      message: "club deleted successfully",
      response,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to delete Club data",
      err,
    });
  }
};

const updateClub = async (req, res) => {
  try {
      const { clubId } = req.params;
      let  { title, venue } = req.body;
    
      console.log(title, venue);
 

    if (!clubId) {
      return res.status(400).json({
        success: false,
        message: "please provide Club id for updataion",
        err,
      });
    }
 
    const clubData = await Club.findById(clubId);

    if (!clubData) {
      return res.status(400).json({
        success: false,
        message: "club not found by given Id for updation",
        err,
      });
    }

 

    if (!title) {
      title = clubData.title;
    }

    if (!venue) {
      venue = clubData[venue];
    }

  

    const response = await Club.findByIdAndUpdate(clubId, { title, venue });

    if (!response) {
      return res.status(400).json({
        success: false,
        message: "failed to updata club data by mongodb",
      });
    }

    res.status(200).json({
      success: true,
      message: "Club updateed successfully",
      response
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "failed to update Club data",
      err,
    });
  }
};

const userDashboard = async(req, res)=>{
  try{
    const {email} = req.user
    
    if(!email){
    return res.status(404).json({
      success: false,
      message: "email did not found",
      err,
    })
  }
  
  
  const user = await User.findOne({email}).populate('club')
  
  
  if(!user){
    return res.status(404).json({
      success: false,
      message: "user not found by this email id ",
      err,
    })
  }
  
  return res.status(200).json({
    success: true,
    message: "user dashboard data fetch successfully...... ",
    response:user
  })

  }catch(err){
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "failed to fetch user Dashboard data"+err,
    });
  }
}
module.exports = {createClub,showClub,deleteClub,updateClub, userDashboard}