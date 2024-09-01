const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    //ssl: process.env.ssl
    //ssl: process.env.ssl === 'true' ? { rejectUnauthorized: false } : false
    ssl:{
        rejectUnauthorized: false
    }
});

module.exports = pool