let examCatageory, data, mode, temp, cdcDate, icdcDate, reviewSet, loading, counter, url, questionSet, correct, incorrect, progress;
let currentQ = 1;

let chartConig, chartContent;
let charted = false;

function chartTime() {
    document.getElementById("SocreChart").hidden = false;
    document.getElementById("SocreChart").style.display = "flex";

    if (charted){
        //document.getElementById("chart").getContext("2d").destroy();
    }
    
    charted = true;
    console.log(correct);
    console.log(100-(correct+incorrect));
    console.log(incorrect);

    new Chart(document.getElementById("chart"), {
        type: 'doughnut',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        },
        data: {
            labels: [
                'Correct',
                'Skipped',
                'Incorrect'
        ],
        datasets: [{
            data: [correct, 100-(correct+incorrect), incorrect],
            backgroundColor: [
            'rgb(43, 188, 21)',
            'rgb(54, 162, 235)',
            'rgb(234, 42, 42)'
            ],
            hoverOffset: 4
        }]
        }});
}

function onStart() {
    dates();

    fetch('https://deca-examprocessor.onrender.com/url?link=awake', {method: 'GET'})
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

    

}

function between(startStr, endStr, str) {
        pos = str.indexOf(startStr) + startStr.length;
        str.substring(pos, str.indexOf(endStr, pos));
        return str.substring(pos, str.indexOf(endStr, pos));
}

function dates() {
    // CDC
    cdcDate = "HOLD"

    // ICDC
    //icdcDate = new Date(between("*ICDC = ", ";", globalText));
    // icdcDate = Math.round(Math.ceil(icdcDate - new Date())/(1000 * 3600 * 24));

    // Push
    document.getElementById("dates").innerHTML = "<strong>"+cdcDate+"</strong>&nbsp;days&nbsp;until&nbsp;Flordia&nbsp;CDC&nbsp;Testing&nbsp;| <strong>"+icdcDate+"</strong>&nbsp;days&nbsp;until&nbsp;ICDC";
}

function newExam(type) {
    url = document.getElementById("URL").value;
    url = "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/67c1d65441573664321a854f_24-25_BA%20Core%20Exam.pdf";
    console.log(url);

    loading = true;
    if (type == "test") {
        document.getElementById("newTest").innerText = "···";
    } else if (type == "training") {
        alert("Training is not avalible yet.");
        return;
    }
    fetch('https://deca-examprocessor.onrender.com/url?link='+url, {method: 'GET'})
        .then(response => response.json())
        .then(response => {
            data = response;
            console.log(data);
            if (data != "error"){
                // This is the code for starting a test
                console.log(data);
                document.getElementById("ExamType").innerText = data[0][0];
            }

            loading = false;
            document.getElementById("newTest").innerText = "New Test";
            //document.getElementById("QuestionPhrase").innerText = data[1][0]+". "+data[1][1];

            document.getElementById("reviewButton").innerText = "Review"

            if ((data != "error") && (type == 'test') && Array.isArray(data)) {
                document.getElementById("mode").innerText = "Testing Mode"
                correct = 0
                incorrect = 0
                progress = 0

                document.getElementById("Progress").hidden = false;
                document.getElementById("ProgressPercent").hidden = false;
                document.getElementById("ProgressBar").hidden = false;
                document.getElementById("ProgressText").hidden = false;

                questionSet = ""
                for (let i = 1; i < data.length; i++) {

                    questionSet = questionSet + "<div id=\"id"+i+"\" hidden>";
                    questionSet = questionSet + "<p id=\"QuestionPhrase\">"+i+". "+data[i][1]+"</p>";
                    questionSet = questionSet + "<div id=\"AnswerChoices\">"

                    // A
                    questionSet = questionSet + "<div id=\"AnswerChoice\">"
                    questionSet = questionSet + "<input type=\"radio\" class=\"Radio\" onclick=\"recordResponce()\" name=\"RadioButton"+i+"\" id=\"AButton"+i+"\"></input>"
                    questionSet = questionSet + "<p id=\""+i+"ALetter\">&nbspA.&nbsp</p>"
                    questionSet = questionSet + "<p id=\""+i+"AText\">"+data[i][2]+"</p>"
                    questionSet = questionSet + "</div>"

                    // B
                    questionSet = questionSet + "<div id=\"AnswerChoice\">"
                    questionSet = questionSet + "<input type=\"radio\" class=\"Radio\" onclick=\"recordResponce()\" name=\"RadioButton"+i+"\" id=\"BButton"+i+"\"></input>"
                    questionSet = questionSet + "<p id=\""+i+"BLetter\">&nbspB.&nbsp</p>"
                    questionSet = questionSet + "<p id=\""+i+"BText\">"+data[i][3]+"</p>"
                    questionSet = questionSet + "</div>"

                    // C
                    questionSet = questionSet + "<div id=\"AnswerChoice\">"
                    questionSet = questionSet + "<input type=\"radio\" class=\"Radio\" onclick=\"recordResponce()\" name=\"RadioButton"+i+"\" id=\"CButton"+i+"\"></input>"
                    questionSet = questionSet + "<p id=\""+i+"CLetter\">&nbspC.&nbsp</p>"
                    questionSet = questionSet + "<p id=\""+i+"CText\">"+data[i][4]+"</p>"
                    questionSet = questionSet + "</div>"

                    // D
                    questionSet = questionSet + "<div id=\"AnswerChoice\">"
                    questionSet = questionSet + "<input type=\"radio\" class=\"Radio\" onclick=\"recordResponce()\" name=\"RadioButton"+i+"\" id=\"DButton"+i+"\"></input>"
                    questionSet = questionSet + "<p id=\""+i+"DLetter\">&nbspD.&nbsp</p>"
                    questionSet = questionSet + "<p id=\""+i+"DText\">"+data[i][5]+"</p>"
                    questionSet = questionSet + "</div>"

                    questionSet = questionSet + "</div>"
                    questionSet = questionSet + "<p id=\""+i+"Reasoning\" class=\"reasoning\" hidden></p>"
                    questionSet = questionSet + "</div>"
                }
                document.getElementById("BubbleQuestion").innerHTML = questionSet;

                reviewSet = "<h2 id=\"RevHead\" style=\"text-align: center;\"><u>Review</u></h2> <h5 id=\"Disclaim\" hidden style=\"text-align: center;\">*For answer descriptions, select the question :)</h5>"
                for (let i = 1; i < data.length; i++) {
                    reviewSet = reviewSet + "<div id=\"rid"+i+"\" class=\"reviewPart\" onclick=\"callQuestion("+i+")\">";
                    reviewSet = reviewSet + "<p id=\"QuestionPhrase\"+ style=\"font-size: 1rem\">"+i+". "+data[i][1]+"</p>";
                    reviewSet = reviewSet + "<div id=\"AnswerChoices\">"

                    // A
                    reviewSet = reviewSet + "<div id=\""+i+"ReviewChoiceA\" class=\"ReviewChoice\">"
                    reviewSet = reviewSet + "<p id=\""+i+"ALetterR\">&nbspA.&nbsp</p>"
                    reviewSet = reviewSet + "<p id=\""+i+"ATextR\">"+data[i][2]+"</p>"
                    reviewSet = reviewSet + "</div>"

                    // B
                    reviewSet = reviewSet + "<div id=\""+i+"ReviewChoiceB\" class=\"ReviewChoice\">"
                    reviewSet = reviewSet + "<p id=\""+i+"BLetterR\">&nbspB.&nbsp</p>"
                    reviewSet = reviewSet + "<p id=\""+i+"BTextR\">"+data[i][3]+"</p>"
                    reviewSet = reviewSet + "</div>"

                    // C
                    reviewSet = reviewSet + "<div id=\""+i+"ReviewChoiceC\" class=\"ReviewChoice\">"
                    reviewSet = reviewSet + "<p id=\""+i+"CLetterR\">&nbspC.&nbsp</p>"
                    reviewSet = reviewSet + "<p id=\""+i+"CTextR\">"+data[i][4]+"</p>"
                    reviewSet = reviewSet + "</div>"

                    // D
                    reviewSet = reviewSet + "<div id=\""+i+"ReviewChoiceD\" class=\"ReviewChoice\">"
                    reviewSet = reviewSet + "<p id=\""+i+"DLetterR\">&nbspD.&nbsp</p>"
                    reviewSet = reviewSet + "<p id=\""+i+"DTextR\">"+data[i][5]+"</p>"
                    reviewSet = reviewSet + "</div>"

                    reviewSet = reviewSet + "</div>"
                    reviewSet = reviewSet + "</div>"
                    reviewSet = reviewSet + "</div>"
                }
                document.getElementById("BubbleReveiw").innerHTML = reviewSet;

            } else {
                    //error out
                    document.getElementById("newTest").innerText = "New Test";
                    alert("An error has occurred. Please try again.");
                    console.log("error");
                    console.log(data);
            }
            
            document.getElementById("controls").hidden = false;
            document.getElementById("controls").className = "controlsON";


            callQuestion(1);



        })
        .catch(err => {
            console.error(err);
        });   
    
}

function callQuestion(number) {
    document.getElementById("advancement<").hidden = false;
    document.getElementById("advancement>").hidden = false;
    document.getElementById("BubbleQuestion").hidden = false;

    document.getElementById("BubbleReveiw").hidden = true;
    document.getElementById("reviewButton").hidden = false;
    document.getElementById("subScore").hidden = true;

    
    console.log("calling" + number);
    document.getElementById("id"+currentQ).hidden = true;
    currentQ = number;
    document.getElementById("id"+number).hidden = false;
    document.getElementById("questionNumber").innerText = "Questiom " + number

}

function recordResponce() {
    console.log(incorrect)
    console.log(correct)
    //commit answer to data
    qualifyingButtons = document.getElementsByName('RadioButton' + currentQ);
    for (i = 0; i < qualifyingButtons.length; i++) {
        if (qualifyingButtons[i].checked) {

            if(data[currentQ][8] != true) {
                data[currentQ][8] = true;
                progress = progress + 1
                document.getElementById("ProgressPercent").innerText = progress+"%"
                document.getElementById("ProgressBar").value = progress
                document.getElementById("ProgressText").innerText = progress+"/100"


            }

            data[currentQ][9] = qualifyingButtons[i].id.substring(0,1);
            console.log(qualifyingButtons[i].id.substring(0,1))

        }
    }

    //bold answer on review
    console.log(currentQ+"CLetterR")
    if ((data[currentQ][9] == "A") && data[currentQ][8]) {
        document.getElementById(currentQ+"ALetterR").innerHTML = "<strong>" + "&nbspA.&nbsp" + "</strong>"
        document.getElementById(currentQ+"ATextR").innerHTML = "<strong>" + data[currentQ][2] + "</strong>"
    } else {
        document.getElementById(currentQ+"ALetterR").innerHTML = "&nbspA.&nbsp"
        document.getElementById(currentQ+"ATextR").innerHTML = data[currentQ][2]
    }
    if ((data[currentQ][9] == "B") && data[currentQ][8]) {
        document.getElementById(currentQ+"BLetterR").innerHTML = "<strong>" + "&nbspB.&nbsp" + "</strong>"
        document.getElementById(currentQ+"BTextR").innerHTML = "<strong>" + data[currentQ][3] + "</strong>"
    } else {
        document.getElementById(currentQ+"BLetterR").innerHTML = "&nbspB.&nbsp"
        document.getElementById(currentQ+"BTextR").innerHTML = data[currentQ][3]
    }
    if ((data[currentQ][9] == "C") && data[currentQ][8]) {
        document.getElementById(currentQ+"CLetterR").innerHTML = "<strong>" + "&nbspC.&nbsp" + "</strong>"
        document.getElementById(currentQ+"CTextR").innerHTML = "<strong>" + data[currentQ][4] + "</strong>"
    } else {
        document.getElementById(currentQ+"CLetterR").innerHTML = "&nbspC.&nbsp"
        document.getElementById(currentQ+"CTextR").innerHTML = data[currentQ][4]
    }
    if ((data[currentQ][9] == "D") && data[currentQ][8]) {
        document.getElementById(currentQ+"DLetterR").innerHTML = "<strong>" + "&nbspD.&nbsp" + "</strong>"
        document.getElementById(currentQ+"DTextR").innerHTML = "<strong>" + data[currentQ][5] + "</strong>"
    } else {
        document.getElementById(currentQ+"DLetterR").innerHTML = "&nbspD.&nbsp"
        document.getElementById(currentQ+"DTextR").innerHTML = data[currentQ][5]
    }
}

function callReview() {

    if (progress == "Scored") {
        document.getElementById("BubbleQuestion").hidden = true;
        document.getElementById("advancement<").hidden = true;
        document.getElementById("advancement>").hidden = true;
        document.getElementById("reviewButton").hidden = true;

        document.getElementById("BubbleReveiw").hidden = false;

        document.getElementById("questionNumber").innerText = "Results Page"
        


        
    } else {
        document.getElementById("advancement<").hidden = true;
        document.getElementById("advancement>").hidden = true;
        document.getElementById("BubbleQuestion").hidden = true;

        document.getElementById("BubbleReveiw").hidden = false;
        document.getElementById("reviewButton").hidden = true;
        document.getElementById("subScore").hidden = false;

        document.getElementById("questionNumber").innerText = "Review Page"
    }
}

function nextQuestion() {
    if (currentQ<100) {
        callQuestion (currentQ+1);
    } else if (currentQ == 100) {
        callReview();
    }
}

function lastQuestion() {
    if (currentQ!=1) {
        callQuestion (currentQ-1);
    }
}

function scoreTest() {
    document.getElementById("Progress").hidden = true;
    document.getElementById("ProgressPercent").hidden = true;
    document.getElementById("ProgressBar").hidden = true;
    document.getElementById("ProgressText").hidden = true;

    progress = "Scored";

    document.getElementById("reviewButton").innerText = "Results"

    for (i=1; i <= 100; i++) {
        // Score



        // Set Red     // Set Green      // Set Blue
        if (data[i][8]) {
            if (data[i][9] == data[i][6]) {
                document.getElementById(i+"ReviewChoice"+data[i][9]).className = "greenRihgt"
                correct = correct + 1;

            } else if (data[i][9] != data[i][6]) {
                document.getElementById(i+"ReviewChoice"+data[i][9]).className = "redWrong"
                document.getElementById(i+"ReviewChoice"+data[i][6]).className = "actualAnswer"
                incorrect = incorrect + 1;
            }
        } else {
            document.getElementById(i+"ReviewChoice"+data[i][6]).className = "actualAnswer"
        }

        // Add description
        document.getElementById(i+"Reasoning").hidden = false;
        document.getElementById(i+"Reasoning").innerHTML = "<i><strong>" + data[i][7] + "</strong></i>";

        document.getElementById("questionNumber").innerText = "Results Page"
        document.getElementById("RevHead").innerHTML = "<u>Results</u>"

        document.getElementById("subScore").hidden = true;
        document.getElementById("Disclaim").hidden = false;

        // Lock Radio buttons
        document.getElementById("AButton"+i).disabled = true;
        document.getElementById("BButton"+i).disabled = true;
        document.getElementById("CButton"+i).disabled = true;
        document.getElementById("DButton"+i).disabled = true;
    }

    // Display Score
    chartTime()



}


