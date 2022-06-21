const getConnection = require('../db')

const create = async (data) => {
    const pool = await getConnection();
    const query = `INSERT INTO recipes
                    (title,
                    preparation_time,
                    number_of_people,
                    short_description,
                    long_description,
                    user_id
                    )
                    VALUES(?,?,?,?,?,?);
                    `;
    const [rows] = await pool.query(query, [
        data.title,
        data.preparation_time,
        data.number_of_people,
        data.short_description,
        data.long_description,
        data.user_id
    ]);
    return rows;
};

const partialUpdate = async (user_id, recipe_id, data) => {
    const pool = await getConnection();

    const query = `UPDATE recipes SET 
                    title = ?,
                    preparation_time = ?,
                    number_of_people = ?,
                    short_description = ?,
                    long_description = ?
                    WHERE id = ?
                    AND user_id = ?;
                    `;

    const [r] = await pool.query(query, [
        data.title,
        data.preparation_time,
        data.number_of_people,
        data.short_description,
        data.long_description,
        recipe_id,
        user_id
    ]);
    return r.affectedRows !== 0;
};

const addImage = async (recipe_id,image_url) => {
    const pool = await getConnection();
    const query = `INSERT INTO 
                    recipe_images
                    (recipe_id,image_url)
                    VALUES (?, ?);
                    `;

    const [rows] = await pool.query(query, [recipe_id,image_url]);
    return rows;
};

const addCategory = async (recipe_id,category) => {
    const pool = await getConnection();
    const query = `INSERT INTO 
                    recipe_categories
                    (recipe_id, category)
                    VALUES (?, ?);
                    `;

    const [r] = await pool.query(query, [recipe_id,category]);
    return r
};



const remove = async (recipe_id, user_id) => {
    const pool = await getConnection();
    const query = `UPDATE recipes
                    SET deleted = ?
                    WHERE id = ? AND user_id = ?;
                    `;

    const [r] = await pool.query(query, [1, recipe_id, user_id]);
    return r.affectedRows !== 0;
};

const updateCategories = async (category,recipe_id) => {
    const pool = await getConnection();

    const query = `UPDATE recipe_categories
                    SET category = ?
                    WHERE recipe_id = ?;
                    `;

    const [r] = await pool.query(query, [category, recipe_id]);
    return r;
};

const updateImages = async (image_url,recipe_id) => {
    const pool = await getConnection();

    const query = `UPDATE recipe_images
                    SET image_url = ?
                    WHERE recipe_id = ?;
                    `;

    const [r] = await pool.query(query, [image_url, recipe_id]);
    return r;
};



const removeCategories = async (recipe_id) => {
    const pool = await getConnection();

    const query = `UPDATE recipe_categories
                    SET recipe_deleted = ?
                    WHERE recipe_id = ?;
                    `;

    const [r] = await pool.query(query, [1, recipe_id]);
    return r;
};

const getNew = async () => {
    const pool = await getConnection();

    const query = `SELECT
                    id,
                    title,
                    preparation_time,
                    number_of_people,
                    short_description,
                    long_description,
                    likes_count
                    FROM recipes
                    WHERE recipes.deleted = ?
                    ORDER BY created_at DESC
                    LIMIT 3;
                    `;

    const [r] = await pool.query(query, [0]);
    return r;
};

const getImagesById = async (ids) => {
    const pool = await getConnection();
    const query = `SELECT 
                    recipe_id,image_url 
                    FROM recipe_images
                    WHERE recipe_id IN (?);
                    `;

    const [r] = await pool.query(query, [ids]);
    return r;
};

const getCategoriesById = async (ids) => {
    const pool = await getConnection();
    const query = `SELECT
                    recipe_id,category
                    FROM recipe_categories
                    WHERE recipe_id IN(?);
                    `;

    const [r] = await pool.query(query, [ids]);
    return r;
};

const getByCategory = async (category) => {
    const pool = await getConnection();

    const query = `SELECT
                   recipe_id,category
                    FROM recipe_categories
                    WHERE category = ?
                    AND recipe_deleted = ?
                    ORDER BY created_at DESC
                    LIMIT 9;`;

    const [r] = await pool.query(query, [category, 0]);
    return r;
};

const getManyById = async (ids) => {
    const pool = await getConnection();

    const query = `SELECT
                    id,
                    title,
                    preparation_time,
                    number_of_people,
                    short_description,
                    long_description,
                    likes_count
                    FROM recipes
                    WHERE id IN(?) 
                    AND recipes.deleted = ?;
                    `;

    const [r] = await pool.query(query, [ids, 0]);
    return r;
};

const getOne = async (recipe_id) => {
    const pool = await getConnection();

    const query = `SELECT
                    id,title
                    FROM recipes
                    WHERE id = ?
                    AND deleted = ?;
                    `;
    const [r] = await pool.query(query, [recipe_id, 0]);
    return r[0];
};


const getAllByUser = async (id) => {
    const pool = await getConnection();

    const query = `SELECT
                    id,
                    title,
                    preparation_time,
                    number_of_people,
                    short_description,
                    long_description,
                    likes_count,
                    DATE_FORMAT(created_at,"%Y-%m-%d")
                    AS created_at
                    FROM recipes
                    WHERE recipes.user_id = ? 
                    AND recipes.deleted = ?;
                    `;

    const [r] = await pool.query(query, [id, 0]);
    return r;
};

const getByLikes = async () => {
    const pool = await getConnection();

    const query = `SELECT
                    id,
                    title,
                    preparation_time,
                    number_of_people,
                    short_description,
                    long_description ,
                    likes_count
                    FROM recipes
                    WHERE deleted = ?
                    ORDER BY likes_count DESC,created_at DESC
                    LIMIT 9; 
                    `;

    const [r] = await pool.query(query, [0]);
    return r;
};

const getOneByLike = async (user_id, recipe_id) => {
    const pool = await getConnection();

    const query = `SELECT
                    user_id,recipe_id
                    FROM likes
                    WHERE user_id = ?
                    AND recipe_id = ?;
                    `;

    const [r] = await pool.query(query, [user_id, recipe_id]);
    return r[0];
};

const updateLikeInc = async (user_id, recipe_id) => {
    const pool = await getConnection();

    const query = `INSERT INTO likes(user_id,recipe_id)
                    VALUES(?,?);
                   
                    `;

    const [r] = await pool.query(query, [user_id, recipe_id]);
    return r;
};

const updateLikeDec = async (user_id, recipe_id) => {
    const pool = await getConnection();

    const query = `DELETE FROM likes
                    WHERE user_id = ?
                    AND recipe_id = ?;
                    `;

    const [r] = await pool.query(query, [user_id, recipe_id]);
    return r[0];
};



module.exports = {
    create,
    partialUpdate,
    addImage,
    addCategory,
    remove,
    removeCategories,
    updateCategories,
    updateImages,
    getNew,
    getOne,
    getImagesById,
    getCategoriesById,
    getByCategory,
    getManyById,
    getAllByUser,
    getByLikes,
    getOneByLike,
    updateLikeInc,
    updateLikeDec
};