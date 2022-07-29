exports.isLoggedIn = (req, res, next) => {
  console.log(req.session);
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/signIn");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};
