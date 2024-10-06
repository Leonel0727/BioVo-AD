$(document).ready(function(){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:5006/position_count',
        data: false,
        contentType: false,
        success: function(response) {
            console.log("No position from backend:", response.position);
            totalPages = response.position;
            totalCandidates = response.candidate;
            let selected_num = null;
            let selected_num2 = null;
            function showPage(pageNumber,lastPage) {
                selected_num2 = null;
                selected_num = null;
                check(pageNumber)
                    .then(function (result) {
                        if (result !== null) {
                            selected_num2 = result;
                            console.log("Selected Number 2: " + selected_num2);
                        } else {
                            console.log("An error occurred 2.");
                        }
                    })
                    .catch(function (error) {
                        console.log("An error occurred 2: " + error);
                    });
                check2(pageNumber)
                    .then(function (result) {
                        if (result !== null) {
                            selected_num = result;
                            console.log("Selected Number 1: " + selected_num);
                        } else {
                            console.log("An error occurred 1.");
                        }
                    })
                    .catch(function (error) {
                        console.log("An error occurred 1: " + error);
                    });
                $('.page').hide();
                $("#page" + lastPage).remove();
                display(pageNumber);
                $('#page' + pageNumber).show();
                console.log("pg:" + pageNumber);
            }
    
            function check(num) {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:5056/read_voting_status',
                        data: JSON.stringify({ i: num }),
                        contentType: "application/json; charset=utf-8",
                        success: function (response) {
                            if (response.success) {
                                var num2 = response.num1;
                                console.log("response from backend num2 5:" + num2);
                                resolve(num2);
                            } else {
                                console.log("error from backend:" + response.message);
                                reject(null);
                            }
                        },
                        error: function () {
                            console.log("Error: cannot read temporary file ");
                            reject("Error: cannot read temporary file");;
                        }
                    });
                });
            }
    
            function check2(num) {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:5056/read_voting_status',
                        data: JSON.stringify({ i: num }),
                        contentType: "application/json; charset=utf-8",
                        success: function (response) {
                            if (response.success) {
                                var selected_num = response.num;
                                console.log("response from backend selected_number 3:" + selected_num);
                                resolve(selected_num);
                            } else {
                                console.log("error from backend:" + response.message);
                                reject(null);
                            }
                        },
                        error: function () {
                            console.log("Error: cannot read temporary file");
                            reject(null);
                        }
                    });
                });
            }
            let pageContainer = $('#pageContainer');
            function display(i){
                (function(i) {
                    var page = $('<div></div>');
                    page.addClass('page');
                    page.attr('id', 'page' + i);
                    //page.css('background-color', 'lightgray');
                    page.css('padding', '20px');
                    page.css('margin', '10px');
                    var content = $('<p></p>');
                    content.text('You can cast your votes for up to ' + totalPages +' candidates out of a total of '+ totalCandidates +" according to the positions");
                    content.css('font-family', 'Arial, sans-serif');
                    content.css('font-size', '25px');
                    content.css('text-align', 'center');
                    var content2 = $('<p></p>');
                    content2.text('Position ' + i +' / '+ totalPages);
                    content2.css('font-family', 'Arial, sans-serif');
                    content2.css('font-size', '25px');
                    content2.css('text-align', 'center');
                    page.append(content);
                    page.append(content2);
                    if (i > 1) {
                        var previousButton = $('<div><button>Previous</button></div>');
                        previousButton.css('text-align','center');
                        previousButton.on('click', function() {
                            showPage(i - 1,i);
                            selectedContainer = null;
                            selected = null;
                        });
                        page.append(previousButton);
                    }
                    if (i < totalPages) {
                        var nextButton = $('<div><button>Next</button></div>');
                        nextButton.css('text-align','center');
                        nextButton.on('click', function() {
                            var id2 = selectedContainer ? selectedContainer.attr('id') : null;
                            if (id2) {
                                var number = id2.replace('divcon', '');
                            } else {
                                alert('Please select a candidate!!!');
                                return;
                            }
                            if (selected_num2 === null) {
                                selected_num2 = [];
                            }
                            var array_num2=[];
                            var array_num2 = selected_num2.concat(selected);
                            
                            try{
                                if (hasDuplicates(array_num2)) {
                                console.log("have duplicate");
                                alert("Please select a candidate!!!");
                                return;
                                } else {
                                    console.log("no duplicate");
                                }
                            }
                            catch{
                            }
                            if(selected_num2 && selected_num2.includes(number)){
                                alert ('pls select a candidate!!!')
                                return;
                            }else{
                                const data_1={
                                    page: i,
                                    position: selected
                                };
                                console.log('number:'+ number)
                                console.log('selectedContainer ID: ' + id2);
                                console.log('select:'+ data_1.position)
                                $.ajax({
                                    type: 'POST',
                                    url: 'http://localhost:5056/update_file',
                                    data: JSON.stringify(data_1),
                                    contentType: "application/json; charset=utf-8",
                                    success: function(response) {
                                        console.log("Response from backend:", response);
                                        selectedContainer = null;
                                        selected = null;
                                        lastPage = i;
                                        showPage(i + 1,i);
                                    },
                                    error: function(error) {
                                        console.error("Error:", error);
                                        alert("wrong database");
                                    }
                                });
                            }
                        });
                        
                        page.append(nextButton);
                    }
                    if (i >= totalPages) {
                        var okButton = $('<div><button>Finish</button></div>');
                        okButton.css('text-align','center');
                        okButton.on('click', function() {
                            var id2 = selectedContainer ? selectedContainer.attr('id') : null;
                            if (id2) {
                                var number = id2.replace('divcon', '');
                            } else {
                                alert('Please select a candidate!!!');
                                return;
                            }
                            if (selected_num2 === null) {
                                selected_num2 = [];
                            }
                            var array_num2=[];
                            var array_num2 = selected_num2.concat(selected);
                            try{
                                if (hasDuplicates(array_num2)) {
                                console.log("have duplicate");
                                alert("Please select a candidate!!!");
                                return;
                                } else {
                                    console.log("no duplicate");
                                }
                            }
                            catch{

                            }
                            if(selected_num2 && selected_num2.includes(number)){
                                alert ('pls select a candidate!!!')
                                return;
                            }else{
                                const data_1={
                                    page: i,
                                    position: selected
                                };
                                console.log('number:'+ number)
                                console.log('selectedContainer ID: ' + id2);
                                console.log('select:'+ data_1.position)
                                $.ajax({
                                    type: 'POST',
                                    url: 'http://localhost:5056/update_file',
                                    data: JSON.stringify(data_1),
                                    contentType: "application/json; charset=utf-8",
                                    success: function(response) {
                                        console.log("Response from backend:", response);
                                        selectedContainer = null;
                                        selected = null;
                                        lastPage = i;
                                        $.ajax({
                                            type: 'POST',
                                            url: 'http://localhost:5056/upload_voting_data',
                                            data: JSON.stringify({i:"i"}),
                                            contentType: "application/json; charset=utf-8",
                                            success: function(response) {

                                                window.location.href = "ads_page.html";
                                            },
                                            error: function(error) {
                                                console.error("Error:", error);
                                                alert("click ok button again, if no function pls call administration and restart this application!!");
                                            }
                                        });
                                    },
                                    error: function(error) {
                                        console.error("Error:", error);
                                        alert("wrong database");
                                    }
                                });
                            }   
                        });
                        page.append(okButton);
                    }
                    var container = $('<div></div>');
                    container.addClass('person-container');
                    for (var j = 1; j <= totalCandidates; j++) {
                        (function(j) {
                            setTimeout(function() {
                                $.ajax({
                                    type: 'GET',
                                    url: 'http://localhost:5006/get_inform_candidate/' + j,
                                    success: function (response) {
                                        if (response.success) {
                                            var personInfo = {
                                                name: response.name,
                                                age: response.age,
                                                class: response.class1,
                                                bio: response.bio,
                                                imageSrc: "candidate_image/" + j + ".png"
                                            };
                                            var personDiv = $("<div>").addClass("person-info");
                                            personDiv.attr('id', 'divcon' + j);
                                            personDiv.click(function () {
                                                toggleContainer($(this));
                                            });
                                            personDiv.attr('status', '1');
                                            var image = $("<img>").attr("src", personInfo.imageSrc);
                                            image.attr('id', 'divpic' + j);
                                            var infoDe = $("<div>").addClass("detail-info");
                                            infoDe.attr('id', 'divInfo' + j);
                                            var name = $("<h2>").text(personInfo.name);
                                            name.append("<br>");
                                            var age = $("<p>").text("Age: " + personInfo.age);
                                            age.append("<br>");
                                            var class1 = $("<p>").text("Class: " + personInfo.class);
                                            age.append("<br>");
                                            var bio = $("<p>").text("Bio: " + personInfo.bio);
                                            bio.append("<br>");
                                            personDiv.append(image, infoDe);
                                            infoDe.append(name, age, bio,class1);
                                            container.append(personDiv);
                                            if (selected_num2&&selected_num2.includes(j)) {
                                                console.log("Hide Success: "+j);
                                                $("#divcon" + j).css("display", "none");
                                                
                                            } else{

                                            }
                                            const initialContainer = $('#divcon'+selected_num);
                                            selected = selected_num;
                                            toggleContainer2($(initialContainer));
                                        } else {
                                            console.log(j + ' candidate not found.');
                                        }
                                    },
                                    error: function (error) {
                                        console.error("Error:", error);
                                    }
                                });
                                
                            }, 50 * j); 
                        })(j);
                    }
                    page.append(container);
                    pageContainer.append(page);
                })(i);
            }
            
            showPage(1,0);
            let selectedContainer = null;
            let selected = null;
    
            function toggleContainer(container) {
                if (selectedContainer) {
                    selectedContainer.attr('status', '0');
                    selectedContainer.css('background-color', ''); 
                }
                container.attr('status', '1');
                container.css('background-color', '#2ECC71'); 
                selectedContainer = container;
    
                const selectedContainerIndex = container.index();
                selected = selectedContainerIndex + 1
                console.log('selected: ' + selected);
            }

            function toggleContainer2(container) {
                if (selectedContainer) {
                    selectedContainer.attr('status', '0');
                    selectedContainer.css('background-color', '');
                }
                container.attr('status', '1');
                container.css('background-color', '#2ECC71');
                selectedContainer = container;
                const selectedContainerIndex = container.index();
                selected = selectedContainerIndex + 1
                console.log('selected: ' + selected);
            }
            function confirmSelection() {
                if (selectedContainer) {
                    window.location.href = 'thank_page.html';
                } else {
                    alert("Please select a candidate first.");
                }
            }
            function hasDuplicates(array) {
                var valuesSoFar = {};
                var hasDuplicate = false;
                
                $.each(array, function(index, value) {
                    if (valuesSoFar[value] === undefined) {
                        valuesSoFar[value] = true;
                    } else {
                        hasDuplicate = true;
                        return false; 
                    }
                });
            
                return hasDuplicate;
            }
            function updateContainerVisibility() {
                $('.person-info').each(function() {
                    const status = parseInt($(this).attr('status'));
                    if (status === 0) {
                        $(this).css('display', 'none');
                    } else {
                        $(this).css('display', 'flex'); 
                    }
                });
            }
            updateContainerVisibility();
    },
    error: function(error) {
        console.error("Error:", error);
        alert("wrong database");
    }
    });
    });
    