// Logique de routing //
const express = require('express');
const router = express.Router();

const sauceControl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/', auth, multer, sauceControl.createSauce); // On rajoute les middlewares auth et multer sur les routes qu'on veut protéger //
router.delete('/:id', auth, sauceControl.deleteSauce);
router.get('/:id', auth, sauceControl.getOneSauce);
router.get('/', auth, sauceControl.getAllSauces);
router.put('/:id', auth, multer, sauceControl.modifySauce);
router.post('/:id/like', auth, multer, sauceControl.likeSauce); 



module.exports = router;




