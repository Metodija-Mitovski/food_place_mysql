const getConnection = require('../db');

const create = async (data) => {
    const pool = await getConnection();
    const user_query = `INSERT INTO users 
                        (email,
                        first_name,
                        last_name,
                        birthday,
                        password) 
                        VALUES (?,?,?,?,?);`;

    const [u] = await pool.query(user_query, [data.email, data.first_name, data.last_name, data.birthday, data.password]);
    return u;
};

const createVerifyData = async (user_id,secret_id) => {
    const pool = await getConnection();
    const query = `INSERT INTO verify_account
                    (account_id,
                    secret_id,
                    verified)
                    VALUES(?,?,?);`;

    const [r] =   await pool.query(query, [user_id,secret_id, 0]);
};

const getByEmail = async (email) => {
    const pool = await getConnection();
    const query = `SELECT users.id AS user_id,
                    email,
                    password,
                    verified 
                    FROM users
                    INNER JOIN verify_account 
                        ON users.id = verify_account.account_id
                    WHERE email = ?;
                    `;

    const [rows] = await pool.query(query, [email]);
    return rows[0];
};

const getBySecretId = async (secretId) => {
    const pool = await getConnection();
    const query = `SELECT 
                    users.first_name,
                    users.last_name,
                    users.email,
                    verify_account.created_at
                    FROM users
                    INNER JOIN verify_account
                        ON users.id = verify_account.account_id
                    WHERE verify_account.secret_id = ?;
                    `;

    const [rows] = await pool.query(query, [secretId]);
    return rows[0];
};

const updateVerifyData = async (id, data) => {
    const pool = await getConnection();
    const query = `UPDATE verify_account
                    SET secret_id = ?
                    WHERE secret_id = ?;
                    `;

    const [rows] = await pool.query(query, [data.secret_id, id]);
    return rows;
};

const updateBySecretId = async (secretId) => {
    const pool = await getConnection();
    const query = `UPDATE verify_account
                    SET verified = ?
                    WHERE secret_id = ?;
                    `;

    return await pool.query(query, [1, secretId]);
};

const getById = async (user_id) => {
    const pool = await getConnection();
    const query = `SELECT 
                    first_name,
                    last_name,
                    email,
                    DATE_FORMAT(birthday,"%Y-%m-%d")
                    AS birthday,
                    avatar_id 
                    FROM users
                    WHERE id = ?;
                    `;
    const [rows] = await pool.query(query, [user_id]);
    return rows[0];
};

const getAvatar = async (user_id) => {
    const pool = await getConnection();
    const query = `SELECT image_url
                    FROM user_images
                    WHERE user_id = ?;
                    `;
    
    const [r] = await pool.query(query,[user_id]);
    return r;
};

const update = async (id, data) => {
    const pool = await getConnection();
    const query = `UPDATE users SET ? WHERE id = ?;`;

    const [rows] = await pool.query(query, [data, id]);
    return rows;
};

const updateAvatar = async (user_id,image_url) => {
    const pool = await getConnection();

    const query = `INSERT INTO user_images
                    (user_id,image_url)
                    VALUES(?,?);
                    `;
    const [r] = await pool.query(query,[user_id,image_url]);
    return r;
};


module.exports = {
    create,
    createVerifyData,
    getByEmail,
    getBySecretId,
    getAvatar,
    updateVerifyData,
    updateBySecretId,
    getById,
    update,
    updateAvatar
};