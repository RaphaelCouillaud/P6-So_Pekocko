const express = require('express'); // On a besoin d'express pour créer le routeur //
const router = express.Router(); // Création du routeur //

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup); // Création des 2 routes avec les méthodes signup et login //
router.post('/login', userCtrl.login);

module.exports = router;