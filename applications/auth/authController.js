const knex = require("../../db/knex");
const jwt = require("jsonwebtoken");

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

// 필요가 없는 것 같음
authController.logout = async (req, res) => {
  res.writeHead(302, {
    'Set-Cookie': [
      `access-token=; HttpOnly; Max-Age=0`
    ]
  })
  res.end("로그아웃 되었습니다.")
};

module.exports = authController;