// routes/api/memo.js
// 메모 데이터를 처리하는 라우터 (CRUD)
// 파일 업로드 또한 처리함

const express = require("express");
// memo 라우터에서만 작동하도록 여기서 import함, express.json() 등과 다름
const multer = require("multer");
const path = require("path");
const { isLoggedIn } = require("../../middlewares/auth");
const Memo = require("../../models/Memo");

const router = express.Router();

// multer 설정
// 파일 저장 위치를 uploads 폴더로 지정
// 파일 용량 제한은 5MB로 설정
// 서버에 저장되는 파일명은 파일명 + 타임스탬프로 지정
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 특정 사용자의 모든 메모 데이터를 가져와 JSON 데이터로 전달
router.get("/list", isLoggedIn, async (req, res) => {
  const userId = req.session.passport.user;

  try {
    // Memo 테이블에서 해당 사용자의 메모를 모두 불러온다.
    const memos = await Memo.findAll({
      where: { userId },
    });
    // findAll 함수로 가져온 데이터는 객체 형태이므로, JSON 형식으로 바꿔준다.
    const data = memos.map((record) => record.toJSON());

    // data 객체를 JSON 형태로 전달
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(400).send();
  }
});

// 메모 데이터를 사용자로부터 전송받아 서버에 새로 생성하는 라우터
// 미들웨어를 여러개 이어서 사용할 수 있음
// "image" => form 태그 파일 업로드 field명
router.post("/", isLoggedIn, upload.single("image"), async (req, res) => {
  const file = req.file;
  const { title, content } = req.body;
  const userId = req.session.passport.user;

  // 이미지 파일이 있는 경우 fileName 변수를 해당 이미지 파일명으로 지정
  let fileName = "";
  if (file !== undefined) {
    fileName = file.filename;
  }

  try {
    // Memo 테이블에 새로운 메모 추가
    // createdAt과 updatedAt 모두 현재 시간으로 설정
    await Memo.create({
      title,
      content,
      userId,
      img: fileName,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    res.status(201).end();
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

// router.route() 사용
// 특정 메모의 Read, Update, Delete 처리 (id 값을 파라미터로 받음)
router
  .route("/:id")
  .get(isLoggedIn, async (req, res) => {
    // 특정 메모를 조회하는 라우터
    const id = req.params.id;
    const reqUserId = req.session.passport.user;

    try {
      // Memo 테이블에서 해당 id를 가진 메모를 불러온다.
      const memo = await Memo.findOne({ where: { id } });
      const userId = memo.userId;

      if (reqUserId !== userId) {
        // 메모를 작성한 사용자와 조회하는 사용자가 다른 경우 403 에러 반환
        return res.status(403).end();
      }

      // 메모 데이터를 JSON 형태로 전달
      return res.json(memo.toJSON());
    } catch (err) {
      console.error(err);
      return res.status(400).send();
    }
  })
  .put(isLoggedIn, upload.single("image"), async (req, res) => {
    // 특정 메모를 수정하는 라우터
    const file = req.file;
    const { title, content } = req.body;
    const id = req.params.id;
    const reqUserId = req.session.passport.user;

    let fileName = "";
    if (file !== undefined) {
      fileName = file.filename;
      console.log(file.filename);
    }

    try {
      const memo = await Memo.findOne({ where: { id } });
      const userId = memo.userId;

      if (reqUserId !== userId) {
        // 메모를 작성한 사용자와 수정하는 사용자가 다른 경우 403 에러 반환
        return res.status(403).end();
      }

      // Memo 테이블에서 해당 id를 가진 메모를 수정한다.
      // updatedAt은 현재 시간으로 설정
      await Memo.update(
        { title, content, img: fileName, updatedAt: Date.now() },
        {
          where: {
            id,
          },
        }
      );

      return res.status(201).end();
    } catch (err) {
      console.error(err);
      return res.status(400).end();
    }
  })
  .delete(isLoggedIn, async (req, res) => {
    // 특정 메모를 삭제하는 라우터
    const id = req.params.id;
    const userId = req.session.passport.user;

    try {
      // Memo 테이블에서 해당 id를 가진 메모를 확인한다.
      const memo = await Memo.findOne({
        where: { id },
        attributes: ["userId"],
      });

      if (memo.userId !== userId) {
        // 메모를 작성한 사용자와 삭제하는 사용자가 다른 경우 403 에러 반환
        return res.status(403).end();
      }

      // Memo 테이블에서 해당 id를 가진 메모를 삭제한다.
      await Memo.destroy({ where: { id } });

      return res.status(200).end();
    } catch (err) {
      console.error(err);
      return res.status(400).end();
    }
  });

module.exports = router;
