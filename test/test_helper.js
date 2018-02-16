const mongoose = require('mongoose');
const server = require('../server');
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "Blackboy.1"));
var session = driver.session();


    mongoose.connect('mongodb://localhost/GamingDB_test');
    mongoose.connection
        .once('open', () => {
            console.log('Connected to Mongo on GamingDB test');

        })
        .on("error", (error) => {
            console.warn('Warning', error);
        });


// beforeEach(done => {
//     const {company} = mongoose.connection.collections;
//     Promise.all([company.drop()])
//         .then(() => {
//             session.run("MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r");
//             done()})
//         .catch(() => done());
//
// });