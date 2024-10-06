const positionsSelect = $("#positions");
const candidatesSelect = $("#candidates");

// for loop for the position selection
for (let i = 1; i <= 30; i++) {
    positionsSelect.append($("<option></option>").attr("value", i).text(i));
}
// for loop for the candidate selection
for (let i = 1; i <= 60; i++) {
    candidatesSelect.append($("<option></option>").attr("value", i).text(i));
}
$(document).ready(function(){

    $.ajax({
        type: 'POST',
        url: 'http://localhost:5007/read_login_2',
        data: JSON.stringify({ i: "i" }),
        contentType: "application/json; charset=utf-8",
        success: function(response) {
            if (response.success) {
                console.log("user access level is more than 2");
            } else {
                alert("user access authorise level is less than 2, didn't have access to modified the Position and Candidate");
                window.location.href = "administration_setting_1.html";
            }
        },
        error: function(error) {
            console.error("Error:", error);
            alert("cannot to connect database, pls restart this system");
            window.location.href = "administration_selection.html";
        }
    });
    $("#confirmButton").click(function(){
        const selectedPositions = $("#positions").val();
        const selectedCandidates = $("#candidates").val();

       if (parseInt(selectedPositions) >= parseInt(selectedCandidates)) {
            alert("Please make sure the total number of positions is more than the total number of candidates");
            return;
        }
        function fetchData() {
            return new Promise(function(resolve, reject) {
                $.get('http://localhost:5005/get_table_data_candidate', function(table_data) {
                    resolve(table_data);
                });
            });
        }

        fetchData().then(function(table_data) {
            $('#table_data').text(table_data);
            
            const formData = {
                positions: selectedPositions,
                candidates: selectedCandidates,
                table_data: table_data
            };

            $.ajax({
                type: 'POST',
                url: 'http://localhost:5005/set_candidate', 
                data: JSON.stringify(formData),
                contentType: "application/json; charset=utf-8",
                success: function(response) {
                    console.log("Response from backend:", response);
                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:5005/create_voting',
                        data: JSON.stringify(response),
                        contentType: "application/json; charset=utf-8",
                        success: function(response) { 
                            console.log("success create voting database");
                        },
                        error: function(error) {
                            console.error("Error:", error);
                        }
                    });
                },
                error: function(error) {
                    console.error("Error:", error);
                    alert("wrong database");
                }
            });
        });
    });
});

$(document).ready(function(){
    $("#get_inform").click(function(){
        $.ajax({
            type: 'GET',
            url: 'http://localhost:5005/get_inform_data',
            success: function(response) {
                if (response.success) {
                    $('#table_data').text(response.table);
                    $('#position_count').text(response.position_count);
                    $('#candidate_count').text(response.candidate_count);
                    $('#status').text(response.status);
                } else {
                    alert('Please set up the candidate details.');
                }
            },
            error: function(error) {
                console.error("Error:", error);
                alert("Error fetching data.");
            }
        });
    });
    $('#back').click(function(){
        window.location.href = "administration_selection.html";
    });
});