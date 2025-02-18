const express = require('express');
const { createClub, showClub, deleteClub, updateClub } = require('../controller/clubLogics');
 
const router = express.Router();

// create api.............
router.post('/createClub', createClub)


//show api...........
router.get('/showClub', showClub)

// delete api...........

router.delete('/deleteClub/:clubId', deleteClub)

//update api...................

router.put('/updateClub/:clubId', updateClub)

module.exports = router




