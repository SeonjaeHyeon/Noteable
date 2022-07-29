// routes/api/todo.js
// 할 일 데이터를 처리하는 라우터 (CRUD)

const express = require("express");
const { isLoggedIn } = require("../../middlewares/auth");
const Todo = require("../../models/Todo");
const Party = require("../../models/Party");
const { sequelize } = require("../../models");
const Sequelize = require("sequelize");

const router = express.Router();

router.get("/list", isLoggedIn, async (req, res, next) => {
  // 특정 사용자의 모든 할 일 데이터를 가져와 JSON 데이터로 전달하는 라우터
  const userId = req.session.passport.user;

  try {
    // Todo 테이블에서 해당 사용자의 모든 할일을 불러온다.
    const todos = await Todo.findAll({
      where: { userId },
    });
    // findAll 함수로 가져온 데이터는 객체 형태이므로, JSON 형식으로 바꿔준다.
    const data = todos.map((record) => record.toJSON());

    // 다른 사용자로부터 함께하는 친구로 추가된 할 일에 대해서도 가져온다.
    // 복잡한 쿼리가 요구되므로 직접 SQL Query문을 작성하였음
    const query = `SELECT *
                  FROM todo
                  JOIN (
                    SELECT todoId
                    FROM party
                    WHERE partyId = :userId
                  ) AS t
                  ON todo.id = t.todoId`;
    const records = await sequelize.query(query, {
      replacements: { userId },
      type: Sequelize.QueryTypes.SELECT,
      raw: true,
    });

    // data 객체와 records 객체를 합치고 JSON 형태로 전달
    return res.json(data.concat(records));
  } catch (err) {
    console.error(err);
  }
});

router.post("/", isLoggedIn, async (req, res, next) => {
  // 할 일 데이터를 사용자로부터 전송받아 서버에 새로 생성하는 라우터
  const { content, party } = req.body;
  const userId = req.session.passport.user;

  try {
    // Todo 테이블에 새로운 할 일 추가
    // createdAt은 현재 시간으로 설정
    const result = await Todo.create({
      content,
      userId,
      type: 0,
      createdAt: Date.now(),
    });

    // 함께하는 친구 사용자에 대한 정보를 저장하기 위해
    // Party 테이블에도 데이터 추가
    party.forEach(async (v) => {
      await Party.create({
        todoId: result.id,
        partyId: v,
      });
    });

    res.status(201).end();
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

// router.route() 사용
// 특정 할 일의 Update, Delete 처리 (id 값을 파라미터로 받음)
router
  .route("/:id")
  .put(isLoggedIn, async (req, res) => {
    // 특정 할 일을 수정하는 라우터
    const id = req.params.id;
    const { type } = req.body;

    try {
      // Todo 테이블에서 해당 id를 가진 할 일을 수정한다.
      await Todo.update({ type }, { where: { id } });
      return res.status(201).end();
    } catch (err) {
      console.error(err);
      return res.status(400).end();
    }
  })
  .delete(isLoggedIn, async (req, res) => {
    // 특정 할 일을 삭제하는 라우터
    const id = req.params.id;

    try {
      // Todo 테이블에서 해당 id를 가진 할 일을 삭제 한다.
      await Todo.destroy({ where: { id } });
      return res.status(200).end();
    } catch (err) {
      console.error(err);
      return res.status(400).end();
    }
  });

module.exports = router;
