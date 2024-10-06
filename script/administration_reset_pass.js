
$(document).ready(function() {
  $("#reset-password-form").submit(function(event) {
    // prevent the default submit behavior of a form
    event.preventDefault();

    var username = $("#username").val();
    var password = $("#new_password").val();
    var password2 = $("#new_password2").val();


    // Check if username and password have been enter
    if (!username || !password||!password2) {
      alert("Please enter all information");
      return;
    }

    if(password !== password2){
      alert("Password Not Match");
      return;
    }

    //  Create a data object containing username and password
    var userData = {
      username: username,
      password: password
    };

    // Send AJAX request
    $.ajax({
      url: "http://localhost:5004/administration_reset_pass", 
      type: "POST", 
      data: JSON.stringify(userData), 
      contentType: "application/json; charset=utf-8", 
      success: function(response) {
        if(response.message === "Reset successful"){
          console.log("Reset successful:", response);
          $("#message").text("Reset successful");
          alert("successful");
          window.location.href = "administration_login.html";
        }else{
          $("#message").text("Reset failed: Invalid username");
          alert("Reset failed: Invalid username")
        }
      },
      error: function(error) {
        // handles error
        alert("cannot connect database makesure open mysql and connect to server")
        console.error("Error:", error);
      }
    });
  });
    document.getElementById("back").addEventListener("click", function () {
        window.location.href = "administration_login.html";
    });
});

