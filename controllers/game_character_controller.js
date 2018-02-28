const Character = require('../models/character.model');
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "Blackboy.1"));
var session = driver.session();


module.exports = {
    create(req, res) {
        res.contentType('application/json');
        const body = req.body;
        const propbody = {
            name: body.name,
            gender: body.gender,
            age: body.age
        };

        Character.create(propbody)
            .then(char => {
                session.run(
                    "MERGE (c:Character {" +
                    "_id: {_id}, " +
                    "name: {nameParam}, " +
                    "gender: {genderParam}, " +
                    "age: {ageParam}}) " +
                    "RETURN c",
                    {
                        nameParam: char.name,
                        _id: char._id.toString(),
                        genderParam: char.gender,
                        ageParam: char.age
                    })
                    .then((result) => {
                        var character;
                        result.records.forEach(function (record) {
                            character = {
                                name: record._fields[0].properties.name,
                                gender: record._fields[0].properties.gender,
                                age: record._fields[0].properties.age
                            };
                        });
                        console.log('A new character has been created');
                        res.status(201).send(character);
                        session.close();
                    })
                    .catch((error) => res.status(400).send({error: error.message}));
            })
    },

    getAll(req, res) {
        res.contentType('application/json');
        Character.find({})
            .then(result => {
                console.log('Showing a list of all characters');
                res.status(200).json(result);
            })
            .catch((error) => res.status(400).json(error));
    },

    getOne(req, res) {
        res.contentType('application/json');
        const id = req.params.id;

        session.run("MATCH (c:Character) WHERE c._id = {idParam} RETURN c", {idParam : id})
            .then((result) => {
                var character;
                result.records.forEach(function (record) {
                    character = {
                        _id: record._fields[0].properties._id,
                        name: record._fields[0].properties.name,
                        gender: record._fields[0].properties.gender,
                        age: record._fields[0].properties.age
                    }
                });
                console.log('Showing info of a single character');
                res.status(200).send(character);
                session.close();
            })
            .catch((error) => res.status(400).send({error: error.message}));
    },

    delete(req, res){
        res.contentType('application/json');
        const id = req.params.id;

        Character.findByIdAndRemove({'_id' : id})
            .then(character => {
                session.run("MATCH (c:Character) WHERE c._id ={idParam} DETACH DELETE c", {
                    idParam: id
                })
            })
            .then(result => {
                console.log('Character has been removed');
                res.status(200).json(result);
                session.close();
            })
            .catch((error) => res.status(404).send({error: error.message}));
    },

    edit(req, res) {
        res.contentType('application/json');
        const id = req.params.id;
        const body = req.body;

        Character.findByIdAndUpdate({'_id' : id}, body)
            .then(() => Character.findById({'_id': id}))
            .then(() => {
                session
                    .run(
                        "MATCH (c:Character) WHERE c._id = {idParam} " +
                        "SET c.name = {nameParam}," +
                        "c.gender = {genderParam}," +
                        "c.age = {ageParam}" +
                        "RETURN c", {
                            idParam: id.toString(),
                            nameParam: body.name,
                            genderParam: body.gender,
                            ageParam: body.age
                        })
                    .then((result) => {
                        var character;
                        result.records.forEach(function (record) {
                            character = {
                                _id: record._fields[0].properties._id,
                                name: record._fields[0].properties.name,
                                gender: record._fields[0].properties.gender,
                                age: record._fields[0].properties.age
                            }
                        });
                        console.log('Character has been updated');
                        res.status(200).send(character);
                        session.close();
                    })
            })
            .catch((error) => res.status(400).send({error: error.message}));
    }
};