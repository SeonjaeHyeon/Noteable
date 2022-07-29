// routes/api/auth.js
// 회원가입을 처리하는 라우터

const express = require("express");
const bcrypt = require("bcrypt");

const passport = require("../../passport/index.js");
const { isNotLoggedIn } = require("../../middlewares/auth");
const User = require("../../models/User");

const router = express.Router();

router.post("/signUp", isNotLoggedIn, async (req, res, next) => {
  // authId, authPw 등을 사용자로부터 전송받아서 사용자 회원가입을 진행하는 라우터
  const { authId, authPw, name, email } = req.body;
  const salt = 12;

  try {
    // User 테이블에서 해당 id를 사용하는 사용자가 이미 존재하는지 체크
    const exUser = await User.findOne({ where: { authId } });
    if (exUser) {
      return res.status(400).json({ error: "이미 존재하는 아이디 입니다." });
    }
    console.info("___User.create(): " + name);
    // 비밀번호를 해시값으로 변경
    const hash = await bcrypt.hash(authPw, salt);
    // User 테이블에 사용자 추가
    await User.create({
      authId,
      name,
      email,
      authPw: hash,
    });
    return res.status(201).end();
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/signIn", isNotLoggedIn, (req, res, next) => {
  // passport를 사용하여 로그인을 진행하는 라우터
  passport.authenticate("local", (authError, user, info) => {
    console.info("___passport.authenticate()");
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }

    console.info("___req.login()");
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      // 성공적으로 로그인이 되면 메인 페이지로 이동
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

module.exports = router;
