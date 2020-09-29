document.addEventListener('DOMContentLoaded', onload);

function onload() {
    let rForm = document.forms['register-form'];
    rForm.addEventListener('submit', register);
}

function register(event) {
    event.preventDefault();
    let rForm = document.forms['register-form'];
    let name = rForm['fullname'].value;
    let email = rForm['email'].value;
    let username = rForm['username'].value;
    let password = rForm['password'].value;

    let params = {
        name, email, username, password
    }

    doPost('http://localhost:4000/auth/register', params);
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
    const msgElem = document.getElementById('err-msg');
    msgElem.innerHTML = err;
}
