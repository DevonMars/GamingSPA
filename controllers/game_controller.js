const Game = require('../models/game.model');
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "Blackboy.1"));
var session = driver.session();

module.exports = {
    create(req, res) {
        res.contentType('application/json');
        const body = req.body;
        const gamepropbody = {
            title: body.title,
            developer: body.developer,
            description: body.description,
            engine: body.engine,
        };

        Game.create(gamepropbody)
            .then(game => {
                    session.run(
                        "MERGE (g:Game {" +
                        "_id: {_id}, " +
                        "title: {titleParam}, " +
                        "developer: {developerParam}, " +
                        "description: {descriptionParam}, " +
                        "engine: {engineParam}}) " +
                        "RETURN g",
                        {
                            titleParam: game.title,
                            _id: game._id.toString(),
                            developerParam: game.developer,
                            descriptionParam: game.description,
                            engineParam: game.engine,
                        })
                        .then((result) => {
                            var game;
                            result.records.forEach(function (record) {
                                game = {
                                    title: record._fields[0].properties.title,
                                    developer: record._fields[0].properties.developer,
                                    description: record._fields[0].properties.description,
                                    engine: record._fields[0].properties.engine,
                                };
                            });
                            console.log('A new game has been created');
                            res.status(201).send(game);
                            session.close();
                        })
                        .catch((error) => res.status(400).send({error: error.message}));
                })
    },

    getAll(req, res) {
        res.contentType('application/json');
        Game.find({})
            .then(result => {
                console.log('Showing a list of all games');
                res.status(200).json(result);
            })
            .catch((error) => res.status(400).json(error));
    },

    getOne(req, res) {
        res.contentType('application/json');
        const id = req.params.id;

        session.run("MATCH (g:Game) WHERE g._id = {idParam} RETURN g", {idParam : id})
            .then((result) => {
                var game;
                result.records.forEach(function (record) {
                    game = {
                        _id: record._fields[0].properties._id,
                        title: record._fields[0].properties.title,
                        developer: record._fields[0].properties.developer,
                        description: record._fields[0].properties.description,
                        engine: record._fields[0].properties.engine,
                    }
                });
                console.log('Showing info of a single Game');
                res.status(200).send(game);
                session.close();
            })
            .catch((error) => res.status(400).send({error: error.message}));
    },

    delete(req, res){
        res.contentType('application/json');
        const id = req.params.id;

        Game.findByIdAndRemove({'_id' : id})
            .then(game => {
                session.run("MATCH (g:Game) WHERE g._id ={idParam} DETACH DELETE g", {
                    idParam: id
                })
            })
            .then(result => {
                console.log('Game has been removed');
                res.status(200).json(result);
                session.close();
            })
            .catch((error) => res.status(404).send({error: error.message}));
    },

    edit(req, res) {
        res.contentType('application/json');
        const id = req.params.id;
        const body = req.body;

        Game.findByIdAndUpdate({'_id' : id}, body)
            .then(() => Game.findById({'_id': id}))
            .then(() => {
                session
                    .run(
                        "MATCH (g:Game) WHERE g._id = {idParam} " +
                        "SET g.title = {titleParam}," +
                        "g.developer = {developerParam}," +
                        "g.description = {descriptionParam}," +
                        "g.engine = {engineParam}" +
                        "RETURN g", {
                            idParam: id.toString(),
                            titleParam: body.title,
                            developerParam: body.developer,
                            descriptionParam: body.description,
                            engineParam: body.engine
                        })
                    .then((result) => {
                        var game;
                        result.records.forEach(function (record) {
                            game = {
                                _id: record._fields[0].properties._id,
                                title: record._fields[0].properties.title,
                                developer: record._fields[0].properties.developer,
                                description: record._fields[0].properties.description,
                                engine: record._fields[0].properties.engine
                            }
                        });
                        console.log('Game has been updated');
                        res.status(200).send(game);
                        session.close();
                    })
            })
            .catch((error) => res.status(400).send({error: error.message}));
    }
};