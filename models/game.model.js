const mongoose = require('mongoose');
const CharacterSchema = ('./character.model');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    publisher: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        unique: true,
        required: true
    },
    engine: {
        type: String,
        unique: true,
        required: true
    },
    characters: [CharacterSchema]
});

const Game = mongoose.model('game', GameSchema);

module.exports = Game;