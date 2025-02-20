require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
      const token = req.body.token  || req.headers.authorization.split(' ')[1] || req.cookies.token;
      



    console.log(token)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "token did not found",
      });
    }

    const payload = jwt.verify(token, process.env.jwt_secret);

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = payload;

     next();
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "failed to authenticate .....",
    });
  }
};

const isStudent = (req, res, next) => {
  try {
    const role = req.user.role;

    if (!role) {
      return res.status(500).json({
        success: false,
        message: "failed to find role .....",
      });
    }

    if(role !== "Student") {
        return res.status(500).json({
            success: false,
            message: "You are not student....",
          });
    }

    next()

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to authorise student .....",
    });
}
};

const isAdmin = (req,res,next)=>{
    try{
        const role = req.user.role

        if (!role) {
            return res.status(500).json({
              success: false,
              message: "failed to find role .....",
            });
          }
      
          if(role !== "Admin") {
              return res.status(500).json({
                  success: false,
                  message: "You are not Admin....",
                });
          }
      
          next()


    }catch(err){
        console.log(err)
        return res.status(500).json({
          success: false,
          message: "failed to authorise Admin .....",
        });
        
    }
}

module.exports = {auth, isAdmin, isStudent}