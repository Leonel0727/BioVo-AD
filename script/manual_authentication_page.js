$(document).ready(function () {

    $('#exitButton').click(function () {
      window.location.href = "voter_start.html";
    });

    $('#authForm').submit(function (event) {
      event.preventDefault(); // Prevent the default form submission behavior

      var username = $("#username").val();
      var password = $("#password").val();

      if (!username || !password) {
        alert("Please enter both username and password.");
        return;
      };

      var userData = {
        username: username,
        password: password
      };

      $.ajax({
        url: "http://localhost:5003/administration_login",
        type: "POST",
        data: JSON.stringify(userData),
        contentType: "application/json;charset=UTF-8",
        success: function (response) {
          if (response.message === "Login successful") {
            console.log("Login successful:", response);
            window.location.href = "Voting.html";
          } else {
            alert("Login failed: Invalid credentials. Please click 'Exit' if not as an administrator.")
          }
        },
        error: function (error) {
          alert("Unable to connect to the database. Make sure MySQL is running and connected to the server.")
          console.error("Error:", error);
        }
      });
    });
  });