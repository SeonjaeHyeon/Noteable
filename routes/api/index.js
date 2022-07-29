// routes/api/index.js
// api 라우터들을 관리하는 index 라우터

const express = require("express");
const authRouter = require("./auth");
const memoRouter = require("./memo");
const todoRouter = require("./todo");
const userRouter = require("./user");
const friendRouter = require("./friend");

const router = express.Router();

// 각각의 주소에 대해 해당 라우터로 이동시켜준다.
router.use("/auth", authRouter);
router.use("/memo", memoRouter);
router.use("/todo", todoRouter);
router.use("/user", userRouter);
router.use("/friend", friendRouter);

module.exports = router;
