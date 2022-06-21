const format = (id, categoriesData) => {
    return categoriesData.map(category => [id, category]);
};

getIds = (data) => {
    return data.map(d => {
        return Object.values(d)[0]
    });
};

module.exports = {
    format,
    getIds
};
