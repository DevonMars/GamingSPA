const mongoose = require('mongoose');
const CharacterSchema = ('./character.model');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    developer: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    engine: {
        type: String,
        required: true
    },
    character: [{
        type: Schema.Types.ObjectId,
        ref: 'character'
    }]
});

const Game = mongoose.model('game', GameSchema);

module.exports = Game;