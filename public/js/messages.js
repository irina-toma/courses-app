let oldTarget;
let usernameList = [];

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
}

function onClickDeleteMessage(msgId) {
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
            // TODO: check why remove deletes the buttons
            parent.remove(msgBox);
        } else {
            displayError(data.message)
        }
    };
    
}

function onClickMailingUsername(username) {
    let inputUsername = document.forms['form-message']['username'];

    inputUsername.value += `, ${username}`;  
}

function onClickSendMailingList() {
    let mailingListName = document.forms["form-mailing-list"]["name"].value;

    doPost("http://localhost:4000/messages/mailing-list", {name: mailingListName, usernameList});
}

function onClickAddMailingListBtn() {
    let mailingListForm = document.getElementById("mailingList");
    mailingListForm.classList.remove("d-none");

    let msgAdd = document.getElementById("msgAdd");
    msgAdd.classList.add('d-none');

    let msgContent = document.getElementById("msgContent");
    msgContent.classList.add('d-none');

    // ajax to get all users
    getUsers();

}

function onClickMessage(title, from, body) {
    let form = document.forms['view-message'];
    form['title'].value = title;
    form['username'].value = from;
    form['body'].innerHTML = body;

    let target = event.target.closest(".msg-box");
    if (oldTarget) {
        oldTarget.classList.remove("bg-primary", "text-white");
    }
    target.classList.add("bg-primary", "text-white");
    oldTarget = target;
}

function onClickSentMsgs() {
    location.assign('/messages/sent');
}

function onClickRecvMsgs() {
    location.assign('/messages/received');
}

function onClickAddBtn() {
    let msgAdd = document.getElementById("msgAdd");
    msgAdd.classList.remove('d-none');
}

function onClickSendMsg() {
    let form = document.forms["form-message"];
    let to = form["username"].value;
    let title = form["title"].value;
    let body = form["body"].value;

    // TODO validari

    // TODO: mark group from mailing list, to be able to differentiate on the server-side
    // example: toList = [{name: "user1"}, {name: "user2"}, {name: "group1", group: true}]
    doPost("http://localhost:4000/messages", { to, title, body });
}

function doPost(url, params) {
    let req = new XMLHttpRequest();

    req.open('POST', url);
    req.setRequestHeader('Content-type', 'application/json');

    req.send(JSON.stringify(params));

    req.onload = () => {
        const data = JSON.parse(req.response);
        if (!data.success) {
            displayError(data.message)
        } else {

        }
    }
}

function getUsers() {
    let req = new XMLHttpRequest();
    let url = 'http://localhost:4000/users'

    req.open('GET', url);
    req.send();
    req.onload = () => {
        const data = JSON.parse(req.response);
        if (!data.success) {
            displayError(data.message)
        } else {
            let container = document.getElementById("container-usernames");
            container.innerHTML = "";
            usernameList = [];

            for (let user of data.data) {
                container.append(createUserElem(user));
            }
        }
    }
}

function createUserElem(user) {
    let container = document.createElement("div");
    container.innerHTML = user.username;
    container.classList.add("p-3", "mr-2", "border");
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

    container.classList.toggle('bg-success');

}

function displayError(err) {
    const msgElem = document.getElementById('err-msg');
    msgElem.innerHTML = err;
}


