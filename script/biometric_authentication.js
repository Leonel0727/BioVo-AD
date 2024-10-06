$(document).ready(function(){
    function fetchImage() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: 'GET',
                url: 'http://localhost:5021/user_image',
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
            }, 500);
        })
        .catch(function(error) {
            console.error('Error:', error);
            alert('Error fetching image.');
        });
        
    $('#verifyButton').click(function(){
        // When the "Verify" button is clicked, make an AJAX request to start face recognition.
        $.ajax({
            type: "POST",
            url: "http://localhost:5021/start_img_1",  
            contentType: "application/x-www-form-urlencoded",
            success: function(data) {
                window.location.href = "User_detail.html"
            },
              error: function(error) {
                //window.location.href = "fail_detection.html"
                console.error("Error:", error);
                alert("Error fetching data.");
            }
        });
    });
});

// 获取用户媒体设备（摄像头）
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        const video = document.getElementById('webcam');
        video.srcObject = stream;
        video.play();
    })
    .catch((error) => {
        console.error('Error accessing webcam:', error);
    });

// 捕获照片
let co =5;
$("#chance").text(co)
document.getElementById('captureBtn').addEventListener('click', () => {
    co= co-1;
    $("#chance").text(co)
    if (co<0){
        alert("You didn't have any chance to capture again");
        window.location.href = "voter_start.html"
    }else{
        captureAndSend();
    }
    setTimeout(function() {
        startCountdown(3); 
    }, 50);
    
});

// 捕获并发送照片
function captureAndSend() {
    const video = document.getElementById('webcam');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // 将视频帧绘制到canvas上
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 将canvas转换为图像数据URL
    const imageDataURL = canvas.toDataURL('image/png');

    // 检查图像清晰度
    if (isImageClear(imageDataURL)) {
        // 发送图像数据
        sendImage(imageDataURL);
    } else {
        alert('Image is blurry. Please try again.');
    }
}

// 简单的图像清晰度检查
function isImageClear(imageDataURL) {
    // 在此实现你的图像清晰度检查逻辑，这里简单地返回true
    return true;
}

// 发送图像数据到服务器
function sendImage(imageDataURL) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:5056/bhg_image',
        data: { imageDataURL: imageDataURL },
        success: function(response) {
            console.log('Image sent successfully:', response.message);
            var fds = response.message+" %";
            $("#similarity").text(fds);
            if(response.message>75){
                setTimeout(function() {
                    window.location.href = "User_detail.html";
                }, 1000);
            }
        },
        error: function(error) {
            console.error('Error sending image:', error);
        }
    });
}

function startCountdown(seconds) {
        var countdownElement = $("#countdown");

        var interval = setInterval(function () {
            countdownElement.text(seconds + " sec");

            if (seconds === 0) {
                clearInterval(interval);
                countdownElement.text("--");
            } else {
                seconds--;
            }
        }, 1000);
    }