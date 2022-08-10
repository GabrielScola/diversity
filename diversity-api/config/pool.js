const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'diversity',
    password: 'postgres',
    post: 5432,
    max: 20,
    connectionTimeoutMillis: 0,
    idleTimeoutMilles: 0
})

module.exports = pool;