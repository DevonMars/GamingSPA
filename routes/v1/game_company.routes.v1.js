const CompanyController = require('../../controllers/game_company_controller');

module.exports = (app) => {
    app.get('/api/v1/companies', CompanyController.getAll);
    app.get('/api/v1/companies/:id', CompanyController.getOne);
    app.post('/api/v1/companies/', CompanyController.create);
    app.post('/api/v1/companies/:id/addGame', CompanyController.addGametoCompany);
    app.put('/api/v1/companies/:id/edit', CompanyController.edit);
    app.delete('/api/v1/companies/:id', CompanyController.delete);
};