const mongoose = require('mongoose'); 

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true }, // Identifiant unique MongoDB pour l'utilisateur qui a créé la sauce //
    name: { type: String, required: true }, // Nom de la sauce //
    manufacturer: { type: String, required: true }, // Fabricant de la sauce //
    description: { type: String, required: true }, // Description de la sauce //
    mainPepper: { type: String, required: true }, // Principal ingrédient dans la sauce //
    imageUrl: { type: String, required: true }, // String de l'image de la sauce téléchargée par l'utilisateur //
    heat: { type: Number, required: true }, // Nombre entre 1 et 10 décrivant la sauce //
    likes: { type: Number, required: false, default:0 }, // Nombre d'utilisateurs qui aiment la sauce //
    dislikes: { type: Number, required: false, default:0 }, // Nombre d'utilisateurs qui n'aiment pas la sauce //
    usersLiked: { type: [String], required: false }, // Tableau d'identifiants d'utilisateurs ayant aimé la sauce //
    usersDisliked: { type: [String], required: false }, // Tableau d'identifiants d'utilisateurs n'ayant pas aimé la sauce //


});

module.exports = mongoose.model('Sauce', sauceSchema);




