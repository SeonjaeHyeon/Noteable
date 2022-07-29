const pwCheck = () => {
  // 비밀번호 규칙을 체크하고, 이름 입력 창이 비어있는지 체크하는 함수
  const pw = document.getElementById("password").value;
  const pw2 = document.getElementById("repassword").value;

  const name = document.querySelector("input#name").value;
  if (name.length === 0) {
    // 이름 입력 창이 비어있는 경우 alert 창 표시
    alert("이름은 반드시 입력해야 합니다.");
    return false;
  }

  if (pw.length === 0 || pw === pw2) {
    // 비밀번호 입력 창이 비었거나 비밀번호 입력창과 비밀번호 재입력 창의 값이 일치하는 경우
    // true 반환 (정상적인 상태)
    return true;
  }

  // 그 외의 경우는 잘못된 경우이므로 alert 창 표시
  alert("비밀번호를 확인해주세요.");
  return false;
};

const requestFriend = async (userId) => {
  // 클라이언트 상에서 친구 요청을 보내는 함수
  try {
    // HTTP POST 메서드로 친구 요청 JSON 데이터 서버에 전송
    await axios.post("/api/friend/request", JSON.stringify({ userId }), {
      headers: { "Content-Type": "application/json" },
    });

    alert("친구 요청 성공");
  } catch (err) {
    if (err.response.status == 403) {
      // 이미 친구 요청을 보냈거나 이미 친구인 경우 alert 창 표시
      alert("이미 친구 요청을 보냈습니다.");
    } else {
      alert("친구 요청 실패");
    }
    console.error(err);
  }
};

const showFriends = async (data, isFriend) => {
  // 친구 목록 데이터를 이용하여 친구 목록을 표시하는 함수

  // 데이터를 표시하기 전에 기존에 table에 표시된 데이터를 지운다.
  const tbody = document.querySelector("tbody#friend-tbody");
  tbody.innerHTML = "";

  data.map((value, index) => {
    // 각 친구 데이터마다 table에 추가
    const html = `
      <th scope="row">${index + 1}</th>
      <td id="authId">${value.authId}</td>
      <td>${value.name}</td>
    `;
    const tr = document.createElement("tr");
    tr.className = "table_row";
    tr.innerHTML = html;

    const lastTd = document.createElement("td");
    if (!isFriend) {
      // getFriends 함수로 가져온 데이터가 아닌 findFriend 함수로 가져온 데이터인 경우
      // 친구 요청 버튼 추가
      const button = document.createElement("button");
      button.textContent = "친구 요청";
      button.addEventListener("click", async () => {
        // 친구 요청 버튼 클릭 시 친구 요청을 보냄
        requestFriend(value.id);
      });
      lastTd.appendChild(button);
    }
    tr.appendChild(lastTd);
    tbody.appendChild(tr);
  });
};

const getFriends = async () => {
  // 클라이언트 상에서 친구 목록을 가져오는 함수
  try {
    // HTTP GET 메서드로 서버로부터 친구 목록을 가져온다.
    const res = await axios.get("/api/friend/list");
    const friends = res.data;

    // 가져온 데이터를 showFriends 함수로 전달
    showFriends(friends, true);
  } catch (err) {
    console.error(err);
  }
};

const findFriend = async (keyword) => {
  // 클라이언트 상에서 친구 검색을 처리하는 함수
  try {
    // HTTP POST 메서드로 검색 키워드를 서버로 전송
    const res = await axios.post(
      "/api/friend/find",
      JSON.stringify({ keyword }),
      { headers: { "Content-Type": "application/json" } }
    );
    const friends = res.data;

    // 가져온 데이터를 showFriends 함수로 전달
    showFriends(friends, false);
  } catch (err) {
    console.error(err);
  }
};

// 화면이 모두 로드된 뒤 실행
window.onload = async () => {
  document
    .querySelector("button#info_submit")
    .addEventListener("click", async () => {
      // 내 정보 저장 버튼을 누를 경우 실행되는 이벤트
      if (!pwCheck()) {
        // pwCheck 함수를 통해 규칙이 통과되지 않으면 return
        return;
      }

      // 사용자의 이메일, 비밀번호, 이름을 가져온다.
      const email = document.getElementById("email").value;
      const authPw = document.getElementById("password").value;
      const name = document.querySelector("input#name").value;

      try {
        // HTTP POST 메서드로 서버에 수정할 사용자 정보를 JSON 형식으로 전달한다.
        await axios.post("/api/user", JSON.stringify({ name, email, authPw }), {
          headers: { "Content-Type": "application/json" },
        });

        alert("내 정보 저장 완료");
        // 업데이트가 완료되면 페이지를 새로고침한다.
        window.location.reload();
      } catch (err) {
        alert("내 정보 저장 실패");
        console.error(err);
      }
    });

  document
    .querySelector("button#searchQuerySubmit")
    .addEventListener("click", async () => {
      // 친구 찾기 검색 버튼을 눌렀을 때 실행되는 이벤트

      // 검색 입력창으로부터 키워드 값을 가져온다.
      const keyword = document.querySelector("input#searchQueryInput").value;
      if (!keyword) {
        // 키워드가 비어있는 경우 모든 친구 목록을 불러오도록 getFriends 함수를 호출한다.
        getFriends();
      } else {
        // 키워드가 있을 경우 해당 키워드를 포함하는 사용자를 불러오도록 findFriend 함수를 호출한다.
        findFriend(keyword);
      }
    });

  document
    .querySelector("input#searchQueryInput")
    .addEventListener("keydown", (e) => {
      // 친구 찾기 입력창에서 키보드 키를 누를 경우 실행되는 이벤트
      if (e.keyCode == 13) {
        // Enter key를 누를 경우 검색 버튼 클릭
        document.querySelector("button#searchQuerySubmit").click();
      }
    });

  // getFreinds 함수를 호출하여 친구 목록을 불러온다.
  getFriends();
};
