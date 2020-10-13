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
}

function onClickMessage(title, from, body) {
    let form = document.forms['view-message'];
    form['title'].value = title;
    form['username'].value = from;
    form['body'].innerHTML = body;
}

function onClickSentMsgs() {
    location.assign('/messages/sent');
}

function onClickRecvMsgs() {
    location.assign('/messages/received');
}

function onClickAddBtn() {
    let msgContent = document.getElementById("msgContent");
    msgContent.classList.remove('d-none');
}

function onClickSendMsg() {
    let form = document.forms["form-message"];
    let to = form["username"].value;
    let title = form["title"].value;
    let body = form["body"].value;

    // TODO validari

    doPost("http://localhost:4000/messages", {to, title, body}); 

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

function displayError(err) {
    const msgElem = document.getElementById('err-msg');
    msgElem.innerHTML = err;
}


