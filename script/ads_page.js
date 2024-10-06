$(document).ready(function(){
    $('#ad-container').css({
        'background-image': 'url("image/1.png")',
        'background-size': '1050px 700px'
    });

    $.ajax({
        type: 'POST',
        url: 'http://localhost:5007/read_image_total',
        data: false,
        contentType: "application/json; charset=utf-8",
        success: function(response) {
            var total = response.total;
            var imagesLoaded = 0;
    
            function changeImage(currentImage) {
                $('#ad-container').css({
                    'background-image': 'url("image/' + currentImage + '.png")',
                    'background-size': '1050px 700px'
                });
    
                imagesLoaded++;
    
                if (imagesLoaded >= total) {
                    location.reload(true);
                }
            }
    
            for (var j = 1; j <= total; j++) {
                setTimeout(changeImage, 5000 * j, j + 1);
            }
        },
        error: function() {
            console.error('AJAX request error');
        }
    });
    
    $.ajax({
        type: 'POST',
        url: 'http://localhost:5056/delete_temporary_file',
        data: false,
        contentType: "application/json; charset=utf-8",
        success: function(response) {
          if (response.success) {
            console.log("success create json temporary file");
            window.close();
            window.open('voter_start.html');
          } else {
            console.log("fail delete file ");
          }
        }
    });
});