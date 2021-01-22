const knex = require("../../db/knex");
const jwt = require("jsonwebtoken");

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

// 해당 user의 nickname 반환
const getUserNick = async (id) => {
  return knex("user")
    .select("nickname")
    .where({ userId: id })
    .then(user => {
      return user[0].nickname;
    })
}

// userId 정보를 담고있는 jwt token 반환
const generateToken = async (id) => {
  const MY_SECRET_KEY = process.env.SECRET_KEY;
  const token = jwt.sign({usr: id}, MY_SECRET_KEY, {expiresIn: '1d'});
  return token;
}

// 로그인하면서 발급된 토큰 저장 => 여러 토큰 저장하도록 수정 필요 update
const saveTokenInfo = async (id, token) => {
  return knex("user")
    .update({ tokens: token })
    .where({ userId: id })
};

// 로그아웃 시 토큰 삭제 => token 있는지 보고 있으면 해당 토큰만 삭제하도록 수정 필요
const deleteToken = async (id, token) => {
  return knex("user")
    .update({ tokens: null })
    .where({ userId: id })
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
  
  // user 닉네임 가져오고 jwt token 생성해서 쿠키로 전송 
  const nickname = await getUserNick(userId);
  const token = await generateToken(userId);
  console.log(token);
  
  // token 저장 (한 개만 가능)
  await saveTokenInfo(userId, token);

  var data = new Object();
  data.token = token;
  data.nickname = nickname;

  res.end(JSON.stringify(data));
};

authController.logout = async (req, res) => {
  const { userId } = req.body.params;
  const clientToken = req.headers['access-token'];
  res.writeHead(302, {
    'Set-Cookie': [
      `access-token=; HttpOnly; Max-Age=0`
    ]
  })
  await deleteToken(userId, clientToken);
  res.end("로그아웃 되었습니다.")
};

module.exports = authController;