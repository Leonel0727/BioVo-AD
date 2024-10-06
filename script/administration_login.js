
$(document).ready(function() {
  $("#login-form").submit(function(event) {
    // prevent the default submit behavior of a form
    event.preventDefault();

    var username = $("#username").val();
    var password = $("#password").val();

    // Check if username and password have been enter
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    // Create a data object containing username and password
    var userData = {
      username: username,
      password: password
    };

    //Send AJAX request
    $.ajax({
      url: "http://localhost:5003/administration_login", //relative path
      type: "POST", // The request type is "POST"
      data: JSON.stringify(userData), // Convert user data into JSON format and send
      contentType: "application/json;charset=UTF-8", // The request content type is JSON
      success: function(response) {
        if(response.message === "Login successful"){
          console.log("Login successful:", response);
          $("#message").text("Login successful");
          window.location.href = "administration_selection.html";
        }else{
          $("#message").text("Login failed: Invalid credentials");
          alert("Login failed: Invalid credentials")
        }
      },
      error: function(error) {
        // handles error
        alert("cannot connect database makesure open mysql and connect to server")
        console.error("Error:", error);
      }
    });
  });
  $('#back').click(function(){
    window.location.href = "first.html";
  });
});

  
  
$(document).ready(function() {
  $("#reset-password").on("click", function () {
      // Update the URL to your reset password page
      window.location.href = "administration_reset_pass.html";
  });
});

