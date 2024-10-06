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
            window.location.href = "administration_selection.html";
        }
    },
    error: function(error) {
        console.error("Error:", error);
        alert("cannot to connect database, pls restart this system");
        window.location.href = "administration_selection.html";
    }
  });

  $("#showDatabasesButton").click(function() {
    $.ajax({
      url: "http://localhost:5005/show_tables",
      type: "GET",
      success: function(response) {
        var tableList = $("#databaseList");
        tableList.empty();

        response.tables.forEach(function(table) {
          var listItem = $("<li>").text(table);
          tableList.append(listItem);
        });
      },
      error: function(error) {
        console.error("Error:", error);
      }
    });
  });
  $("#modifiedButton_candidate").click(function() {
    var tableName = $("#databaseFile_candidate").val();
    $.ajax({
      url: "http://localhost:5005/find_table",
      type: "POST",
      data: JSON.stringify({ tableName: tableName }),
      contentType: "application/json; charset=utf-8",
      success: function(response) {
        if (response.success) {
          $.ajax({
            type: 'POST',
            url: 'http://localhost:5005/delete_table_candidate',
            success: function(response) {
              console.log('JSON delete successful or file inexistence');
            }
          });
          $.ajax({
            type: 'POST',
            url: 'http://localhost:5005/create_json_candidate',
            data: JSON.stringify({ tableName: tableName }),
            contentType: "application/json; charset=utf-8",
            success: function(response) {
              if (response.success) {
                console.log("success create json temporary file");
              } else {
                alert("fail create file pls restart application");
              }
            }
          });

          alert("Table is in the database, can continue the operation");
          $("#databaseFile_candidate").val("");
        } else {
          alert("Table not in the database pls create the database.");
          $("#databaseFile_candidate").val("");
        }
      },
      error: function(error) {
        console.error("Error:", error);
        alert("Error creating table.");
      }
    });
  });

  $("#modifiedButton_voter").click(function() {
    var tableName = $("#databaseFile_voter").val();
    $.ajax({
      url: "http://localhost:5005/find_table",
      type: "POST",
      data: JSON.stringify({ tableName: tableName }),
      contentType: "application/json; charset=utf-8",
      success: function(response) {
        if (response.success) {
          $.ajax({
            type: 'POST',
            url: 'http://localhost:5005/delete_table_voter',
            success: function(response) {
              console.log('JSON delete successful or file inexistence');
            }
          });
          $.ajax({
            type: 'POST',
            url: 'http://localhost:5005/create_json_voter',
            data: JSON.stringify({ tableName: tableName }),
            contentType: "application/json; charset=utf-8",
            success: function(response) {
              if (response.success) {
                console.log("success create json temporary file");
              } else {
                alert("fail create file pls restart application");
              }
            }
          });

          alert("Voter Table is in the database, can continue the operation");
          $("#databaseFile_voter").val("");
        } else {
          alert("Table not in the database pls create the database.");
          $("#databaseFile_voter").val("");
        }
      },
      error: function(error) {
        console.error("Error:", error);
        alert("Error creating table.");
      }
    });
  });
    $("#modifiedButton_voting").click(function() {
      var tableName = $("#databaseFile_voting").val();
      $.ajax({
        url: "http://localhost:5005/find_table",
        type: "POST",
        data: JSON.stringify({ tableName: tableName }),
        contentType: "application/json; charset=utf-8",
        success: function(response) {
          if (response.success) {
            $.ajax({
              type: 'POST',
              url: 'http://localhost:5005/delete_table_voting',
              success: function(response) {
                console.log('JSON delete successful or file inexistence');
              }
            });
            $.ajax({
              type: 'POST',
              url: 'http://localhost:5005/create_json_voting',
              data: JSON.stringify({ tableName: tableName }),
              contentType: "application/json; charset=utf-8",
              success: function(response) {
                if (response.success) {
                  console.log("success create json temporary file");
                } else {
                  alert("fail create file pls restart application");
                }
              }
            });
  
            alert("voting Table is in the database, can continue the operation");
            $("#databaseFile_voting").val("");
          } else {
            alert("Voting Table not in the database pls create the database.");
            $("#databaseFile_voting").val("");
          }
        },
        error: function(error) {
          console.error("Error:", error);
          alert("Error creating table.");
        }
      });
    });
  $("#createButton_candidate").click(function() {
    var tableName = $("#databaseFile_candidate").val();
    $.ajax({
      url: "http://localhost:5005/create_table_candidate",
      type: "POST",
      data: JSON.stringify({ tableName: tableName }),
      contentType: "application/json; charset=utf-8",
      success: function(response) {
        if (response.success) {
          alert("Table created successfully.");
          $.ajax({
            type: 'POST',
            url: 'http://localhost:5005/delete_table_candidate',
            success: function(response) {
              console.log('JSON delete successful or file inexistence');
            }
          });
          $.ajax({
            type: 'POST',
            url: 'http://localhost:5005/create_json_candidate',
            data: JSON.stringify({ tableName: tableName }),
            contentType: "application/json; charset=utf-8",
            success: function(response) {
              if (response.success) {
                console.log("success create json temporary file");
                $("#databaseFile_candidate").val("");
              } else {
                alert("fail create temporary file pls restart application");
              }
            }
          });
        } else {
          alert("Table creation failed.");
          $("#databaseFile_candidate").val("");
        }
      },
      error: function(error) {
        console.error("Error:", error);
        alert("Error creating table.");
      }
    });
  });
  $("#createButton_voter").click(function() {
    var tableName = $("#databaseFile_voter").val();
    $.ajax({
      url: "http://localhost:5005/create_table_voter",
      type: "POST",
      data: JSON.stringify({ tableName: tableName }),
      contentType: "application/json; charset=utf-8",
      success: function(response) {
        if (response.success) {
          alert("Table voter created successfully.");
          $.ajax({
            type: 'POST',
            url: 'http://localhost:5005/delete_table_voter',
            success: function(response) {
              console.log('JSON delete successful or file inexistence');
            }
          });
          $.ajax({
            type: 'POST',
            url: 'http://localhost:5005/create_json_voter',
            data: JSON.stringify({ tableName: tableName }),
            contentType: "application/json; charset=utf-8",
            success: function(response) {
              if (response.success) {
                console.log("success create json temporary file");
                $("#databaseFile_voter").val("");
              } else {
                alert("fail create temporary file pls restart application");
                $("#databaseFile_voter").val("");
              }
            }
          });
        } else {
          alert("Table voter creation failed.");
          $("#databaseFile_voter").val("");
        }
      },
      error: function(error) {
        console.error("Error:", error);
        alert("Error creating table.");
      }
    });
  });
  $("#createButton_voting").click(function() {
    var tableName = $("#databaseFile_voting").val();
    $.ajax({
      url: "http://localhost:5005/create_table_voting",
      type: "POST",
      data: JSON.stringify({ tableName: tableName }),
      contentType: "application/json; charset=utf-8",
      success: function(response) {
        if (response.success) {
          alert("Table voting created successfully.");
          $.ajax({
            type: 'POST',
            url: 'http://localhost:5005/delete_table_voting',
            success: function(response) {
              console.log('JSON delete successful or file inexistence');
            }
          });
          $.ajax({
            type: 'POST',
            url: 'http://localhost:5005/create_json_voting',
            data: JSON.stringify({ tableName: tableName }),
            contentType: "application/json; charset=utf-8",
            success: function(response) {
              if (response.success) {
                console.log("success create voting json temporary file");
                $("#databaseFile_voting").val("");
              } else {
                alert("voting data fail create temporary file pls restart application");
                $("#databaseFile_voting").val("");
              }
            }
          });
        } else {
          alert("Table voter creation failed.");
          $("#databaseFile_voting").val("");
        }
      },
      error: function(error) {
        console.error("Error:", error);
        alert("Error creating table.");
      }
    });
  });
});
$(document).ready(function(){
  $("#refresh_candidate").click(function(){
    function fetchData() {
      return new Promise(function(resolve, reject) {
          $.get('http://localhost:5005/get_table_data_candidate', function(table_data) {
              resolve(table_data);
          });
      });
  }

  fetchData().then(function(table_data) {
      // direct display data
      $('#databaseName_candidate').text(table_data);
  });
  });
});
$(document).ready(function(){
  $("#refresh_voter").click(function(){
    function fetchData() {
      return new Promise(function(resolve, reject) {
          $.get('http://localhost:5005/get_table_data_voter', function(table_data) {
              resolve(table_data);
          });
      });
  }
  fetchData().then(function(table_data) {
      // direct display data
      $('#databaseName_voter').text(table_data);
  });
  });
});

$(document).ready(function(){
  $("#refresh_voting").click(function(){
    function fetchData() {
      return new Promise(function(resolve, reject) {
          $.get('http://localhost:5005/get_table_data_voting', function(table_data) {
              resolve(table_data);
          });
      });
  }
  fetchData().then(function(table_data) {
      // direct display data
      $('#databaseName_voting').text(table_data);
  });
  });
  $('#back').click(function(){
    window.location.href = "administration_selection.html";
});
});