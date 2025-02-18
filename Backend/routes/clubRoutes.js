const express = require('express');
const { createClub, showClub, deleteClub, updateClub } = require('../controller/clubLogics');
const { signup, login } = require('../controller/userLocics');
 
const router = express.Router();

// create api.............
router.post('/createClub', createClub)


//show api...........
router.get('/showClub', showClub)

// delete api...........

router.delete('/deleteClub/:clubId', deleteClub)

//update api...................

router.put('/updateClub/:clubId', updateClub)


//login api...........
router.post('/login',login)

//signup api............
router.post('/signup', signup)


module.exports = router




