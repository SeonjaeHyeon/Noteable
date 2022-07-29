const pwCheck = () => {
  // 비밀번호 규칙을 체크하는 함수
  const pw = document.getElementById("password").value;
  const pw2 = document.getElementById("repassword").value;
  const status = document.getElementById("check_status");

  // 비밀번호 입력창과 비밀번호 재입력창이 비어있는 경우 비밀번호 일치 상태 글자 숨김
  if (pw.length === 0 && pw2.length === 0) {
    status.innerHTML = "&nbsp;";
    status.removeAttribute("style");
    return;
  }

  if (pw === pw2) {
    // 비밀번호 입력창과 비밀번호 재입력창의 값이 일치하는 경우
    // 비밀번호 일치 상태 글자를 일치한다고 변경
    status.innerText = "비밀번호가 일치합니다.";
    status.style.color = "green";
  } else {
    // 일치하지 않는 경우 비밀번호 일치 상태 글자를 일치하지 않는다고 변경
    status.innerText = "비밀번호가 일치하지 않습니다.";
    status.style.color = "red";
  }

  // 비밀번호 길이를 3자리 이상으로 제한하는 부분
  if (pw.length < 3) {
    status.innerText = "비밀번호는 3자리 이상이어야 합니다.";
    status.style.color = "red";
  }
};

window.onload = () => {
  const submit = document.getElementById("submit");

  // 회원가입 버튼을 클릭했을 때 이벤트 추가
  submit.addEventListener("click", () => {
    const status = document.getElementById("check_status");

    // 비밀번호 입력창과 비밀번호 재입력창의 값이 일치하지 않는 경우
    // alert 창을 표시하고 회원가입이 되지 않도록 함
    if (status.style.color !== "green") {
      alert("비밀번호를 다시 확인해주세요.");
      return;
    }

    // form 데이터의 name, email, password를 formData라는 객체에 저장
    const form = document.getElementById("form");
    const name = form.name.value;
    const email = form.email.value;
    const authId = form.authId.value;
    const authPw = form.authPw.value;

    const formData = { name, email, authId, authPw };

    // 이름, 이메일, 비밀번호, 비밀번호 재입력 창 중 입력되지 않은 것이 있는 경우
    // alert 창을 표시하고 회원가입이 되지 않도록 함
    for (let key in formData) {
      if (formData[key] === "") {
        alert("모든 항목을 입력해야 합니다.");
        return;
      }
    }

    // HTTP POST 메서드로 회원가입 데이터 서버에 전송
    axios
      .post("/api/auth/signUp", formData)
      .then((res) => {
        if (res.status === 201) {
          // 응답 코드가 201인 경우 (회원가입 성공)
          // 로그인 페이지로 이동
          alert("회원가입 성공\n로그인 페이지로 이동합니다.");
          window.location.href = "/auth/signIn";
        } else {
          // 회원가입에 실패했을 경우 페이지 새로고침
          alert("회원가입 실패");
          window.location.reload();
        }
      })
      .catch((_) => {
        alert("회원가입 실패");
        window.location.reload();
      });
  });
};
