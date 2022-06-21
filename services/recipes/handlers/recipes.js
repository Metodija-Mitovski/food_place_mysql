const recipe = require("../../../pkg/recipes");
const validate = require("../../../pkg/recipes/validate");
const sanitaze = require("../../../pkg/sanitazers");
const queryHelper = require("../../../pkg/sanitazers/queryHelper")


const create = async (req, res) => {
    req.body.user_id = req.user.uid;
    sanitaze.clear(req.body);
    try {
        await validate(req.body, "CREATE");
    } catch (error) {
        return res.status(400).send(error);
    }

    try {
        const r = await recipe.create(req.body);
        if (r.insertId) {
            await recipe.addImage(r.insertId, req.body.image);
            await recipe.addCategory(r.insertId, req.body.category);
        }
        res.status(201).send('ok');
    } catch (error) {
        console.log(error)
        if (error.errno) {
            return res.status(400).send("Bad request");
        }
        res.status(500).send(error);
    }
};

const update = async (req, res) => {
    sanitaze.clear(req.body);

    try {
        await validate(req.body, "UPDATE");
    } catch (error) {
        return res.status(400).send(error);
    }

    try {
        const r = await recipe.partialUpdate(req.user.uid, req.params.id, req.body);
        if (!r) {
            return res.status(400).send("Bad request");
        };

        if (req.body.category) {
            await recipe.updateCategories(req.body.category, req.params.id);
        };

        if (req.body.image) {
            await recipe.updateImages(req.body.image, req.params.id);
        };

        res.status(204).send();
    } catch (error) {
        console.log(error);
        if (error.errno) {
            return res.status(400).send("Bad request");
        };
        res.status(500).send(error);
    }
};

const removeOne = async (req, res) => {
    try {
        const r = await recipe.remove(req.params.id, req.user.uid);
        if (!r) {
            return res.status(404).send("Not found");
        }
        await recipe.removeCategories(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }
};

const getLatest = async (req, res) => {
    try {
        const recipes = await recipe.getNew();
        if (recipes.length === 0) {
            return res.status(200).send(recipes);
        };
        const recipe_ids = queryHelper.getIds(recipes);
        const images = await recipe.getImagesById(recipe_ids);
        const categories = await recipe.getCategoriesById(recipe_ids);
        const data = {
            recipes,
            images,
            categories,
        };

        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getTopRated = async (req, res) => {
    try {
        const recipes = await recipe.getByLikes();
        if (recipes.length === 0) {
            return res.status(200).send(recipes);
        };

        const recipe_ids = queryHelper.getIds(recipes);
        const categories = await recipe.getCategoriesById(recipe_ids);
        const images = await recipe.getImagesById(recipe_ids);

        const data = {
            recipes,
            categories,
            images
        };

        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getCategory = async (req, res) => {
    try {
        const categories = await recipe.getByCategory(req.params.category);
        if (categories.length === 0) {
            return res.status(200).send(categories)
        }
        const recipe_ids = queryHelper.getIds(categories);
        const recipes = await recipe.getManyById(recipe_ids);
        const images = await recipe.getImagesById(recipe_ids);

        const data = {
            recipes,
            categories,
            images
        };
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getMine = async (req, res) => {
    try {
        const recipes = await recipe.getAllByUser(req.user.uid);
        if (recipes.length === 0) {
            return res.status(200).send(recipes);
        }
        const recipe_ids = queryHelper.getIds(recipes);
        const categories = await recipe.getCategoriesById(recipe_ids);
        const images = await recipe.getImagesById(recipe_ids);

        const data = {
            recipes,
            categories,
            images
        };
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

const updateLike = async (req, res) => {
    try {
        const r = await recipe.getOne(req.params.id);
        if (!r) {
            return res.status(404).send('Not Found')
        }
        const l = await recipe.getOneByLike(req.user.uid, req.params.id);

        if (!l) {
            await recipe.updateLikeInc(req.user.uid, req.params.id);
        };

        if (l) {
            await recipe.updateLikeDec(req.user.uid, req.params.id);
        }

        res.status(204).send()

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
};


module.exports = {
    create,
    update,
    removeOne,
    getLatest,
    getTopRated,
    getCategory,
    getMine,
    updateLike
};
