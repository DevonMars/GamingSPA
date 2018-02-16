var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j','Blackboy.1'));
var session = driver.session();

module.exports = {
    driver,
    session
};