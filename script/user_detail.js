$(document).ready(async function() {
    let status = 'n';
let barcode = 'n';

function fetchImage() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:5021/user_image',
            success: function (data) {
                resolve(data);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

// Use Promise to get image data and display it
fetchImage()
    .then(function (path) {
        setTimeout(function () {
            if (path) {
                // display image
                var img = new Image();
                img.src = path; // Use the returned file path
                img.alt = 'Image';

                // Set the maximum width and maximum height of the image to 320 pixels
                img.style.maxWidth = '320px';
                img.style.maxHeight = '320px';

                // Replace the content of the image preview area with an image
                $('#avatar-preview').empty().append(img);
            } else {
                console.error('Invalid image path.');
                alert('Error fetching image: Invalid image path.');
            }
        }, 300);
    })
    .catch(function (error) {
        console.error('Error:', error);
        alert('Error fetching image.');
    });
    $.ajax({
        type: 'GET',
        url: 'http://localhost:5021/get_inform_voter',
        data: false,
        success: function(response) {
            if (response.success) {
                $('#name').text(response.name);
                $('#matric').text(response.matric);
                $('#email').text(response.email);
                $('#class').text(response.class);
                $('#status').text(response.status);
                status = response.status;
                barcode = response.matric;
            } else {
                alert('Please set up the VOTER details.'+response.message);
            }
        },
        error: function(error) {
            console.error("Error:", error);
            alert("Error fetching data.");
        }
    });
$("#is-me-button").click(function () {
    if (status === "no") {
        const user_data = {
            matric: barcode // Changed 'bar' to 'matric' to match the server-side code
        }
        $.ajax({
            type: 'POST',
            url: 'http://localhost:5021/update_status',
            data: JSON.stringify(user_data),
            contentType: 'application/json;charset=UTF-8',
            success: function (response) {
                if (response.success) {
                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:5056/file_json',
                        data: false,
                        contentType:false,
                        success: function (response) {
                            if (response.success) {
                                console.log("success delete and create json");
                            } else {
                                console.log("fail update status to database");
                            }
                        }
                    })
                    window.location.href = "Voting.html";
                } else {
                    console.log("fail update status to database")
                }
            }
        });
    } else {
        alert("you already voted");
        window.location.href = "ID_Authentication.html";
    }
});
});