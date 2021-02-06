const knex = require("../../db/knex");

let userController = {};

userController.read = function (req, res) {  
    knex("user")
        .select("userId", "nickname", "email", "company", "location", "introduction","imageUrl")
        .where("userId", res.locals.userId) 
        .then((userInfo) => {
            res.json(userInfo);
        });
}

module.exports = userController;