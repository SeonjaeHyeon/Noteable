// routes/api/user.js
// 사용자 정보를 처리하는 라우터

const express = require("express");
const bcrypt = require("bcrypt");
const { isLoggedIn } = require("../../middlewares/auth");
const User = require("../../models/User");

const router = express.Router();

router.post("/", isLoggedIn, async (req, res, next) => {
  // 특정 사용자의 정보를 수정하는 라우터
  const userId = req.session.passport.user;
  const { name, email, authPw } = req.body;
  const salt = 12;

  // data 객체에 이름, 이메일, 비밀번호 데이터 추가
  let data = { name };
  if (email) {
    data.email = email;
  }
  if (authPw) {
    // 비밀번호는 해시값으로 변경
    const hash = await bcrypt.hash(authPw, salt);
    data.authPw = hash;
  }

  try {
    // User 테이블에서 해당 사용자의 정보를 수정한다.
    await User.update(data, {
      where: {
        id: userId,
      },
    });

    return res.status(200).end();
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

module.exports = router;
