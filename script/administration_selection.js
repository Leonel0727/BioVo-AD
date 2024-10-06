// Function to handle button click event
function handleButtonClick(buttonId) {
    if (buttonId === "btnAddVoter") {
        window.location.href = "administration_add_voter.html";
    } else if (buttonId === "btnDatabase") {
        window.location.href = "administration_setting_1.html";
    } else if (buttonId === "btnAddAdministration") {
        window.location.href = "administration_add_administration.html";
    }
}

// Function to handle mouseover (hover) event
function handleButtonMouseOver(buttonId) {
    document.getElementById(buttonId).style.backgroundColor = "#45aaf2"; // Change background color on hover
}

// Function to handle mouseout (hover out) event
function handleButtonMouseOut(buttonId) {
    document.getElementById(buttonId).style.backgroundColor = "#3498db"; // Restore original background color on hover out
}

// Add event listeners to buttons
document.getElementById("btnAddVoter").addEventListener("click", function () {
    handleButtonClick("btnAddVoter");
});
document.getElementById("btnDatabase").addEventListener("click", function () {
    handleButtonClick("btnDatabase");
});
document.getElementById("btnAddAdministration").addEventListener("click", function () {
    handleButtonClick("btnAddAdministration");
});


document.getElementById("btnAddVoter").addEventListener("mouseover", function () {
    handleButtonMouseOver("btnAddVoter");
});
document.getElementById("btnDatabase").addEventListener("mouseover", function () {
    handleButtonMouseOver("btnDatabase");
});
document.getElementById("btnAddAdministration").addEventListener("mouseover", function () {
    handleButtonMouseOver("btnAddAdministration");
});


document.getElementById("btnAddVoter").addEventListener("mouseout", function () {
    handleButtonMouseOut("btnAddVoter");
});
document.getElementById("btnDatabase").addEventListener("mouseout", function () {
    handleButtonMouseOut("btnDatabase");
});
document.getElementById("btnAddAdministration").addEventListener("mouseout", function () {
    handleButtonMouseOut("btnAddAdministration");
});

$(document).ready(function() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:5007/read_login_3',
        data: JSON.stringify({ i: "i" }),
        contentType: "application/json; charset=utf-8",
        success: function(response) {
            if (response.success) {
                console.log("user access level is more than 3");
            } else {
                alert("user access authorise level is less than 3, didn't have access to modified the system");
                window.location.href = "first.html";
            }
        },
        error: function(error) {
            console.error("Error:", error);
            alert("cannot to connect database, pls restart this system");
            window.location.href = "first.html";
        }
    });
});