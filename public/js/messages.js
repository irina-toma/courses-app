document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
    document.getElementById("open-modal").addEventListener("click", onClickOpenModal);
}

function onClickOpenModal() {
    document.getElementById("modal_message").addEventListener("show.bs.modal", function () {
        document.getElementById("open-modal").trigger("focus");
    })
}