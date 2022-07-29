// routes/api/friend.js
// 친구 관련 요청을 처리하는 라우터

const express = require("express");
const { isLoggedIn } = require("../../middlewares/auth");
const User = require("../../models/User");
const Follow = require("../../models/Follow");
const { sequelize } = require("../../models");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const router = express.Router();

router.get("/list", isLoggedIn, async (req, res, next) => {
  // 친구 목록을 불러오는 라우터
  const userId = req.session.passport.user;

  try {
    // Party 테이블을 self-join하여 두 사용자가 서로 follow를 하고 있는지 확인한다.
    // 서로 follow하고 있는 사용자들에 대한 authId, userId, name을 불러온다.
    // 복잡한 쿼리를 요구하기 때문에 SQL Query를 직접 작성하였음.
    const query = `SELECT authId, userId, name FROM (
                    SELECT DISTINCT t1.userId
                      FROM follow t1 JOIN follow t2
                      ON t1.userId = t2.followingId
                        AND t1.followingId = t2.userId
                        AND t1.followingId = :userId
                    ) AS t
                    JOIN user
                    ON t.userId = user.id;`;
    const records = await sequelize.query(query, {
      replacements: { userId },
      type: Sequelize.QueryTypes.SELECT,
      raw: true,
    });

    // JSON 데이터 전송
    return res.json(records);
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

router.post("/find", isLoggedIn, async (req, res, next) => {
  // 친구를 검색하는 라우터
  const userId = req.session.passport.user;
  const { keyword } = req.body;

  try {
    // User 테이블에서 이름에 keyword가 포함되는 다른 사용자들을 검색한다. (자기 자신 제외)
    const friends = await User.findAll({
      where: {
        name: {
          [Op.like]: `%${keyword}%`,
        },
        id: {
          [Op.not]: userId,
        },
      },
      attributes: ["authId", "id", "name"],
    });
    const data = friends.map((record) => record.toJSON());

    // data 객체를 JSON 형태로 전달
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

router.post("/request", isLoggedIn, async (req, res, next) => {
  // 친구 요청을 처리하는 라우터
  const userId = req.session.passport.user;
  const followingId = req.body.userId;

  try {
    // Follow 테이블에서 이미 친구 요청을 생성했는지 확인한다.
    const result = await Follow.findOne({
      where: {
        userId,
        followingId,
      },
    });
    // 이미 친구 요청을 보낸 경우 403 에러 반환
    if (result !== null) {
      return res.status(403).end();
    }

    // Follow 테이블에 친구 요청을 생성한다.
    await Follow.create({
      userId,
      followingId,
    });

    return res.status(201).end();
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

module.exports = router;
