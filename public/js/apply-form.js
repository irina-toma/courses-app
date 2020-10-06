document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
  let submitBtn = document.getElementById("course-submit");
  submitBtn.addEventListener("click", onClickSubmit);

  let token = localStorage.getItem("token");

  if (!token) {
    let name = document.forms["course-apply"]["Name"];

    let email = document.forms["course-apply"]["E-mail"];

    name.removeAttribute("disabled");

    email.removeAttribute("disabled");
  }

  // check user autenticated
  // if autheticated, leave fields name and email as disabled
  // else, enable them
}

function onClickSubmit() {
  let url = "/courses/submit";
  let form = document.forms["course-apply"];
  let params = {};

  params.name = document.forms["course-apply"]["Name"].value;

  params.email = document.forms["course-apply"]["E-mail"].value;

  params.address = document.forms["course-apply"]["Address"].value;

  params.phoneNo = document.forms["course-apply"]["Phone Number"].value;

  params.selectedDate =
    document.forms["course-apply"]["selectedDates"].selectedOptions[0].value;

  //course stays fixed, we need the selected start date

  //user info can change

  doPost(url, params);
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
      location.assign(data.data.url);
    }
  };
}

function displayError(err) {
  let errDiv = document.getElementById("error");
  errDiv.classList.toggle("d-block");
  errDiv.innerHTML = err;
}
