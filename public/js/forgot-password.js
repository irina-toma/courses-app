document.addEventListener("DOMContentLoaded", onload);

function onload() {
  let lForm = document.forms["forgot-password"];
  lForm.addEventListener("submit", submitPassword);
}

function submitPassword(event) {
  event.preventDefault();
  let lForm = document.forms["forgot-password"];
  let email = lForm["email"].value;

  let params = {
    email,
  };

  doPost("http://localhost:4000/auth/forgot-password", params);
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
      alert("Email sent");
    }
  };
}

function displayError(err) {
  const msgElem = document.getElementById("err-msg");
  msgElem.innerHTML = err;
}
