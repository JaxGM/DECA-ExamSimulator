let examCatageory, data, mode, temp, cdcDate, icdcDate, reviewSet, loading, counter, url, questionSet;
let currentQ = 1;

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
    document.getElementById("newTest").innerText = "···";
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

            if ((data != "error") && (type == 'test') && Array.isArray(data)) {
                document.getElementById("mode").innerText = "Testing Mode"
                
                questionSet = ""
                for (let i = 1; i < data.length; i++) {

                    questionSet = questionSet + "<div id=\"id"+i+"\" hidden>";
                    questionSet = questionSet + "<p id=\"QuestionPhrase\">"+i+". "+data[i][1]+"</p>";
                    questionSet = questionSet + "<div id=\"AnswerChoices\">"

                    // A
                    questionSet = questionSet + "<div id=\"AnswerChoice\">"
                    questionSet = questionSet + "<input type=\"radio\" name=\"RadioButton"+i+"\" id=\"AButton\"></input>"
                    questionSet = questionSet + "<p id=\""+i+"ALetter\">&nbspA.&nbsp</p>"
                    questionSet = questionSet + "<p id=\""+i+"AText\">"+data[i][2]+"</p>"
                    questionSet = questionSet + "</div>"

                    // B
                    questionSet = questionSet + "<div id=\"AnswerChoice\">"
                    questionSet = questionSet + "<input type=\"radio\" name=\"RadioButton"+i+"\" id=\"BButton\"></input>"
                    questionSet = questionSet + "<p id=\""+i+"BLetter\">&nbspB.&nbsp</p>"
                    questionSet = questionSet + "<p id=\""+i+"BText\">"+data[i][3]+"</p>"
                    questionSet = questionSet + "</div>"

                    // C
                    questionSet = questionSet + "<div id=\"AnswerChoice\">"
                    questionSet = questionSet + "<input type=\"radio\" name=\"RadioButton"+i+"\" id=\"CButton\"></input>"
                    questionSet = questionSet + "<p id=\""+i+"CLetter\">&nbspC.&nbsp</p>"
                    questionSet = questionSet + "<p id=\""+i+"CText\">"+data[i][4]+"</p>"
                    questionSet = questionSet + "</div>"

                    // D
                    questionSet = questionSet + "<div id=\"AnswerChoice\">"
                    questionSet = questionSet + "<input type=\"radio\" name=\"RadioButton"+i+"\" id=\"DButton\"></input>"
                    questionSet = questionSet + "<p id=\""+i+"DLetter\">&nbspD.&nbsp</p>"
                    questionSet = questionSet + "<p id=\""+i+"DText\">"+data[i][5]+"</p>"
                    questionSet = questionSet + "</div>"

                    questionSet = questionSet + "</div>"
                    questionSet = questionSet + "</div>"
                    questionSet = questionSet + "</div>"
                }
                document.getElementById("BubbleQuestion").innerHTML = questionSet;

                reviewSet = "<h2 style=\"text-align: center;\"><u>Review</u></h2>"
                for (let i = 1; i < data.length; i++) {
                    reviewSet = reviewSet + "<div id=\"rid"+i+"\" class=\"reviewPart\" onclick=\"callQuestion("+i+")\">";
                    reviewSet = reviewSet + "<p id=\"QuestionPhrase\"+ style=\"font-size: 1rem\">"+i+". "+data[i][1]+"</p>";
                    reviewSet = reviewSet + "<div id=\"AnswerChoices\">"

                    // A
                    reviewSet = reviewSet + "<div id=\"ReviewChoice\">"
                    reviewSet = reviewSet + "<p id=\""+i+"ALetterR\">&nbspA.&nbsp</p>"
                    reviewSet = reviewSet + "<p id=\""+i+"ATextR\">"+data[i][2]+"</p>"
                    reviewSet = reviewSet + "</div>"

                    // B
                    reviewSet = reviewSet + "<div id=\"ReviewChoice\">"
                    reviewSet = reviewSet + "<p id=\""+i+"BLetterR\">&nbspB.&nbsp</p>"
                    reviewSet = reviewSet + "<p id=\""+i+"BTextR\">"+data[i][3]+"</p>"
                    reviewSet = reviewSet + "</div>"

                    // C
                    reviewSet = reviewSet + "<div id=\"ReviewChoice\">"
                    reviewSet = reviewSet + "<p id=\""+i+"CLetterR\">&nbspC.&nbsp</p>"
                    reviewSet = reviewSet + "<p id=\""+i+"CTextR\">"+data[i][4]+"</p>"
                    reviewSet = reviewSet + "</div>"

                    // D
                    reviewSet = reviewSet + "<div id=\"ReviewChoice\">"
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

function updateProgressPercent() {

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
    updateProgressPercent()

}

function callReview() {

    document.getElementById("advancement<").hidden = true;
    document.getElementById("advancement>").hidden = true;
    document.getElementById("BubbleQuestion").hidden = true;

    document.getElementById("BubbleReveiw").hidden = false;
    document.getElementById("reviewButton").hidden = true;
    document.getElementById("subScore").hidden = false;

    document.getElementById("questionNumber").innerText = "Review Page"
    // show submit
}

function nextQuestion() {
    //commit answer to data
    qualifyingButtons = document.getElementsByName('RadioButton' + currentQ);
    for (i = 0; i < qualifyingButtons.length; i++) {
        if (qualifyingButtons[i].checked) {
            data[currentQ][8] = true;
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

function scoreTest () {

}


