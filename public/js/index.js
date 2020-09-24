document.addEventListener('DOMContentLoaded', onload);

function onload() {
    let signUp = document.getElementById('nav-login');
    signUp.addEventListener('click', auth);
}

function auth() {
    displayPage('/auth/login');
}

function displayPage(url) {
    let req = new XMLHttpRequest();

    req.open('GET', url);
    req.send();

    req.onload = () => {
        const container = document.getElementsByTagName('html')[0];
        container.innerHTML = req.response;
    }
}