let parties = new Set();

const getFriends = async () => {
  // 친구 목록을 불러오는 함수
  try {
    // HTTP GET 메서드로 서버로부터 친구 목록을 불러온다.
    const res = await axios.get("/api/friend/list");
    const friends = res.data;

    if (friends) {
      // 친구가 존재하면 select 태그 option으로 추가
      const select = document.querySelector("select#party");
      for (const friend of friends) {
        const option = document.createElement("option");
        option.value = friend.userId;
        option.textContent = friend.name;
        select.appendChild(option);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const postTodo = async (data) => {
  // 할 일 데이터를 서버로 전송하여 추가하는 함수
  try {
    // HTTP POST 메서드로 데이터 전송
    await axios.post("/api/todo", data);
    // 할 일 목록 불러오기
    getTodos();
  } catch (err) {
    alert("할 일 추가 실패");
    console.error(err);
  }
};

const updateTodo = async (id, type) => {
  // 할 일 데이터의 상태를 변경하는 함수
  try {
    // HTTP PUT 메서드를 사용하여 할 일 상태 변경
    await axios.put("/api/todo/" + id, JSON.stringify({ type }), {
      headers: { "Content-Type": "application/json" },
    });
    // 할 일 목록 불러오기
    getTodos();
  } catch (err) {
    alert("할 일 업데이트 실패");
    console.error(err);
  }
};

const deleteTodo = async (id) => {
  // 한 일 데이터를 삭제하는 함수
  // 2번의 상태 변경으로 할 일에서 한 일로 변경된 할 일을 제거한다.
  try {
    // HTTP DELETE 메서드로 할 일 삭제
    await axios.delete("/api/todo/" + id);
    // 할 일 목록 불러오기
    getTodos();
  } catch (err) {
    alert("할 일 삭제 실패");
    console.error(err);
  }
};

const createTodoItem = async (data) => {
  // 할 일 데이터 리스트를 가지고 item을 생성하여 표시하는 함수
  data.map((value) => {
    const { id, content, type, createdAt } = value;

    // item에 시간 정보 추가하는 부분
    const date = new Date(createdAt);
    const dateString =
      String(date.getFullYear()) +
      "/" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(date.getDate()).padStart(2, "0");
    const timeString =
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0");

    const tr1 = document.createElement("tr");
    const td1 = document.createElement("td");
    td1.classList.add("t_content");
    td1.setAttribute("colspan", "2");
    td1.textContent = content;
    tr1.appendChild(td1);

    const tr2 = document.createElement("tr");
    const td2 = document.createElement("td");
    td2.classList.add("t_detail");
    td2.textContent = `작성 ${dateString} ${timeString}`;

    const td3 = document.createElement("td");
    const i = document.createElement("i");
    if (type == 2) {
      // 할 일의 상태가 2, 즉 한 일인 경우 삭제 버튼 추가
      td3.classList.add("t_del");
      i.className = "fas fa-times";

      i.addEventListener("click", () => {
        // 버튼 클릭시 deleteTodo 호출
        deleteTodo(id);
      });
    } else {
      // 그 외의 경우 상태 변경 버튼(오른쪽 화살표) 추가
      td3.classList.add("t_pass");
      i.className = "fas fa-long-arrow-alt-right";

      i.addEventListener("click", () => {
        // 버튼 클릭 시 updateTodo 호출
        updateTodo(id, Number(type) + 1);
      });
    }
    td3.appendChild(i);

    tr2.appendChild(td2);
    tr2.appendChild(td3);

    // 할 일 상태에 따라 tbody 분기
    let tbody;
    if (type == 0) {
      tbody = document.querySelector("div#todo_wrapper tbody");
    } else if (type == 1) {
      tbody = document.querySelector("div#doing_wrapper tbody");
    } else {
      tbody = document.querySelector("div#done_wrapper tbody");
    }

    tbody.appendChild(tr1);
    tbody.appendChild(tr2);
  });
};

const getTodos = async () => {
  // 할 일 목록을 서버로부터 가져오는 함수
  try {
    // 할 일 목록 표시 부분 태그 초기화
    document.querySelector("div#todo_wrapper tbody").innerHTML = "";
    document.querySelector("div#doing_wrapper tbody").innerHTML = "";
    document.querySelector("div#done_wrapper tbody").innerHTML = "";

    // HTTP GET 메서드로 할 일 목록 가져오기
    const res = await axios.get("/api/todo/list");
    const todos = res.data;

    // createTodoItem 함수를 호출하여 화면에 표시
    await createTodoItem(todos);
  } catch (err) {
    console.error(err);
  }
};

const deleteParty = (id) => {
  // 할 일 작성 시 함께할 친구 삭제
  const party_list = document.querySelector("div#party_list");
  party_list.querySelectorAll("div").forEach((elem) => {
    if (elem.getAttribute("partyid") == id) {
      party_list.removeChild(elem);
    }
  });
};

const addParty = (e) => {
  // 할 일 작성 시 함께할 친구 추가
  const id = Number(e.target.value);
  const index = e.target.selectedIndex;
  const name = e.target.options[index].textContent;
  if (id == 0) {
    return;
  }

  // 선택 항목 초기화
  e.target.selectedIndex = 0;

  if (parties.has(id)) {
    // 이미 함께하는 친구인 경우 return
    return;
  }
  parties.add(id);

  const party_list = document.querySelector("div#party_list");
  const div = document.createElement("div");
  div.setAttribute("partyId", id);
  div.classList.add("party");

  const span = document.createElement("span");
  span.textContent = name;
  // 친구 삭제 버튼 추가
  const party_delete = document.createElement("i");
  party_delete.className = "fas fa-times";
  party_delete.addEventListener("click", function () {
    // 삭제 버튼 클릭 시 deleteParty 함수 호출
    parties.delete(id);
    deleteParty(id);
  });

  div.appendChild(span);
  div.appendChild(party_delete);

  party_list.appendChild(div);
};

window.onload = async () => {
  // select 태그에서 친구를 선택한 경우 addParty 함수 호출하는 이벤트 실행
  document.querySelector("select#party").addEventListener("change", addParty);
  document.querySelector("form").addEventListener("submit", async (e) => {
    // 할 일 작성 form이 submit 된 경우 이벤트 실행
    e.preventDefault();

    const content = e.target.content.value;
    // 함께하는 친구 목록 불러오기
    let party = [];
    const party_divs = document.querySelectorAll("div#party_list > div");
    party_divs.forEach((elem) => {
      const partyId = elem.getAttribute("partyid");
      party.push(partyId);
    });

    if (!content) {
      // 할 일 입력창이 비어있는 경우 alert 표시
      return alert("할 일을 입력해주세요.");
    }
    const data = { content, party };
    // postTodo 함수를 호출하여 서버로 할 일 데이터 전송
    await postTodo(data);

    // 할 일 작성 입력창 초기화
    e.target.content.value = "";
    const party_list = document.querySelector("div#party_list");
    party_list.innerHTML = "";
  });

  // 할 일 목록과 친구 목록 불러오기
  await getTodos();
  await getFriends();
};
