const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // Package de validation //

const userSchema = mongoose.Schema({ // Fonction schema de mongoose //
    email: { type: String, required: true, unique: true }, // Impossible de s'inscrire avec même adresse mail //
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // On l'applique au schéma //

module.exports = mongoose.model('User', userSchema); // On exporte ce schéma sous forme de modèle //
