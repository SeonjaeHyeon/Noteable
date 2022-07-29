const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares/auth");

const router = express.Router();

// /auth/signUp 주소로 접속시 signup.html 렌더링
router.get("/signUp", isNotLoggedIn, (req, res, next) => {
  return res.render("signup", { title: "회원가입 페이지" });
});

// /auth/signIn 주소로 접속시 signin.html 렌더링
router.get("/signIn", isNotLoggedIn, (req, res, next) => {
  return res.render("signin", { title: "로그인 페이지" });
});

// /auth/signOut 주소로 접속시 로그아웃하고 세션 삭제
// 메인 페이지로 이동함.
router.get("/signOut", isLoggedIn, (req, res, next) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect("/");
  });
});

module.exports = router;
