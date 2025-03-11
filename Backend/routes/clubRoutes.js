const express = require('express');
const { createClub, showClub, deleteClub, updateClub, userDashboard } = require('../controller/clubLogics');
const { signup, login } = require('../controller/userLocics');
const { auth, isAdmin } = require('../middleware/auth');
 
const router = express.Router();

// create api............ .
router.post('/createClub', auth,  isAdmin,  createClub)

//show api...........
router.get('/showClub', showClub)

// delete api...........

router.delete('/deleteClub/:clubId',auth, isAdmin ,deleteClub)
//update api...................

router.put('/updateClub/:clubId', updateClub)

//user dashboard data..........
router.get('/userdashboard', auth,    userDashboard)

//login api...........
router.post('/login', login)

//signup api............
router.post('/signup', signup)


module.exports = router