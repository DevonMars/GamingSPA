//
// server.js
//
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('./config/mongo.db');
const mongoose = require('mongoose');
var logger = require('morgan');
// var auth_routes_v1 = require('./api/authentication.routes.v1');
var config = require('./config/env/env');
// var expressJWT = require('express-jwt');
var game_company_v1_routes = require('./routes/v1/game_company.routes.v1');
var game_v1_routes = require('./routes/v1/game.routes.v1');
var game_character_v1_routes = require('./routes/v1/game_character.routes.v1');

var app = express();

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'test') {
    mongoose.createConnection('mongodb://localhost/GamingDB');
}

// bodyParser zorgt dat we de body uit een request kunnen gebruiken,
// hierin zit de inhoud van een POST request.
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json

// Beveilig alle URL routes, tenzij het om /login of /register gaat.
// app.use(expressJWT({
//     secret: config.secretkey
// }).unless({
//     path: [
//         { url: '/api/v1/login', methods: ['POST'] },
//         { url: '/api/v1/register', methods: ['POST'] }
//     ]
// }));

// configureer de app
app.set('port', (process.env.PORT || config.env.webPort));
app.set('env', (process.env.ENV || 'development'));

// wanneer je je settings wilt controleren
// console.dir(config);
// console.log(config.dburl);

// Installeer Morgan als logger
app.use(logger('dev'));

// CORS headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || 'http://localhost:4200');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    if (req.method === 'OPTIONS') {
        res.status(200);
        res.end();
    }
    else {
        // Pass to next layer of middleware
        next();
    }
});


/////////////////////////////////////////////////////////////////
//                  Installeer de routers
////////////////////////////////////////////////////////////////

game_company_v1_routes(app);
game_v1_routes(app);
game_character_v1_routes(app);
// app.use('/api/v1', auth_routes_v1);
// app.use('/api/v1', userroutes_v1);

// Errorhandler voor express-jwt errors
// Wordt uitgevoerd wanneer err != null; anders door naar next().
app.use(function (err, req, res, next) {
    // console.dir(err);
    var error = {
        message: err.message,
        code: err.code,
        name: err.name,
        status: err.status
    }
    res.status(401).send(error);
});

// Fallback - als geen enkele andere route slaagt wordt deze uitgevoerd.
app.use('*', function (req, res) {
    res.status(400);
    res.json({
        'error': 'Deze URL is niet beschikbaar.'
    });
});

// Installatie klaar; start de server.
app.listen(config.env.webPort, function () {
    console.log('De server luistert op port ' + app.get('port'));
    console.log('Zie bijvoorbeeld http://localhost:3000/api/v1/users');
});

// Voor testen met mocha/chai moeten we de app exporteren.
module.exports = app;