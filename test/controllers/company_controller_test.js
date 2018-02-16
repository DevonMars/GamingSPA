const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "Blackboy.1"));
var session = driver.session();
const Company = mongoose.model('gaming_company');

describe('Company controller', () => {

    it('Post to /company creates a new company', (done) => {
        Company.count().then(count => {
            request(app)
                .post('api/v1/companies')
                .send({
                    _id: '',
                    name: 'Electronic Arts',
                    description: 'blalsadadlasda',
                    founder: 'Devon Marsham',
                    country: 'America',
                    total_employees: 10000
                })
                .end(() => {
                    Company.count().then(newCount => {
                        console.log('count: ' + newCount);
                        assert(count + 1 === newCount);
                        session
                            .run(
                                "MATCH(c:Company) RETURN c"
                            )
                            .then((result) => {
                                assert(result.records.length === 1);
                                done();
                            })
                    })
                })
        })
    })
});
