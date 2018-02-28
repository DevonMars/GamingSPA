const CharacterController = require('../../controllers/game_character_controller');

module.exports = (app) => {
    app.get('/api/v1/characters', CharacterController.getAll);
    app.get('/api/v1/characters/:id', CharacterController.getOne);
    app.post('/api/v1/characters/', CharacterController.create);
    app.put('/api/v1/characters/:id/edit', CharacterController.edit);
    app.delete('/api/v1/characters/:id', CharacterController.delete);
};