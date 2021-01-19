const knex = require("../../db/knex");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

let authController = {};

// id가 존재하는지 & pwd가 올바른지 확인
const checkIdExist = async (id, pwd) => {
  return knex.select()
    .from("user")
    .where({ userId: id })
    .then(user => {
      // 존재하는 id인지 확인
      if(Object.keys(user).length==0) {
        console.log("this id doesn't exist"); 
        return 0;
      } 
      // pwd 맞는지 확인
      if(user[0].password !== pwd) {
        console.log("password is wrong"); 
        return 0;
      }
      return 1;
    })
}

// userId 정보를 담고있는 jwt token 반환
const generateToken = async (id) => {
  const MY_SECRET_KEY = process.env.SECRET_KEY;
  const token = jwt.sign({usr: id}, MY_SECRET_KEY, {expiresIn: '1d'});
  return token;
}

// 이미 있는 id이면 0, 새로운 id면 1 반환
const newIdChecker = async (id) => {
  return knex
    .select()
    .from("user")
    .where({ userId: id })
    .then(result => {
      if(Object.keys(result).length===0)
        return 1;
      return 0;
    })
}

// 사용자 정보 디비에 저장
const saveUserInfo = async (id, nick, pwd) => {
  return knex("user")
    .insert({ userId: id, nickName: nick, password: pwd })
}

// 로그인하면서 발급된 토큰 저장 => 여러 토큰 저장하도록 수정 필요 update
const saveTokenInfo = async (id, token) => {
  return knex("user")
    .update({ tokens: token })
    .where({ userId: id })
};

authController.register = async (req, res) => {
  // id는 3글자 이상, pwd는 5글자 이상 되도록 확인
  const schema = Joi.object().keys({
    userId: Joi.string().alphanum().min(3).required(),
    nickName: Joi.string().required(),
    password: Joi.string().min(5).required(),
  });

  if(schema.validate(req.body.params).error)
    return res.status(401).end("아이디는 3자 이상, 비밀번호는 5자이상 입력해주십시오.");
  
  const { userId, nickName, password } = req.body.params;

  // 존재하는 id인지 확인
  const isNewId = await newIdChecker(userId);
  if(!isNewId) return res.status(401).end("이미 존재하는 아이디입니다.");
  
  // db에 저장
  await saveUserInfo(userId, nickName, password);

  return res.end("회원가입 되었습니다.");
};

authController.login = async (req, res) => {
  const { userId, password } = req.body.params;
  
  // id, pwd 모두 입력했는지 확인
  if (!userId) { 
    console.log("please enter your ID"); 
    return res.status(401).end("아이디를 입력해주세요.");
  }
  if (!password) {
    console.log("please enter your password");
    return res.status(401).end("비밀번호를 입력해주세요.");
  }

  // id, pwd 제대로 입력했는지 확인
  const checkExistence = await checkIdExist(userId, password);
  if (!checkExistence)
    return res.status(401).end("가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.");
  
  // jwt token 생성해서 쿠키로 전송
  const token = await generateToken(userId);
  console.log(token);
  res.cookie("access-token", token, {
    HttpOnly: true,
    MaxAge: 60*60*24,
  });
  // token 저장 (한 개만 가능)
  await saveTokenInfo(userId, token);
  res.end("로그인 되었습니다.");
};

module.exports = authController;