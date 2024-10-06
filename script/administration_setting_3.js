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
                alert("user access authorise level is less than 2, didn't have access to modified the Candidate Detail");
                window.location.href = "administration_setting_1.html";
            }
        },
        error: function(error) {
            console.error("Error:", error);
            alert("cannot to connect database, pls restart this system");
            window.location.href = "administration_selection.html";
        }
    });
    // Get table name and number of candidates
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

    function populateCandidateSelect(count) {
        const candidateSelect = $('#candidate-no');
        for (let i = 1; i <= count; i++) {
            candidateSelect.append($('<option></option>').attr('value', i).text(i));
        }
    }

    fetchInformData()
        .then(function(response) {
            $('#table_data').text(response.table);
            $('#candidate_count').text(response.candidate_count);
            populateCandidateSelect(response.candidate_count);
        })
        .catch(function(error) {
            console.error(error);
            alert('Failed to fetch data. Please set up the candidate details.');
        });

    // Avatar preview
    const avatarInput = $('#avatar');
    const avatarPreview = $('#avatar-preview');

    avatarInput.on('change', function() {
        const file = avatarInput[0].files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarPreview.css('background-image', 'url(' + e.target.result + ')');
                avatarPreview.text('');
            };
            reader.readAsDataURL(file);
        } else {
            avatarPreview.css('background-image', 'none');
            avatarPreview.text('Click to choose an avatar');
        }
    });

    // Form submission
    //Declare a global variable to store the ID
let candidateId = 1;

// form submit event handler
$('#candidate-form').submit(function(event) {
    event.preventDefault();
    const avatar = $('#avatar').val();
    const id = $('#candidate-no').val();
    const name = $('#name').val();
    const class1 = $('#class1').val();
    const skills = $('#skills').val();
    const age = $('#age').val();
    const bio = $('#bio').val();

    if (!avatar || !name || !class1 || !skills || !age || !bio) {
        alert('Please insert all the information or insert again the image');
        return;
    }

    fetchInformData()
        .then(function(response) {
            // Store ID in global variable
            candidateId = id;
            
            var candidateDetail = {
                id: id,
                table_data: response.table,
                name: name,
                class1: class1,
                skills: skills,
                age: age,
                bio: bio
            };

            $.ajax({
                url: 'http://localhost:5006/candidate_detail',
                type: 'POST',
                data: JSON.stringify(candidateDetail),
                contentType: 'application/json;charset=UTF-8',
                success: function(response) {
                    console.log('Response from backend:', response);
                },
                error: function(error) {
                    console.error('Error:', error);
                    alert('Wrong database');
                }
            });
        })
        .catch(function(error) {
            console.error(error);
            alert('Failed to fetch data.');
        });
    const avatarInput = $('#avatar'); // Get the jQuery object from input box
    const avatarPreview = $('#avatar-preview');
    
    if (avatarInput[0].files.length > 0) {
        const file = avatarInput[0].files[0];
        const formData = new FormData();

        // Append the file to the FormData
        formData.append('avatar', file);

        // add ID into FormData
        formData.append('id', candidateId);

        // Send a POST request to upload the file
        $.ajax({
            type: 'POST',
            url: 'http://localhost:5006/upload_avatar', // Replace with your server endpoint
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                // Handle the success response here
                console.log('File uploaded successfully:', response);
                $('#avatar').val(''); 
                $('#name').val('');   
                $('#class1').val(''); 
                $('#skills').val('');  
                $('#age').val('');     
                $('#bio').val('');    

                var avatarPreview = $('#avatar-preview');
                avatarPreview.css('background-image', 'none');
                avatarPreview.text('Click to choose an avatar');

                var id = $('#candidate-no').val();
                // You can update the avatar preview or display a message
            },
            error: function(error) {
                // Handle the error response here
                console.error('Error uploading file:', error);
                // You can display an error message to the user
            }
        });
    } else {
        // Handle the case where no file is selected
        avatarPreview.css('background-image', 'none');
        avatarPreview.text('Click to choose an avatar');
    }
});

    // Read button click
    $('#readButton').click(function() {
        function fetchImage() {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:5006/get_image/' + candidateId,
                    success: function(data) {
                        resolve(data);
                    },
                    error: function(error) {
                        reject(error);
                    }
                });
            });
        }
    
        // Use Promise to get image data and display it
        fetchImage()
            .then(function(path) {
                setTimeout(function(){
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
                    })
                },500)
            .catch(function(error) {
                console.error('Error:', error);
                
            });
        $.ajax({
            type: 'GET',
            url: 'http://localhost:5006/get_inform_candidate/'+ candidateId,
            success: function(response) {
                if (response.success) {
                    //After successfully obtaining the data, display the data in the corresponding label
                    $('#name').val(response.name);
                    $('#class1').val(response.class1);
                    $('#skills').val(response.skills);
                    $('#age').val(response.age);
                    $('#bio').val(response.bio)
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
    $('#candidate-no').change(function(){
        // Clear all input fields in the form

        $('#avatar').val(''); 
        $('#name').val('');   
        $('#class1').val(''); 
        $('#skills').val('');  
        $('#age').val('');     
        $('#bio').val('');    

        var avatarPreview = $('#avatar-preview');
        avatarPreview.css('background-image', 'none');
        avatarPreview.text('Click to choose an avatar');

        var id = $('#candidate-no').val();
        console.log('Selected candidate ID:', id); // debug output
        candidateId = id; // Update candidateId variable
    });
    $('#back').click(function(){
        window.location.href = "administration_selection.html";
    });
});