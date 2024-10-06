

$(document).ready(function() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:5007/read_login_2',
        data: JSON.stringify({ i: "i" }),
        contentType: "application/json; charset=utf-8",
        success: function(response) {
            if (response.success) {
                console.log("user access level is more than 2");
            } else {
                alert("user access authorise level is less than 2, didn't have access to modified the time of voting");
                window.location.href = "administration_setting_1.html";
            }
        },
        error: function(error) {
            console.error("Error:", error);
            alert("cannot to connect database, pls restart this system");
            window.location.href = "administration_selection.html";
        }
    });
    function fetchInformData() {
        return new Promise(function(resolve, reject) {
            $.get('http://localhost:5005/get_inform_data', function(response) {
                if (response.success) {
                    resolve(response);
                } else {
                    reject('Failed to fetch data');
                }
            }).fail(function() {
                reject('Error fetching data');
            });
        });
    }

    fetchInformData()
        .then(function(response) {
            $('#table_data').text(response.table);
        })
        .catch(function(error) {
            console.error(error);
        });

   var startTimePicker = $("#start-time").flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        altInput: true,
        altFormat: "F j, Y h:i K",
        time_24hr: true,
    });
    
    var endTimePicker = $("#end-time").flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        altInput: true,
        altFormat: "F j, Y h:i K",
        time_24hr: true,
    });

    $("#ok-button").click(function () {
        var startTime1 = startTimePicker.selectedDates[0];
        var endTime1 = endTimePicker.selectedDates[0];

        if (endTime1 <= startTime1) {
            alert("End Time must be greater than Start Time");
            return;
        }

        var startTime = startTimePicker.formatDate(startTime1, "Y-m-d H:i");
        var endTime = endTimePicker.formatDate(endTime1, "Y-m-d H:i");
        console.log("Formatted Start Time: ", startTime);
        console.log("Formatted End Time: ", endTime);

        var time = {
            id: 1,
            table_data: $('#table_data').text(),
            start_time: startTime,
            end_time: endTime,
        };

        $.ajax({
            url: 'http://localhost:5006/time_detail',
            type: 'POST',
            data: JSON.stringify(time),
            contentType: 'application/json;charset=UTF-8',
            success: function (response) {
                console.log('Response from backend:', response);
                alert("update successful");
            },
            error: function (error) {
                console.error('Error:', error);
                alert('failed update to mysql');
            }
        });
    });
    $("#upload-ads").click(function() {
        var folderName = $('#file_upload').val();

        $.ajax({
            type: 'POST',
            url: 'http://localhost:5006/image_file',
            data: JSON.stringify({ file: folderName }), 
            contentType: "application/json; charset=utf-8",
            success: function(response) {
                if (response.success) {
                    console.log("folder update successfully");
                    alert("file update successfully");
                } else {
                    console.log("fail to update folder");
                    alert("fail to update file, pls try again");
                }
            },
            error: function(error) {
                console.error("Error:", error);
                alert("cannot connect to the database, please restart this system");
                window.location.href = "administration_selection.html";
            }
        });
    });
    $('#back').click(function(){
        window.location.href = "administration_selection.html";
    });
});