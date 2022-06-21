const clear = (data) => {
    for (let key in data) {
        if (typeof data[key] === "string") {
            data[key] = data[key].trim();
        }
      
        if (data[key] === "") {
            delete data[key];
        }
    }
};

module.exports = {
    clear,
};
