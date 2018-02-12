const Company = require('../models/game_company.model');

module.exports = {
    create(req, res,) {
        
    },
    getAll(req, res,) {
        res.contentType('application/json');
        Company.find({})
            .then(result => {
                res.status(200).json(result);
            })
            .catch((error) => res.status(400).json(error));
    },
}