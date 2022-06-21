const config = require("../config");
const cfgDB = config.get("db");
const mysql = require('mysql2');


let connection = undefined;

const getConnection = async () => {
    if (connection) {
        return connection;
    };

    try {
        const pool = mysql.createPool({
            host: cfgDB.host,
            port: cfgDB.port,
            user: cfgDB.user,
            password: cfgDB.password,
            database: cfgDB.database,
            connectionLimit: cfgDB.connectionLimit
        });

        connection = pool.promise();
        return connection;

    } catch (error) {
        console.log(error)
    };

};

module.exports = getConnection



