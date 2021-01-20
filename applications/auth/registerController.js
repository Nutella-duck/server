const knex = require("../../db/knex");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

let registerController = {};

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

registerController.register = async (req, res) => {
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

module.exports = registerController;