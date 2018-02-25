const GameController = require('../../controllers/game_controller');

module.exports = (app) => {
    // app.get('/api/v1/games', GameController.getAll);
    // app.get('/api/v1/games/:id', GameController.getOne);
    app.post('/api/v1/games/', GameController.create);
    // app.put('/api/v1/games/:id/edit', GameController.edit);
    // app.delete('/api/v1/games/:id', GameController.delete);
};