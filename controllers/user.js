const bcrypt = require('bcrypt'); // Hashage de passwords //
const jwt = require('jsonwebtoken'); // Sécurisation de la connection grâce à des tokens uniques //

const User = require('../models/User'); // Importation du modèle User //

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //Fonction pour hasher un mot de passe fonc async//
        .then(hash => { // On récupére le hash //
            const user = new User({  // On prend ce mot de passe crypté pour créer un nouvel utilisateur //
                email: req.body.email, // Avec l'adresse mail passé //
                password: hash // Et le password hashé //
            });
            user.save() // Enregistrement de l'utilisateur dans la base de données //
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // Trouver si un utilisateur correspond à l'adresse envoyé dans la requête //
        .then(user => {
            if (!user) { // Pas d'user trouvé //
                return res.status(401).json({ error: 'Utilisateur inconnu !' });
            }
            bcrypt.compare(req.body.password, user.password) // On compare le password envoyé avec la password hashé //
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({ // Si comparaison ok, on renvoit un objet JSON contenant //
                        userId: user._id, // L'userId + //
                        token: jwt.sign( // Un token - Fonction sign de JsonWebToken//
                            { userId: user._id }, // 1er argument : données à encoder //
                            'RANDOM_TOKEN_SECRET', // 2ème : clé secréte encodage //
                            { expiresIn: '24h' }// 3 :argument de configuration //
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })

        .catch(error => res.status(500).json({ error }));
};