// import modules
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const nunjucks = require("nunjucks");

// import routers
const indexRouter = require("./routes/");
const apiRouter = require("./routes/api");
const authRouter = require("./routes/auth");
const todoRouter = require("./routes/todo");
const mypageRouter = require("./routes/mypage");
const { sequelize } = require("./models");
const seed = require("./seeders");
const passport = require("./passport");

const app = express();
app.set("port", process.env.PORT || 3000);

// nunjucks 템플릿 엔진 설정
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

const force = true;
sequelize
  .sync({ force })
  .then(() => {
    if (force) {
      // db 초기화 설정(sync force: true) 시 자동 seed (sequelize db:seed:all과 동일)
      seed(sequelize.getQueryInterface());
    }
  })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

// express 내부 & 외부 middlewares
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/img", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 쿠키의 서명을 .env에 저장하고 그 저장값을 사용
app.use(cookieParser(process.env.COOKIE_SECRET));
// 세션의 서명을 .env에 저장하고 그 저장값을 사용
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 600000,
    },
    name: "session-cookie",
  })
);

// passport 초기화 & 세션 미들웨어 실행
app.use(passport.initialize());
app.use(passport.session());

// 요청 경로에 따라 router 실행
app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("/todo", todoRouter);
app.use("/mypage", mypageRouter);

// 404 에러처리 미들웨어
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 서버 에러처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  console.error(err);
  res.send("Internal Server Error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
