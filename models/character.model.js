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
    age: {
        type: Number,
        required: true
    }
});


const Character = mongoose.model('character', CharacterSchema);

module.exports = Character;