const express = require("express");
const { isLoggedIn } = require("../middlewares/auth");
const User = require("../models/User");

const router = express.Router();

// 메인 페이지 접속 시 로그인된 상태인 경우 index.html 렌더링
router.get("/", isLoggedIn, async (req, res, next) => {
  const id = req.session.passport.user;

  try {
    // User 테이블에서 해당 사용자의 이름을 불러온다.
    const user = await User.findOne({ where: { id }, attributes: ["name"] });
    return res.render("index", { title: "메모 페이지", name: user.name });
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

module.exports = router;
