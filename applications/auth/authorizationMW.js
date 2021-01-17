const jwt = require("jsonwebtoken");
const MY_SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    const clientToken = req.headers['access-token'];

    if(!clientToken){
        return res.status(400).end("Please Login");
    }

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