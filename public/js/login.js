document.addEventListener('DOMContentLoaded', onload);

function onload() {
    let lForm = document.forms['login-form'];
    lForm.addEventListener('submit', login);
}

function login(event) {
    event.preventDefault();
    let lForm = document.forms['login-form'];
    let username = lForm['username'].value;
    let password = lForm['password'].value;
    
    let params = {
        username, password
    };

    doPost('http://localhost:4000/auth/login', params);
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
            localStorage.setItem("token", data.data.token);
            location.assign(data.data.url);
        }
    }
}

function displayError(err) {
    const msgElem = document.getElementById('err-msg');
    msgElem.innerHTML = err;
}


