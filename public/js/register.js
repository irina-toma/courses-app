document.addEventListener('DOMContentLoaded', onload);

function onload() {
    let rForm = document.forms['register-form'];
    let signIn = document.getElementById('sign-in');

    rForm.addEventListener('submit', preventDefaultBehaviour);
    rForm['register'].addEventListener('click', register);
    signIn.addEventListener('click', toggleSignInSignUp);
}

function preventDefaultBehaviour(event) {
    event.preventDefault();
}

function register() {

    let rForm = document.forms['register-form'];
    let name = rForm['fullname'].value;
    let email = rForm['email'].value;
    let username = rForm['username'].value;
    let password = rForm['password'].value;

    let params = {
        name, email, username, password
    }

    doPost('http://localhost:4000/auth/register', params, callbackRegister);
}

function doPost(url, params, callback) {
    let req = new XMLHttpRequest();

    req.open('POST', url);
    req.setRequestHeader('Content-type', 'application/json');
   
    req.send(JSON.stringify(params));

    req.onload = () => {
        callback(req.response);
    }
}

function callbackRegister(data) {
    let container = document.getElementsByTagName('html')[0];
    container.innerHTML = data;
}


