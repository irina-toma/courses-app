document.addEventListener("DOMcontentLoaded", onLoad);

function onLoad() {
    let submitBtn = document.getElementById("course-submit");
    submitBtn.addEventListener("click", onClickSubmit);

    // check user autenticated
    // if autheticated, leave fields name and email as disabled
    // else, enable them
}

function onClickSubmit() {
    let url = '/courses/submit';
    let form = document.forms["course-apply"];

    //course stays fixed, we need the selected start date
    

    //user info can change
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
            location.assign(data.data.url);
        }
    }
}

function displayError(err) {
    let errDiv = document.getElementById("error");
    errDiv.classList.toggle("d-block");
    errDiv.innerHTML = err;
}