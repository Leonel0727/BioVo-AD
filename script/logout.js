$(document).ready(function(){
    $('#logout').click(function(){
        data = {
            i: 'i'
        }
        $.ajax({
            type:'POST',
            url: 'http://localhost:5007/create_ads_image',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function(response) {
                console.log("Response from backend (candidate images):", response);
            },
            error: function(error) {
                console.error("Error (candidate images):", error);
            }
        });
        $.ajax({
            type:'POST',
            url: 'http://localhost:5007/get_time',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function(response) {
                console.log("Response from backend (candidate images):", response);
            },
            error: function(error) {
                console.error("Error (candidate images):", error);
            }
        });
        // First AJAX request to get candidate images
        setTimeout(function() {
            $.ajax({
                type: 'POST',
                url: 'http://localhost:5007/create_candidate_image', 
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                success: function(response) {
                    console.log("Response from backend (candidate images):", response);
                    
                    // Second AJAX request to delete login and redirect
                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:5007/delete_login', 
                        data: JSON.stringify(data),
                        contentType: "application/json; charset=utf-8",
                        success: function(response) {
                            console.log("Response from backend (delete login):", response);
                            window.location.href = "first.html";
                        },
                        error: function(error) {
                            console.error("Error (delete login):", error);
                            alert("Error deleting login");
                        }
                    });
                },
                error: function(error) {
                    console.error("Error (candidate images):", error);
                }
            });
        },50);
        
    });
});