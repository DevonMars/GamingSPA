const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
    name: {
        type: String,
        required: true,

    },
    gender: {
        type: String,
        required: true
    },
    backStory: {
        type: String,
        required: true
    },

    specialPower: {
        type: String,
        required: true
    },

    occupation: {
        type: String,
        required: true
    }

});


const Character = mongoose.model('character', CharacterSchema);

module.exports = Character;