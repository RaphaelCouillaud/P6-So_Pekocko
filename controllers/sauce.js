// Logique métier //

const Sauce = require('../models/Sauce'); // Importation du modèle sauce car on va l'utiliser //
const fs = require('fs'); // Importation du package fs //

exports.createSauce = (req, res, next) => { // Création d'une sauce //
    const sauceObject = JSON.parse(req.body.sauce); // Extraction de l'objet JSON //
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // Protocole, nom d'hôte, images, nom du fichier //        
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};


exports.deleteSauce = (req, res, next) => { // Suppression d'une sauce //
    Sauce.findOne({ _id: req.params.id }) // On trouve l'objet dans la base de données //
        .then((sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1]; // Qd on le trouve, on extrait le nom du fichier //
            fs.unlink(`images/${filename}`, () => { // On le supprime avec fs.unlink //
                Sauce.deleteOne({ _id: req.params.id }) // Une fois la suppression, on l'indique à la base de données //
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => { // Obtention d'une sauce //
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => { // Obtention de toutes les sauces //
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => { // Modification d'une sauce //
    const sauceObject = req.file ? // Si on trouve un fichier, on utilise la même logique qu'auparavant //
        {
            ...JSON.parse(req.body.sauce), // On récupére les infos de l'objet contenues dans cette requête //
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // On modifie l'imageurl //
        } : { ...req.body }; // Sinon on prend le corps de la requête //
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // On prend l'objet créé et on modifie son identifiant pour correspondre à l'id des paramètres de requêtes //
        .then(() => res.status(201).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
}; 

exports.likeSauce = (req, res, next) => { // Gestion des likes/dislikes d'une sauce //
    const like = req.body.like;
    if (like === 1) { // Like + 1, on modifie mongodb avec inc et push //
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce appréciée !' }))
            .catch(error => res.status(400).json({ error }))
    } else if (like === -1) { // Dislike + 1 //
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce pas appréciée' }))
            .catch(error => res.status(400).json({ error }))

    } else {    // Annulation du Like ou Dislike //
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Changement pris en compte !' }))
                        .catch(error => res.status(400).json({ error }))
                }
                else if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Changement pris en compte !' }))
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
};