const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports = new LocalStrategy(
  {
    usernameField: "authId",
    passwordField: "authPw",
  },
  async (authId, authPw, done) => {
    console.info("___new LocalStrategy()");
    try {
      const exUser = await User.findOne({ where: { authId } });
      if (exUser) {
        const result = await bcrypt.compare(authPw, exUser.authPw);
        if (result) {
          done(null, exUser);
        } else {
          done(null, false, { message: "비밀번호가 일치하지 않습니다." });
        }
      } else {
        done(null, false, { message: "가입되지 않은 회원입니다." });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }
);
