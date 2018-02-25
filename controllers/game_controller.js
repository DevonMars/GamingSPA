const Game = require('../models/game.model');
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "Blackboy.1"));
var session = driver.session();

module.exports = {
    create(req, res) {
        let companyId = req.params.companyId || '';
        res.contentType('application/json');
        const body = req.body;
        const gamepropbody = {
            title: body.title,
            publisher: body.publisher,
            description: body.description,
            engine: body.engine,
        };

        Game.create(gamepropbody)
            .then(game => {
                if (companyId != '') {
                    session.run(
                        "MATCH (c:Company {_id: idParam}) " +
                        "MERGE (g:Game {" +
                        "_id: {_id}, " +
                        "title: {titleParam}, " +
                        "publisher: {publishParam}, " +
                        "description: {descriptionParam}, " +
                        "engine: {engineParam}}) " +
                        "MERGE (c)-[r:CREATED]->(g) " +
                        "RETURN c, r, g",
                        {
                            titleParam: game.name,
                            _idParam: game._id.toString(),
                            publishParam: game.publisher,
                            descriptionParam: game.description,
                            engineParam: game.engine,
                            idParam: companyId._id.toString()
                        })
                        .then((result) => {
                            var game;
                            result.records.forEach(function (record) {
                                game = {
                                    title: record._fields[0].properties.title,
                                    description: record._fields[0].properties.description,
                                    publisher: record._fields[0].properties.publisher,
                                    engine: record._fields[0].properties.engine,
                                };
                            });
                            console.log('A new game has been created');
                            res.status(201).send(game);
                            session.close();
                        })
                        .catch((error) => res.status(400).send({error: error.message}));
                }})
    }
};