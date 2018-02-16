const CompanyController = require('../../controllers/game_company_controller');

module.exports = (app) => {
    app.get('/api/v1/companies', CompanyController.getAll);
    app.get('/api/v1/companies/:id', CompanyController.getOne);
    app.post('/api/v1/companies', CompanyController.create)
    app.put('/api/v1/companies/:id', CompanyController.update);
    app.delete('/api/v1/companies/:id', CompanyController.delete);
};