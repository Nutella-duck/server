const knex = require("../../db/knex");
const Joi = require("joi");
const bcrypt = require('bcrypt');
const saltRounds = 10; 

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
const saveUserInfo = async (id, nick, pwd, email, comp, loc, intro) => {
  pwd = bcrypt.hashSync(pwd, saltRounds);
  return knex("user")
    .insert({ userId: id, nickname: nick, password: pwd, email: email, company: comp, location: loc, introduction: intro })
}

registerController.register = async (req, res) => {
    // id는 3글자 이상, pwd는 5글자 이상 되도록 확인
    console.log(res)
    const schema = Joi.object().keys({
      userId: Joi.string().alphanum().min(3).required(),
      nickname: Joi.string().required(),
      password: Joi.string().min(5).required(),
      email: Joi.string().allow(null),
      company: Joi.string().allow(null),
      location: Joi.string().allow(null),
      introduction: Joi.string().allow(null),
      imageUrl: Joi.string().allow(null)
    });
  
    if(schema.validate(req.body.params).error)
      return res.status(401).end("닉네임은 1자 이상, 아이디는 3자 이상, 비밀번호는 5자이상 입력해주십시오.");
    
    const { userId, nickname, password, email, company, location, introduction, imageUrl} = req.body.params;
  
    // 존재하는 id인지 확인
    const isNewId = await newIdChecker(userId);
    if(!isNewId) return res.status(401) .end("이미 존재하는 아이디입니다.");
    
    // db에 저장
    await saveUserInfo(userId, nickname, password, email, company, location, introduction );
  
    return res.end("회원가입 되었습니다.");
};

module.exports = registerController;