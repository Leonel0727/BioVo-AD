$(document).ready(function() {
    const $barcodeInput = $("#barcode-input");
    const $result = $("#result");
    const $successAudio = $("#success-audio");
    const $barcodeDataField = $("#barcode-data");

    $barcodeInput.on("input", function() {
        const barcodeValue = $barcodeInput.val().trim();
        if (barcodeValue.length === 12) {
            $successAudio[0].play();
            var bar =$("#barcode-input").val();
            var data = {
                bar: bar
            };
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:5021/id_search_record", 
                data: JSON.stringify(data),
                contentType: "application/json;charset=UTF-8",
                success: function(response) {
                    if (response.message === "Successful") {
                        $result.text(`Scan successfully: ${barcodeValue}`);
                        $barcodeDataField.val(barcodeValue);
                        $barcodeInput.val("");
                        window.location.href = "biometric_authentication.html";
                        console.log(bar + " have record in the database");
                    } else {
                        $barcodeInput.val("");
                        alert(JSON.stringify(response));
                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                    // Handle any errors that occur during the AJAX request
                    alert("Didn't have record in the database, please try again");
                    console.log("Error: " + errorThrown);
                }
            });
        } else {
            console.log("database connect failed");
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
          } else {
            console.log("fail delete file");
          }
        }
    });
    $("#manually").click(function () {
        window.location.href = "manual_authentication_page.html";
    });
});
