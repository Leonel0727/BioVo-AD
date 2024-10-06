$(document).ready(function(){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:5007/read_login_3',
        data: JSON.stringify({ i: "i" }),
        contentType: "application/json; charset=utf-8",
        success: function(response) {
            if (response.success) {
                console.log("user access level is more than 3");
            } else {
                alert("user access authorise level is less than 3, didn't have access to add voter");
                window.location.href = "first.html";
            }
        },
        error: function(error) {
            console.error("Error:", error);
            alert("cannot to connect database, pls restart this system");
            window.location.href = "first.html";
        }
    });
    function fetchInformData() {
        return new Promise(function(resolve, reject) {
            $.get('http://localhost:5021/get_voter_data', function(response) {
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
            alert('Failed to fetch data. Please set up the voter details.');
        });
    
    // Avatar preview
    const avatarInput = $('#avatar');
    const avatarPreview = $('#avatar-preview');
    avatarInput.on('change', function() {
        const file = avatarInput[0].files[0];

        if (file) {
            const maxFileSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxFileSize) {
                console.log('File is too large. Please select a smaller file.');
                return;
            }
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

    $('#voter-form').submit(function(event) {
        event.preventDefault();
        const avatar = $('#avatar').val();
        const matric = $('#matric').val();
        const name = $('#name').val();
        const class1 = $('#class1').val();
        const email = $('#email').val();
        const icno = $('#icno').val();
    
        if (!avatar || !name || !class1 || !matric || !email || !icno) {
            alert('Please insert all the information!!!');
            return;
        }
    
        const avatarInput = $('#avatar'); // Get the jQuery object from the input box
        const avatarPreview = $('#avatar-preview');
    
        if (avatarInput[0].files.length > 0) {
            const file = avatarInput[0].files[0];
            const maxFileSize = 5 * 1024 * 1024; // 5MB
    
            if (file.size > maxFileSize) {
                console.log('File is too large. Please select a smaller file.');
                return;
            }
    
            fetchInformData()
                .then(function(response) {
                    const formDataForUpload = new FormData();
                    formDataForUpload.append('avatar', file);
                    formDataForUpload.append('matric', matric);
                    formDataForUpload.append('icno', icno);
                    formDataForUpload.append('table_data', response.table);
                    formDataForUpload.append('name', name);
                    formDataForUpload.append('class1', class1);
                    formDataForUpload.append('email', email);
    
                    $.ajax({
                        url: 'http://localhost:5021/voter_detail',
                        type: 'POST',
                        data: formDataForUpload,
                        processData: false,
                        contentType: false, // 必须设置为 false
                        success: function(response) {
                            console.log('Response from backend:', response);
                            $('#avatar').val(''); 
                            $('#name').val('');   
                            $('#class1').val(''); 
                            $('#email').val('');  
                            $('#status').val('');     
                            $('#matric').val(''); 
                            $('#matric1').val('');   
                            $('#icno').val('');
                            var avatarPreview = $('#avatar-preview');
                            avatarPreview.css('background-image', 'none');
                            avatarPreview.text('Click to choose an avatar');
                        },
                        error: function(error) {
                            console.error('Error:', error);
                            alert('Wrong database:', response.message);
                        }
                    });
                })
                .catch(function(error) {
                    console.error(error);
                    alert('Failed to fetch data.');
                });
        } else {
            // Handle the case where no file is selected
            avatarPreview.css('background-image', 'none');
            avatarPreview.text('Click to choose an avatar');
        }
    });
    $('#clear,#clear1').click(function(){
        $('#avatar').val(''); 
        $('#name').val('');   
        $('#class1').val(''); 
        $('#email').val('');  
        $('#status').val('');     
        $('#matric').val(''); 
        $('#matric1').val('');   
        $('#icno').val('');

        var avatarPreview = $('#avatar-preview');
        avatarPreview.css('background-image', 'none');
        avatarPreview.text('Click to choose an avatar');
    });

    $('#readButton').click(function() {
        const matric = $('#matric1').val();
    
        function fetchImage() {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:5021/get_image_voter',
                    data: JSON.stringify({ matric: matric }),
                    contentType: 'application/json',
                    success: function(data) {
                        resolve(data);
                    },
                    error: function(error) {
                        reject(error);
                    }
                });
            });
        }
    
        
        fetchImage()
            .then(function(data) {
                if (data.path) {
                    
                    var img = new Image();
                    img.src = data.path;
                    img.alt = 'Image';
                    img.style.maxWidth = '320px';
                    img.style.maxHeight = '320px';
    
                    $('#avatar-preview').empty().append(img);
                } else {
                    console.error('Invalid image path.');
                    alert('Error fetching image: Invalid image path.');
                }
            })
            .catch(function(error) {
                console.error('Error:', error);
            });
    
        $.ajax({
            type: 'POST',  // Change this line to use POST method
            url: 'http://localhost:5021/get_inform_voter',
            data: JSON.stringify({ matric: matric }),
            contentType: 'application/json',
            crossDomain: true, 
            success: function(response) {
                if (response.success) {
                    $('#matric').val(response.matric);
                    $('#name').val(response.name);
                    $('#email').val(response.email);
                    $('#class1').val(response.class);
                    $('#status').text(response.status);
                    $('#icno').val(response.ic);
                } else {
                    alert('Please set up the VOTER details.');
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