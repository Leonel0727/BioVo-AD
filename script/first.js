
function handleButtonClick(buttonId) {
    if (buttonId === "btnAdministrator") {
        window.location.href = "administration_login.html";
    } else if (buttonId === "btnUser") {
        window.location.href = "voter_start.html";
    }
    else if (buttonId === "btndatabase") {
        window.location.href = "Index.html";
    }
}
// Add event listeners to buttons
document.getElementById("btnAdministrator").addEventListener("click", function () {
    handleButtonClick("btnAdministrator");
});
document.getElementById("btnUser").addEventListener("click", function () {
    handleButtonClick("btnUser");
});
document.getElementById("btndatabase").addEventListener("click", function () {
    handleButtonClick("btndatabase");
});

window.addEventListener('beforeunload', function (e) {
    if (document.getElementById('btnAdministrator').clicked) {
        e.preventDefault();
    }
});

window.addEventListener('keydown', function (e) {
    if (document.getElementById('btnAdministrator').clicked && (e.key === 'r' || e.keyCode === 82)) {
        e.preventDefault();
    }
});