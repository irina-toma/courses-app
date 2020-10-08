document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
  let submitBtn = document.getElementById("course-submit");
  submitBtn.addEventListener("click", onClickSubmit);

  let name = document.forms["course-apply"]["Name"];
  let email = document.forms["course-apply"]["E-mail"];

  if (!name.value || !email.value) {
    name.removeAttribute("disabled");
    email.removeAttribute("disabled");
  }
}

function onClickSubmit(event) {
  event.preventDefault();

  let url = "/courses/submit";
  let form = document.forms["course-apply"];
  let params = {};

  //course stays fixed, we need the selected start date
  //user info can change

  params.name = form["Name"].value;
  params.email = form["E-mail"].value;
  params.address = {
    street: form["Street"].value,
    number: form["Number"].value,
    city: form["City"].value,
    postalCode: form["Postal code"].value,
    country: form["Country"].value
  }
  params.phoneNo = form["Phone Number"].value;
  params.selectedDate = form["selectDates"].selectedOptions[0].value;

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
