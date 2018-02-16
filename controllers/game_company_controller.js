const Company = require('../models/company.model');
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "Blackboy.1"));
var session = driver.session();

module.exports = {
    create(req, res) {
        res.contentType('application/json');
        const body = req.body;
        const companypropbody = {
            name: body.name,
            description: body.description,
            founder: body.founder,
            country: body.country,
            total_employees: body.total_employees
        };

        Company.create(companypropbody)
            .then(company => {
                session.run(
                    "CREATE (c:Company {_id: {_id}, name: {nameParam},description: {descriptionParam}, founder: {founderParam}, country: {countryParam}, total_employees: {employeesParam}}) RETURN c;",
                    {
                        nameParam: company.name,
                        _id: company._id.toString(),
                        descriptionParam: company.description,
                        founderParam: company.founder,
                        countryParam: company.country,
                        employeesParam: company.total_employees})
                    .then((result) => {
                        var company;
                        result.records.forEach(function (record) {
                            company = {
                                _id: company._id,
                                name: record._fields[0].properties.name,
                                description: record._fields[0].properties.description,
                                founder: record._fields[0].properties.founder,
                                country: record._fields[0].properties.country,
                                total_employees: record._fields[0].properties.total_employees
                            };
                        });
                        console.log('A new company has been created');
                        res.status(201).send(company);
                        session.close();
                    })
                    .catch((error) => res.status(400).send({error: error.message}));
            }).catch((error) => res.status(400).send({error: error.message}));

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

        session.run("MATCH (c:Company) WHERE c._id = {idParam} RETURN c", {idParam : id})
            .then((result) => {
                var company;
                result.records.forEach(function (record) {
                    company = {
                        _id: record._fields[0].properties._id,
                        name: record._fields[0].properties.name,
                        description: record._fields[0].properties.description,
                        founder: record._fields[0].properties.founder,
                        country: record._fields[0].properties.country,
                        total_employees: record._fields[0].properties.total_employees
                    }
                });
                console.log('Showing info of a single company');
                res.status(200).send(company);
                session.close();
            })
            .catch((error) => res.status(400).send({error: error.message}));
    },

    update(req, res) {
        res.contentType('application/json');
        const id = req.params.id;
        const body = req.body;

        Company.findByIdAndUpdate({'_id' : id}, body)
            .then(() => Company.findById({'_id': id}))
            .then(() => {
                session
                    .run("MATCH (c:Company) WHERE c._id = {idParam} SET c.name={nameParam}, c.description={descriptionParam}, c.founder={founderParam}, c.country={countryParam}, c.total_employees={employeesParam} RETURN c", {
                    idParam: id,
                    nameParam: body.name,
                    descriptionParam: body.description,
                    founderParam: body.founder,
                    countryParam: body.country,
                    employeesParam: body.total_employees
                })
                    .then((result) => {
                        var company;
                        result.records.forEach(function (record) {
                            company = {
                                _id: record._fields[0].properties._id,
                                name: record._fields[0].properties.name,
                                description: record._fields[0].properties.description,
                                founder: record._fields[0].properties.founder,
                                country: record._fields[0].properties.country,
                                total_employees: record._fields[0].properties.total_employees
                            }
                        });
                        console.log('Company has been updated');
                        res.status(200).send(company);
                        session.close();
                    })
            })
            .catch((error) => res.status(400).send({error: error.message}));
    },

    delete(req, res){
        res.contentType('application/json');
        const id = req.params.id;

        Company.findByIdAndRemove({'_id' : id})
            .then(company => {
                session.run("MATCH (c:Company) WHERE c._id={idParam} DETACH DELETE c", {
                    idParam: id
                })
            })
            .then(result => {
                console.log('Company has been removed');
                res.status(200).json(result);
                sessions.close();
            })
            .catch((error) => res.status(404).send({error: error.message}));
    }
};