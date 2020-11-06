let oldTarget;
let usernameList = [];
let name = "";
let usernameInput = [];

document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
    let addBtn = document.getElementById("addMsgBtn");
    addBtn.addEventListener("click", onClickAddBtn);

    let sendMsg = document.getElementById("sendMsg");
    sendMsg.addEventListener("click", onClickSendMsg);

    let sentMsgs = document.getElementById("sentMsgs");
    sentMsgs.addEventListener("click", onClickSentMsgs);

    let recvMsgs = document.getElementById("recvMsgs");
    recvMsgs.addEventListener("click", onClickRecvMsgs);

    let addMailingListBtn = document.getElementById("addMailingListBtn");
    addMailingListBtn.addEventListener("click", onClickAddMailingListBtn);

    let sendMailingList = document.getElementById("sendMailingList");
    sendMailingList.addEventListener("click", onClickSendMailingList);

    let usernameInput = document.forms["form-message"]["username"];
    usernameInput.addEventListener("keypress", onUsernameInput);
    usernameInput.addEventListener("blur", onUsernameBlur);
}

function onClickDeleteMessage(msgId) {
<<<<<<< Updated upstream
    console.log(msgId);
    let deleteBtn = event.target;
    let msgBox = deleteBtn.closest(".msg-box");
    let parent = msgBox.parentElement;

    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", `http://localhost:4000/messages/${msgId}`);
    xhr.send();
    xhr.onload = () => {
        let data = JSON.parse(xhr.response);
        if (data.success) {
            // TODO: check why remove deletes the buttons, they don't any more
            parent.remove(msgBox);
        } else {
            displayError(data.message);
        }
    };
=======
  console.log(msgId);
  let deleteBtn = event.target;
  let msgBox = deleteBtn.closest(".msg-box");
  let parent = msgBox.parentElement;

  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", `http://localhost:4000/messages/${msgId}`);
  xhr.send();
  xhr.onload = () => {
    let data = JSON.parse(xhr.response);
    if (data.success) {
      // check why remove deletes the buttons, they don't any more
      parent.remove(msgBox);
    } else {
      displayError(data.message);
    }
  };
>>>>>>> Stashed changes
}

function onClickMailingUsername(username) {
    let found = false;
    for (let i = 0; i < usernameInput.length; i++) {
        if (usernameInput[i].name == username) {
            found = true;

            usernameInput.splice(i, 1);
            break;
        }
    }
    if (!found) {
        usernameInput.push({ name: username, group: true });
    }
    event.target.classList.toggle("border-info");
}

function onClickSendMailingList() {
    let mailingListName = document.forms["form-mailing-list"]["name"].value;

    doPost("http://localhost:4000/messages/mailing-list", {
        name: mailingListName,
        usernameList,
    });
}

function onClickAddMailingListBtn() {
    hideDetails();

    let mailingListForm = document.getElementById("mailingList");
    mailingListForm.classList.remove("d-none");

    // ajax to get all users
    getUsers();
}

function onClickMessage(title, from, body) {
    let form = document.forms["view-message"];
    form["title"].value = title;
    form["username"].value = from;
    form["body"].innerHTML = body;

    let target = event.target.closest(".msg-box");
    if (oldTarget) {
        oldTarget.classList.remove("bg-primary", "text-white");
    }
    target.classList.add("bg-primary", "text-white");
    oldTarget = target;
}

function onClickSentMsgs() {
    location.assign("/messages/sent");
}

function onClickRecvMsgs() {
    location.assign("/messages/received");
}

function onClickAddBtn() {
    hideDetails();

    let msgAdd = document.getElementById("msgAdd");
    msgAdd.classList.remove("d-none");
}

function onClickSendMsg() {
<<<<<<< Updated upstream
    let form = document.forms["form-message"];
    let to = form["username"].value;
    let title = form["title"].value;
    let body = form["body"].value;

    if (!title || !body) { // TODO: "to" trebuie sa fie din lista 
        alert("please input all fields");
        return;
    }

    // TODO: mark group from mailing list, to be able to differentiate on the server-side
    // example: toList = [{name: "user1"}, {name: "user2"}, {name: "group1", group: true}]
    doPost("http://localhost:4000/messages", {
        toList: usernameInput,
        title,
        body,
    });
=======
  let form = document.forms["form-message"];
  let to = form["username"].value;
  let title = form["title"].value;
  let body = form["body"].value;

  if (!to || !title || !body) {
    alert("please input all fields");
    return;
  }

  // mark group from mailing list, to be able to differentiate on the server-side
  // example: toList = [{name: "user1"}, {name: "user2"}, {name: "group1", group: true}]
  doPost("http://localhost:4000/messages", {
    toList: usernameInput,
    title,
    body,
  });
>>>>>>> Stashed changes
}

function doPost(url, params) {
    let req = new XMLHttpRequest();

    req.open("POST", url);
    req.setRequestHeader("Content-type", "application/json");

    req.send(JSON.stringify(params));

    req.onload = () => {
        const data = JSON.parse(req.response);
        if (!data.success) {
            displayError(data.message);
        } else {
        }
    };
}

function getUsers() {
    let req = new XMLHttpRequest();
    let url = "http://localhost:4000/users";

    req.open("GET", url);
    req.send();
    req.onload = () => {
        const data = JSON.parse(req.response);
        if (!data.success) {
            displayError(data.message);
        } else {
            let container = document.getElementById("container-usernames");
            container.innerHTML = "";
            usernameList = [];

            for (let user of data.data) {
                container.append(createUserElem(user));
            }
        }
    };
}

function createUserElem(user) {
    let container = document.createElement("div");
    container.innerHTML = user.username;
    container.classList.add(
        "p-3",
        "mr-2",
        "border",
        "col",
        "rounded-pill",
        "text-center"
    );
    container.setAttribute("data-username", user.username);

    container.addEventListener("click", addUserToList);

    return container;
}

function addUserToList(event) {
    let container = event.target;
    let username = container.getAttribute("data-username");

    if (usernameList.includes(username)) {
        // stergen username
        let index = usernameList.indexOf(username);
        usernameList.splice(index, 1);
    } else {
        //adaugam username
        usernameList.push(username);
    }

    container.classList.toggle("border-info");
}

function displayError(err) {
    const msgElem = document.getElementById("err-msg");
    msgElem.innerHTML = err;
}

function hideDetails() {
    let elem = document.getElementById("msgContent");
    elem.classList.add("d-none");

    elem = document.getElementById("msgAdd");
    elem.classList.add("d-none");

    elem = document.getElementById("mailingList");
    elem.classList.add("d-none");
}

function onUsernameInput(event) {
    let key = event.key;

    if (key == ",") {
        addUsernameToList();
    } else {
        if (event.key != " ") {
            name += event.key;
        }
    }
}

function toggleName(event) { 
    let target = event.target;
    let currentName = target.innerHTML;
    let i = 0;
    let found = false;
    target.classList.toggle("border-info");

    for (i = 0; i < usernameInput.length; i ++) {
        if (usernameInput[i].name == currentName) {
            found = true;
            break;
        }
    }
    if (found) {
        usernameInput.splice(i, 1);
    } else {
        usernameInput.push({name: currentName});
    }

}

function addUsernameToList() {
    if (!name.trim()) {
        return;
    }

    let found = false;
    //save to username list bellow
    for (let i = 0; i < usernameInput.length; i++) {
        if (usernameInput[i].name == name) {
            found = true;
            break;
        }
    }
    if (!found) {
        usernameInput.push({ name });
    }

    let list = document.getElementById("mailing-names");

    let usernameDiv = document.createElement("div");
    usernameDiv.classList.add(
        "border",
        "p-3",
        "mr-2",
        "col",
        "rounded-pill",
        "text-center",
        "border-info"
    );
    usernameDiv.addEventListener("click", toggleName);
    usernameDiv.innerHTML = name;

    list.append(usernameDiv);

    name = "";
}

function onUsernameBlur() {
    console.log(name);
    addUsernameToList();
}
