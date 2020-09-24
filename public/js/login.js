document.addEventListener('DOMContentLoaded', onload);

function onload() {
    let lForm = document.forms['login-form'];
    let signUp = document.getElementById('sign-up');

    lForm.addEventListener('submit', preventDefaultBehaviour);
    lForm['login'].addEventListener('click', login);
    signUp.addEventListener('click', toggleSignInSignUp);
}

function preventDefaultBehaviour(event) {
    event.preventDefault();
}

function login() {
    let lForm = document.forms['login-form'];
    let username = lForm['username'].value;
    let password = lForm['password'].value;
    
    let params = {
        username, password
    };

    doPost('http://localhost:4000/auth/login', params, callbackLogin);
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

function callbackLogin(data) {
    let container = document.getElementsByTagName('html')[0];
    container.innerHTML = data;
}


