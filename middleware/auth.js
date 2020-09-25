const jwt = require('jsonwebtoken'); // On a besoin du package jwt //

module.exports = (req, res, next) => { // On exporte un middleware //
    try {
        const token = req.headers.authorization.split(' ')[1]; // Récupération du token dans le header dans un tableau split et on retourne le 2ème élément //
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // On décode le token, la clé doit coorespondre à celle de la fontion login //
        const userId = decodedToken.userId; // On récupére l'userId //
        if (req.body.userId && req.body.userId !== userId) { // Si l'userId du corps de la requête est différent de userId //
            throw 'User ID non valable'; // Throw pour renvoyer l'erreur //
        } else {
            next();// Tout est ok donc, on passe au prochain middleware //
        }
    } catch {
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    }
};