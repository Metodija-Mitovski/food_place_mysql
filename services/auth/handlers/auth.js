const user = require("../../../pkg/users");
const bcrypt = require("bcryptjs");
const validate = require("../../../pkg/users/validate");
const sanitaze = require("../../../pkg/sanitazers");
const security = require("../../../pkg/security");
const config = require("../../../pkg/config");
const { uuid } = require('uuidv4');
const mailer = require("../../../pkg/mailer")

const createAccount = async (req, res) => {
    sanitaze.clear(req.body);
    try {
        await validate(req.body, "CREATE");
    } catch (error) {
        return res.status(400).send(error);
    }

    try {
        if (req.body.password !== req.body.repeat_password) {
            return res
                .status(400)
                .send({ password: { message: "passwords do not match" } });
        };

        let data = req.body;
        const secret_id = uuid()
        data.password = bcrypt.hashSync(data.password);

        let u = await user.create(data);
        await user.createVerifyData(u.insertId, secret_id)

        await mailer.sendMail(['m.mitovski93@gmail.com'], "VERIFY", {
            first_name: data.first_name,
            last_name: data.last_name,
            url: `${config.get("mailer").default_url}/account/verify/${secret_id}`,
        });
        return res.status(201).send(u);
    } catch (error) {
        if (error.errno === 1062) {
            return res
                .status(400)
                .send({ email: { message: "email already in use" } });
        };
        console.log(error);
        res.status(500).send(error);
    }
};

const login = async (req, res) => {
    sanitaze.clear(req.body);

    try {
        await validate(req.body, "LOGIN");
    } catch (error) {
        return res.status(400).send(error);
    }

    try {
        const u = await user.getByEmail(req.body.email);

        if (!u) {
            return res
                .status(400)
                .send({ email: { message: "wrong email or password" } });
        }

        if (!bcrypt.compareSync(req.body.password, u.password)) {
            return res
                .status(400)
                .send({ password: { message: "wrong email or password" } });
        }


        if (!u.verified) {
            return res.status(400).send({ auth: { message: "Your account is not verified" } })
        };

        let token = security.getToken(u);
        res.cookie("jwt", token, {
            path: "/",
            maxAge: config.get("security").cookie_exp,
            httpOnly: true,
        });

        res.status(200).send("Success");
    } catch (error) {
        res.status(500).send(error);
    }
};

const partialUpdate = async (req, res) => {

    try {
        sanitaze.clear(req.body);
        if (req.body.email || req.body.deleted) {
            throw new Error('Bad request');
        }
        await validate(req.body, "UPDATE");
    } catch (error) {
        return res.status(400).send(error);
    }

    console.log(req.body)
    try {
        if (req.body.password) {
            if (req.body.password !== req.body.repeat_password) {
                return res
                    .status(400)
                    .send({ password: { message: "passwords do not match" } });
            }

            req.body.password = bcrypt.hashSync(req.body.password);
            delete req.body.repeat_password;
        }

        if (req.body.image) {
            const image = await user.updateAvatar(req.user.uid, req.body.image);

            delete req.body.image;
            req.body.avatar_id = image.insertId
        };

        const u = await user.update(req.user.uid, req.body);


        if (!u.affectedRows) {
            return res.status(400).send("Bad request");
        }
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

const verify = async (req, res) => {
    try {

        const u = await user.getBySecretId(req.params.id)

        if (!u) {
            return res.status(400).send("Bad request")
        }
        if (Date.now() > new Date(u.created_at).getTime() + 60 * 60 * 1000) {
            const secret_id = uuid()
            const data = {
                secret_id,
            };

            await user.updateVerifyData(req.params.id, data);
            await mailer.sendMail(['m.mitovski93@gmail.com'], "VERIFY", {
                first_name: u.first_name,
                last_name: u.last_name,
                url: `${config.get("mailer").default_url}/account/verify/${secret_id}`,
            });
            return res.status(200).send('ok')
        };

        await user.updateBySecretId(req.params.id)
        res.status(204).send('ok')
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

const getAuthUser = async (req, res) => {
    try {
        const u = await user.getById(req.user.uid);
        if (!u) {
            return res.status(403).send("Forbidden");
        }
        if (u.avatar_id) {
            const avatar = await user.getAvatar(req.user.uid);
            if (avatar.length > 0) {
                u.image = avatar[avatar.length - 1].image_url;
            };
            delete u.avatar_id;
        };

        res.status(200).send(u);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

const logOut = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            path: "/",
            maxAge: 1,
            httpOnly: true,
        });

        res.status(204).send("Success")
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

module.exports = {
    createAccount,
    login,
    partialUpdate,
    getAuthUser,
    verify,
    logOut
};
