const Company = require('../models/company.model');
const Game = require('../models/game.model');
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "Blackboy.1"));
var session = driver.session();

module.exports = {
    create(req, res) {
        res.contentType('application/json');
        const body = req.body;
        const companypropbody = {
            name: body.name,
            largeDescription: body.largeDescription,
            smallDescription: body.smallDescription,
            founder: body.founder,
            country: body.country,
            total_employees: body.total_employees,
            games: body.games
        };
        Company.create(companypropbody)
            .then((company) => {
                Game.findOne({'_id': company.games})
                    // .then((game) => {
                    //     // game.company.push(company);
                    //     // game.save();
                    // })
                    .then((company) => res.status(200).send(company))
                    .catch((error) => res.status(400).send({error: error.message}))
            })
    },
    getAll(req, res) {
        res.contentType('application/json');
        Company.find({})
            .then(result => {
                console.log('Showing a list of all companies');
                res.status(200).json(result);
            })
            .catch((error) => res.status(400).json(error));
    },

    getOne(req, res) {
        res.contentType('application/json');
        const id = req.params.id;

        Company.find({'_id' : id})
            .then((result) => {
                console.log('Showing a single company');
                res.status(200).json(result)
            })
            .catch((error) => res.status(400).send({error: error.message}))
    },

    edit(req, res) {
        res.contentType('application/json');
        const id = req.params.id;
        const body = req.body;

        Company.findByIdAndUpdate({'_id' : id}, body)
            .then(() => Company.findById({'_id': id}))
            .then((company) => {
            // Game.findByIdAndUpdate({'_id' : company.games});
            "use strict";
            if (company == null) {
                res.status(400).json({error: 'No objects'})
            } else {
                res.status(200).send(company);
            }
        })
            .catch((error) => res.status(400).send({error: error.message}));
    },

    delete(req, res){
        res.contentType('application/json');
        const id = req.params.id;

        Company.findByIdAndRemove({'_id' : id})
            .then((company) => {
                if (company == null) {
                    res.status(400).json({error: 'No objects deleted'});
                } else {
                    res.status(200).send(company);
                }
            })
            .catch((error) => res.status(400).send({error: error.message}));

    },

    addGametoCompany(req, res, next) {
        let companyId = req.body.companyId || '';

        if (companyId != '') {
            session.run("MATCH (c:Company {_id: {idParam}}) " +
                "MATCH (g:Game {_id: {gameParam}}) " +
                "MERGE (c)-[r:OWNS]->(g) " +
                "RETURN c, g;", {
                    idParam: companyId,
                    gameParam : req.body.gameId
                }
            ).catch(err => next(err)).then(result => {
                res.status(200).json({msg: "Company successfully owns this game"});
                session.close();
            });
        }
    },
};