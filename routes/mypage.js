const express = require("express");
const { isLoggedIn } = require("../middlewares/auth");
const User = require("../models/User");

const router = express.Router();

// /mypage로 접속 시 현재 로그인된 사용자 정보를 확인하고 mypage.html 렌더링
router.get("/", isLoggedIn, async (req, res, next) => {
  const id = req.session.passport.user;

  try {
    // User 테이블에서 해당 사용자의 정보를 가져온다.
    const user = await User.findOne({
      where: { id },
      attributes: ["authId", "name", "email"],
    });
    const { name, authId, email } = user;

    return res.render("mypage", {
      title: "내 정보 페이지",
      name,
      authId,
      email,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

module.exports = router;
