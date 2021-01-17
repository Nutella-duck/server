const knex = require("../../db/knex");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

let authController = {};

// id가 존재하는지 & pwd가 올바른지 확인한 뒤, userId 반환 (두 조건 만족 x => undefined 반환)
const getUserId = async (id, pwd) => {
  return knex.select()
    .from("user")
    .where({ userName: id })
    .then(user => {
      // 존재하는 id인지 확인
      if(Object.keys(user).length==0) {
        console.log("this id doesn't exist"); 
        return undefined;
      } 
      // pwd 맞는지 확인
      if(user[0].password !== pwd) {
        console.log("password is wrong"); 
        return undefined;
      }
      return user[0].userId;
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
    .where({ userName: id })
    .then(result => {
      if(Object.keys(result).length===0)
        return 1;
      return 0;
    })
}

// 사용자 정보 디비에 저장
const saveUserInfo = async (id, pwd) => {
  return knex("user")
    .insert({ userName: id, password: pwd })
}

authController.register = async (req, res) => {
  // id는 3글자 이상, pwd는 5글자 이상 되도록 확인
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).required(),
    password: Joi.string().min(5).required(),
  });

  if(schema.validate(req.body.params).error)
    return res.status(401).end("아이디는 3자 이상, 비밀번호는 5자이상 입력해주십시오.");
  
  const { username, password } = req.body.params;

  // 존재하는 id인지 확인
  const isNewId = await newIdChecker(username);
  if(!isNewId) return res.status(401).end("이미 존재하는 아이디입니다.");
  
  // db에 저장
  await saveUserInfo(username, password);

  return res.end("회원가입 되었습니다.");
};

authController.login = async (req, res) => {
  const { username, password } = req.body.params;
  
  // id, pwd 모두 입력했는지 확인
  if (!username) { 
    console.log("please enter your ID"); 
    return res.status(401).end("아이디를 입력해주세요.");
  }
  if (!password) {
    console.log("please enter your password");
    return res.status(401).end("비밀번호를 입력해주세요.");
  }

  // id, pwd 제대로 입력했는지 확인
  const userId = await getUserId(username, password);
  if (userId === undefined)
    return res.status(401).end("가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.");
  
  // jwt token 생성해서 쿠키로 전송
  const token = generateToken(userId);
  console.log(token);
  res.writeHead(200, {
    'Set-Cookie': [
        `access-token=${token}; HttpOnly; Max-Age=${60*60*24}`
    ]
  });

  res.end("로그인 되었습니다.");
};

module.exports = authController;