const getToken = (cookie) => {
  let idx = cookie.indexOf("=");
  return cookie.substring(idx + 1, cookie.length);
};

module.exports = getToken;
