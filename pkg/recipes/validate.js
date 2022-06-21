const { Validator } = require("node-input-validator");

const CREATE = {
    title: "required|minLength:4|maxLength:25",
    preparation_time: "required|between:5,500",
    number_of_people: "required|between:1,10",
    short_description: "required|maxLength:240",
    long_description: "required|maxLength:1000",
    user_id: "required",
    category: "string|required",
    image: "string|required"
};

const UPDATE = {
    title: "minLength:4|maxLength:25",
    preparation_time: "between:5,500",
    number_of_people: "between:1,10",
    short_description: "maxLength:240",
    long_description: "maxLength:1000",
    category: "string",
    image: "string"
};

const validate = async (data, schema) => {
    let sch;
    switch (schema) {
        case "CREATE":
            sch = CREATE;
            break;

        case "UPDATE":
            sch = UPDATE;
            break;

        default:
            break;
    }

    let v = new Validator(data, sch);
    let match = await v.check();

    if (!match) {
        throw v.errors;
    }
};

module.exports = validate;
