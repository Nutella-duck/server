const jwt = require("jsonwebtoken");
const tokenMethod = require("./getToken.js");

const jwtMiddleware = (req, res, next) => {
  const token = tokenMethod(req.headers.cookie);

  if (token === "undefined" || token === null) {
    console.log("토큰 없는경우");
    return res.status(400).end("로그인 중이 아닙니다.");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded : " + decoded.username);
    const userId = decoded.userId;
    console.log(userId);
    if (!userId) {
      res.status(400).end("로그인 중이 아닙니다.");
    }

    return next();
  } catch (e) {
    console.log(e);
    return next();
  }
};

module.exports = jwtMiddleware;
