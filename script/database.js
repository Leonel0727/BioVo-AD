$(document).ready(function () {
    console.log("Document is ready");
    document.getElementById("backButton").addEventListener("click", function() {
        window.location.href = "first.html"; 
    });
    $("#submitButton").click(function (e) {
        e.preventDefault(); // Prevent the default form submission
        
        // Get the input values
        var dbHost = $("#dbHost").val();
        var dbUser = $("#dbUser").val();
        var dbPasswd = $("#dbPasswd").val();
        var dbdatabase = $("#dbdatabase").val();

        if (!dbHost || !dbUser || !dbPasswd || !dbdatabase) {
            alert("Please enter all database information.");
            return;
          }

        // Create an object to hold the data
        var data = {
            dbHost: dbHost,
            dbUser: dbUser,
            dbPasswd: dbPasswd,
            dbdatabase: dbdatabase
        };

        // Send the data to the Python server using AJAX
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:5007/create_database", 
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (response) {
                console.log("database test successful!");
                $.ajax({
                    type: "POST",
                    url: "http://127.0.0.1:5007/delete_database_table", // Replace with the actual URL of your Python endpoint
                    success: function (response) {
                        // Handle the success response from the server
                        console.log('JSON delete successful or file inexistence');
                        if(response.success){
                            $.ajax({
                                type:"POST",
                                url: "http://127.0.0.1:5007/database_info",
                                data: JSON.stringify(data),
                                contentType: "application/json",
                                success: function (response) {
                                    if (response.success) {
                                        $.ajax({
                                            url: 'http://127.0.0.1:5005/db_res',  
                                            type: 'GET',
                                            data: "null",
                                            success: function(response) {
                                                console.log(response);
                                            },
                                            error: function(error) {
                                                console.error(error);
                                            }
                                        });
                                        $.ajax({
                                            url: 'http://127.0.0.1:5006/db_res',  
                                            type: 'GET',
                                            data: "null",
                                            success: function(response) {
                                                console.log(response);
                                            },
                                            error: function(error) {
                                                console.error(error);
                                            }
                                        });
                                        $.ajax({
                                            url: 'http://127.0.0.1:5007/db_res',  
                                            type: 'GET',
                                            data: "null",
                                            success: function(response) {
                                                console.log(response);
                                            },
                                            error: function(error) {
                                                console.error(error);
                                            }
                                        });
                                        $.ajax({
                                            url: 'http://127.0.0.1:5021/db_res',  
                                            type: 'GET',
                                            data: "null",
                                            success: function(response) {
                                                console.log(response);
                                            },
                                            error: function(error) {
                                                console.error(error);
                                            }
                                        });
                                        $.ajax({
                                            url: 'http://127.0.0.1:5056/db_res',  
                                            type: 'GET',
                                            data: "null",
                                            success: function(response) {
                                                console.log(response);
                                            },
                                            error: function(error) {
                                                console.error(error);
                                            }
                                        });
                                        console.log("json file create successful");
                                        alert("Data sent successfully!");
                                        window.location.href = "first.html";
                                    } else {
                                        console.log("json file create failed");
                                        $("#dbHost").val('');
                                        $("#dbUser").val('');
                                        $("#dbPasswd").val('');
                                        $("#dbdatabase").val('');
                                        alert("DATABASE CONNECT FAILED PLS CONFIRM ALL INFORMATION ARE CORRECT, AND MYSQL AT EXECUTE STATUS AND DATABASE ARE CREATE");
                                    }
                                },
                                error: function (xhr, textStatus, errorThrown) {
                                    // Handle any errors that occur during the AJAX request
                                    alert("Error: " + errorThrown);
                                }
                                });
                        }else{
                            alert("DATABASE CONNECT FAILED PLS CONFIRM ALL INFORMATION ARE CORRECT, AND MYSQL AT EXECUTE STATUS AND DATABASE ARE CREATE");
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        // Handle any errors that occur during the AJAX request
                        alert("Error: " + errorThrown);
                    }
                });
            },error: function (xhr, textStatus, errorThrown) {
            // Handle any errors that occur during the AJAX request
            alert("Error: " + errorThrown);
        }
    });
    });
});