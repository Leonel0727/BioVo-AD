$(document).ready(function() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:5056/read_time',
        data: JSON.stringify({ i: "i" }),
        contentType: "application/json; charset=utf-8",
        success: function(response) {
            if (response.success) {
                var start = response.start;
                var end = response.end;
                console.log(start, end);
                $("#start_time").text(start);
                $("#end_time").text(end);
    
                var first_start = start.slice(0, 10);
                var last_start = start.slice(-5);
                const startTime = new Date(first_start + "T" + last_start + ":00");
    
                var first_end = end.slice(0, 10);
                var last_end = end.slice(-5);
                const endTime = new Date(first_end + "T" + last_end + ":00");

                function timerefresh(){
                    const now = new Date();
                    if (now < startTime) {
                        updateCountdown(now, startTime,1);
                    } else if (now > startTime && now < endTime) {
                        window.location.href = "ID_Authentication.html";
                    } else if (now > endTime){
                        updateCountdown(endTime, now,2);
                    } else {
                        console.log("error time format get from database");
                    }
                }
                    
                function updateCountdown(currentTime, targetTime, method) {
                    const timeDifference = targetTime - currentTime;
    
                    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                    if (method == 1) {
                        status1="Countdown:";
                    } else {
                        status1="Time is Over:";
                    }
                    $("#time_container #status").text(status1);
                    $("#time_container #days").text(`Days: ${days}`);
                    $("#time_container #hours").text(`Hours: ${hours}`);
                    $("#time_container #minutes").text(`Minutes: ${minutes}`);
                    $("#time_container #seconds").text(`Seconds: ${seconds}`);
                }
                setInterval(function() {
                    timerefresh();
                }, 1000);
            } else {
                alert("Didn't set up start time and end time");
            }
        },
        error: function(error) {
            console.error("Error:", error);
            alert("Cannot connect to the database, please restart this system");
        }
    });
});