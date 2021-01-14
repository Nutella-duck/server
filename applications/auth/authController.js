const knex = require("../../db/knex");
const jwt = require("jsonwebtoken");

let authController = {};

const getUsername = async (id, pwd) => {
  const username = knex.select("userName").from("user").where({ userId: id });
  if(!username) return undefined;
  const password = knex.select("password").from("user").where({ userId: id });
  if(password !== pwd) return undefined;
  
  return username;
}

const generateToken = async (name) => {
  const YOUR_SECRET_KEY = process.env.SECRET_KEY;

  const token = "token";
}

authController.login = function (req, res) {
  const { userid, password } = req.body.params;

  if (!userid) res.status(401).end("아이디를 입력해주세요.");
  if (!password) res.status(401).end("비밀번호를 입력해주세요.");

  const username = await getUsername(userid, password);

  if (username !== undefined)
    res.status(401).end("가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.");
  
  const token = generateToken(username);

  res.writeHead(200, {
    'Set-Cookie': [
        `access_token=${token}; HttpOnly; Max-Age=${60*60*24}`
    ]
  });
  res.end("login success");
};

module.exports = authController;