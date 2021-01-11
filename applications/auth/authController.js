const knex = require("../../db/knex");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { param } = require("../../routes/runRoute");
const jwt = require("jsonwebtoken");
const NodeRsa = require("node-rsa"); // 대기
const key = new NodeRsa({ b: 512 }); // 대기
const publicKey = key.exportKey("pkcs1-public-pem"); //대기
const privateKey = key.exportKey("pkcs8-private-pem"); //대기

const crypto = require("crypto");

let token = "";
let authController = {};

const getUserId = async (userName) => {
  return knex
    .select("userId")
    .from("user")
    .where({ userName: userName })
    .then((result) => {
      return result;
    });
};

const setPassword = async (password) => {
  //sha256 하고 난후 bcrypt 를 해주는게 좋음.
  //const passwordCrypto = crypto.createHash('sha256').update(password).digest('base64');
  const passwordHash = await bcrypt.hash(password, 10);
  console.log(passwordHash);

  return passwordHash;
};

const checkpassword = async (password, dbPassword) => {
  const result = await bcrypt.compare(password, dbPassword);
  return result;
};

const generateToken = async (username) => {
  let userId = await getUserId(username); // userId 획득.
  userId = userId[0].userId;

  token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const userExistsChecker = async (userName) => {
  return knex
    .select("userName")
    .from("user")
    .where({ userName: userName })
    .then((result) => {
      return result;
    });
};

const getUserPassword = async (userName) => {
  return knex
    .select("password")
    .from("user")
    .where({ userName: userName })
    .then((result) => {
      return result;
    });
};

const userSaveDatabase = (username, password) => {
  return knex
    .insert({ userName: username, password: password })
    .into("user")
    .then((result) => {
      return "created";
    });
};

authController.register = async (req, res) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    res.status(401).end("이메일 규정이 올바르지 않습니다.");
  }

  const { username, password } = req.body;

  try {
    const exists = await userExistsChecker(username);

    if (exists.length) {
      return res.status(401).end("유저가 존재합니다.");
    }

    const hashPassword = await setPassword(password);

    await userSaveDatabase(username, hashPassword);

    generateToken(username);
    res.cookie("access_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    return res.end("회원가입 완료");
  } catch (e) {
    res.status(401).end(e);
  }

  res.end("success");
};

authController.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401).end("잘못된 아이디 및 비밀번호입니다.");
  }

  try {
    const user = await userExistsChecker(username);

    if (!user.length) {
      res.status(401).end("없는 유저입니다.");
    }
    const dbPassword = await getUserPassword(username);

    const valid = await checkpassword(password, dbPassword[0].password);

    if (!valid) {
      return res.status(401).end("비밀번호가 올바르지 않습니다.");
    }

    generateToken(username);

    res.cookie("access_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    res.end("로그인 완료");
  } catch (e) {
    res.status(401).end(e);
  }
};

authController.logout = async (req, res) => {
  res.cookie("access_token");
  res.end("로그아웃 완료");
};

module.exports = authController;
