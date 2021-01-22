const jwt = require("jsonwebtoken");
const knex = require("../../db/knex");
const MY_SECRET_KEY = process.env.SECRET_KEY;

// 만료되지 않은 토큰인지
const checkTokenExist = async (token) => {
    return knex("user")
        .select()
        .where({ tokens: token })
        .then(user => {
        // 존재하는 id인지 확인
        if(Object.keys(user).length==0) {
          console.log("this token doesn't exist"); 
          return 0;
        } 
        return 1;
      })
  }

const verifyToken = async (req, res, next) => {
    const clientToken = req.headers['access-token'];
    if(!clientToken){
        console.log("토큰을 보내세요.")
        return res.status(400).end("Please Login"); 
    }

    const tokenExistence = await checkTokenExist(clientToken);
    if(!tokenExistence)
        return res.status(400).end("Please Login");

    try {
        const decoded = jwt.verify(clientToken, MY_SECRET_KEY);

        if(decoded){
            res.locals.userId = decoded.usr;
            // usr가 없을 때도?
            next();
        } else {
            res.status(401).json({ error: "unauthorized"});
        }
    } catch (err) {
        res.status(401).json({ error: "token expired"});
    }
};

module.exports = verifyToken;