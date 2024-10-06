$(document).ready(function(){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:5007/read_login_1',
        data: JSON.stringify({ i: "i" }),
        contentType: "application/json; charset=utf-8",
        success: function(response) {
            if (response.success) {
                console.log("the highest user access level");
            } else {
                alert("not the highest user access level, didn't have access to add another administration");
                window.location.href = "administration_selection.html";
            }
        },
        error: function(error) {
            console.error("Error:", error);
            alert("cannot to connect database, pls restart this system");
            window.location.href = "administration_selection.html";
        }
    });

    $('#administration-form').submit(function(event) {
        event.preventDefault();
        const name = $('#name').val();
        const password1 = $('#password1').val();
        const password2 = $('#password2').val();
        const level = $('#level').val();
    
        if (!name || !password1 || !password2 || !level) {
            alert('Please insert all the information!!!');
            return;
        }

        if (password1 !== password2){
            alert('Password not match')
            return;
        }
        
        var administrationDetail = {
            name:name,
            password:password1,
            level:level
        };
        $.ajax({
            url: 'http://localhost:5004/administration_detail',
            type: 'POST',
            data: JSON.stringify(administrationDetail),
            contentType: 'application/json;charset=UTF-8',
            success: function(response) {
                console.log('Response from backend:', response);
                alert("Create Administration Successful");
                $('#name').val('');
                $('#password1').val('');
                $('#password2').val('');
            },
            error: function(error) {
                console.error('Error:', error);
                alert('database error, duplicate administration name');
            }
        });
    });
    $('#clear').click(function(){
        $('#name').val('');
        $('#password1').val('');
        $('#password2').val('');
    });
    $('#back').click(function(){
        window.location.href = "administration_selection.html";
    });
});