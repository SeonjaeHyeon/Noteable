const postMemo = async (data) => {
  // HTTP POST 메서드로 서버에 메모 데이터를 전송하여 메모를 추가하는 함수
  try {
    await axios.post("/api/memo", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    getMemos();
  } catch (err) {
    console.error(err);
  }
};

const modifyMemo = async (key) => {
  // 메모 수정을 위해 특정 메모의 제목과 내용을 가져오는 함수이다.
  // HTTP GET 메서드로 서버에서 메모 id에 해당하는 특정 메모 데이터를 가져온다.
  // 그리고 메모 제목과 내용 입력창을 해당 value들로 설정한다.

  // 메모 수정 시 file type의 input은 읽기 전용으로 파일명을 설정해줄 수 없어
  // 이미지 정보가 사라지므로 새로 이미지를 첨부해주어야 한다.
  alert("메모 수정 시 이미지를 새로 업로드 해야 합니다.");

  try {
    const res = await axios.get("/api/memo/" + key);
    const { title, content } = res.data;

    const input_id = document.querySelector("input#memo_id");
    const input_title = document.querySelector("input#title");
    const input_content = document.querySelector("textarea#content");

    // 메모 id를 위한 hidden input, 메모 제목, 메모 내용 input 태그의 값을 서버에서 불러온 메모의 데이터로 설정한다.
    input_id.value = key;
    input_title.value = title;
    input_content.value = content;

    // 메모를 수정하는 단계이므로 메모 추가 버튼의 이름을 메모 수정으로 변경한다.
    const button = document.querySelector("button#memo_submit");
    button.innerText = "메모 수정";
  } catch (err) {
    console.error(err);
  }
};

const putMemo = async (id, data) => {
  // HTTP PUT 메서드로 서버에 수정한 메모 데이터를 전송하여 특정 메모를 수정하는 함수
  try {
    await axios.put("/api/memo/" + id, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    getMemos();
  } catch (err) {
    console.error(err);
  }
};

const deleteMemo = async (key) => {
  // HTTP DELETE 메서드로 서버에 저장되어 있는 특정 메모를 삭제하는 함수
  try {
    await axios.delete("/api/memo/" + key);
    getMemos();
  } catch (err) {
    console.error(err);
  }
};

const createMemoItem = async (data) => {
  // 서버로부터 가져온 메모들로 item을 생성하여 표시하는 함수
  data.map((value) => {
    const key = value.id;
    const { title, content } = value;

    //div (memo item 프레임)를 만드는 부분 (최상위 태그)
    const memo_item_div = document.createElement("div");
    memo_item_div.className = "memo_item";
    memo_item_div.id = "memo" + key;

    // 메모 제목과 내용 태그를 감싸는 div 태그를 만드는 부분
    // 메모 텍스트 부분 (title, content)을 누르면 openModal 함수가 실행되는 이벤트 등록
    const memo_text_div = document.createElement("div");
    memo_text_div.className = "memo_text";
    memo_text_div.title = "메모보기";
    memo_text_div.addEventListener("click", function () {
      openModal(key);
    });
    memo_item_div.appendChild(memo_text_div);

    // 메모 제목과 내용 생성 (span)
    const memo_span = document.createElement("span");
    memo_span.classList.add("memo_span");
    memo_span.innerHTML = `<span id="title">${title}</span><br/><br/>${content}<br/>`;
    memo_text_div.appendChild(memo_span);

    // 메모 수정, 메모 삭제의 버튼을 감싸는 div 태그를 만드는 부분
    const memo_button = document.createElement("div");
    memo_button.className = "memo_button";

    // 메모 수정 버튼 생성, 버튼을 누르는 경우 modifyMemo 함수가 실행되는 이벤트 등록
    const memo_modify = document.createElement("i");
    memo_modify.className = "fas fa-edit";
    memo_modify.addEventListener("click", function () {
      modifyMemo(key);
    });
    memo_button.appendChild(memo_modify);

    // 메모 삭제 버튼 생성, 버튼을 누르는 경우 deleteMemo 함수가 실행되는 이벤트 등록
    const memo_delete = document.createElement("i");
    memo_delete.className = "fas fa-times";
    memo_delete.addEventListener("click", function () {
      deleteMemo(key);
    });
    memo_button.appendChild(memo_delete);

    // 버튼을 감싸는 div 태그를 상위 div (memo_item_div) 아래에 추가하는 부분, 제일 첫 번째 child로 추가함
    memo_item_div.insertBefore(memo_button, memo_item_div.firstChild);

    // 생성한 메모 item을 화면에 추가하는 부분
    const memo_box_div = document.getElementsByClassName("memo_box")[0];
    memo_box_div.appendChild(memo_item_div);
  });
};

const getMemos = async () => {
  // HTTP GET 메서드로 서버에 기록된 메모들을 가져오는 함수
  try {
    const res = await axios.get("/api/memo/list");
    const memos = res.data;
    const list = document.querySelector(".memo_box");
    list.innerHTML = "";

    // 메모들을 createMemoItem 함수로 전달하여 메모를 화면에 표시한다.
    await createMemoItem(memos);
  } catch (err) {
    console.error(err);
  }
};

const readMemo = async (key) => {
  // HTTP GET 메서드로 특정 메모 데이터를 가져오고, 팝업 modal 창에 해당 데이터를 설정하는 함수(메모 제목, 이미지, 메모 내용)
  const res = await axios.get("/api/memo/" + key);
  const { title, content, img } = res.data;

  const popup = document.getElementById("popup");
  // 데이터를 채워넣을 태그들을 선택하는 부분
  const div_title = popup.querySelector("div#title");
  const div_content = popup.querySelector("div#content");
  const div_file = popup.querySelector("div#file");

  // 메모에 이미지 파일이 포함되어 있는 경우 해당 이미지의 주소를 가져와 img 태그를 추가하는 부분
  div_file.innerHTML = "";
  if (img !== "" && img !== null) {
    const image = document.createElement("img");
    image.src = "img/" + img;
    div_file.appendChild(image);
  }

  // title, content 태그에 텍스트 지정
  div_title.textContent = title;
  div_content.textContent = content;
};

const openModal = async (key) => {
  // 팝업 modal 창을 표시하는 함수
  // 먼저 팝업 창에 데이터 반영을 위해 readMemo 함수 실행
  await readMemo(key);

  // 팝업 창의 display 속성을 flex로 변경하여 창 표시
  const popup = document.getElementById("popup");
  popup.style.display = "flex";
};

const closeModal = () => {
  // 팝업 modal 창을 닫는 함수
  // 팝업 창의 display 속성을 none으로 변경하여 창 숨김
  const popup = document.getElementById("popup");
  popup.style.display = "none";
};

// 화면이 모두 로드된 뒤 실행
window.onload = () => {
  // 메모 추가 버튼을 눌러 form이 submit 될 때 실행되는 이벤트 등록
  document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // 메모 제목과 메모 내용 input 태그로부터 값을 가져온다.
    const title = e.target.title.value;
    const content = e.target.content.value;
    const image = e.target.image.files[0];

    // 제목이 비어있거나 내용이 비어있는 경우, 제목 또는 내용을 입력해달라는 alert를 표시하고 return한다.
    if (!title) {
      return alert("제목을 입력해주세요.");
    }
    if (!content) {
      return alert("내용을 입력해주세요.");
    }

    // 메모 제목과 내용, 파일 데이터를 담은 FormData 객체를 생성한다.
    // 파일 데이터를 포함시키기 위해 FormData 형태로 전송한다.
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    // 메모 id input 태그로부터 값을 가져온다.
    const memo_id = e.target.memo_id.value;
    if (memo_id === "") {
      // 메모 id가 비어있는 경우 메모 수정이 아닌 메모 추가이므로 postMemo 함수에 data 객체를 전달하여 메모를 추가한다.
      await postMemo(formData);
    } else {
      // 메모 id가 비어있지 않은 경우 메모 수정이므로 putMemo 함수에 메모 id와 data 객체를 전달하여 메모를 수정한다.
      // 그리고 modifyMemo 함수에 의해 메모 추가 버튼이 메모 수정으로 바뀌었으므로 원래대로 바꾸어준다.
      // 또한, 메모 id를 담은 hidden input의 value 값도 초기화해준다.
      await putMemo(memo_id, formData);

      e.target.memo_id.value = "";
      const button = document.querySelector("button#memo_submit");
      button.innerText = "메모 추가";
    }

    // 메모 제목과 메모 내용 입력창을 비운다.
    e.target.title.value = "";
    e.target.content.value = "";
    e.target.image.value = "";
  });

  // getMemos 함수를 호출하여 기록되어 있는 메모들을 불러온다.
  getMemos();
};
