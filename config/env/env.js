var env = {
    webPort: process.env.PORT || 3000,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'gaming-api-server',
    neo4jHost: process.env.NEO4J_DB_HOST || 'localhost',
    neo4jPort: process.env.NEO4J_DB_PORT || '',
    neo4jUser: process.env.NEO4J_DB_USER || 'neo4j',
    neo4jPassword: process.env.NEO4J_DB_PASSWORD || 'Blackboy.1',
}

var dburl = process.env.NODE_ENV === 'production' ?
    'mongodb://' + env.dbUser + ':' + env.dbPassword + '@' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase :
    'mongodb://localhost/' + env.dbDatabase;

var neo4jhost = process.env.NODE_ENV === 'production' ?
    'bolt://' + env.neo4jHost + ':' + env.neo4jPort : 'bolt://' + env.neo4jHost;

module.exports = {
    env: env,
    dburl: dburl,
    neo4jhost: neo4jhost
};