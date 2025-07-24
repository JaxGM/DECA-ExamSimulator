const debug = 2;

// Global Data
import * as global from "./global.js";

import { reset_content } from "./reset_content.js";

/////////////////////////////////////////////////////////////////////////

// Initialize Firebase

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	sendPasswordResetEmail,
	deleteUser,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
	getDatabase,
	ref,
	set,
	get,
	remove,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
	apiKey: "AIzaSyCFxnV3RRKXDv9EccwAIAtjx8ey2L3OzqM",
	authDomain: "deca-examsimulator.firebaseapp.com",
	projectId: "deca-examsimulator",
	storageBucket: "deca-examsimulator.firebasestorage.app",
	messagingSenderId: "565902611634",
	appId: "1:565902611634:web:a2bc18199ebae4d60f25ab",
	databaseURL: "https://deca-examsimulator-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

/////////////////////////////////////////////////////////////////////////

// Init Variables
let correct,
	data,
	cdcDate,
	icdcDate,
	incorrect,
	testAverage,
	totalExams,
	progress,
	questionSet,
	reviewSet,
	scoreChart,
	memberSince,
	url,
	email,
	username,
	password,
	status,
	user,
	qualifyingButtons,
	currentQ;
let loggedIn = false;

/////////////////////////////////////////////////////////////////////////

async function pullFromDatabase(path) {
	try {
		const snapshot = await get(ref(database, path));
		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			return "error";
		}
	} catch (error) {
		return "error";
	}
}

// Calculates and displays the countdown to CDC testing and ICDC testing
function dates() {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// CDC
	try {
		cdcDate = Math.round(
			(new Date(global.cdcDate).setHours(0, 0, 0, 0) - today) /
				(1000 * 60 * 60 * 24)
		);
		cdcDate = isNaN(cdcDate) ? "TBD" : cdcDate;
	} catch (error) {
		cdcDate = "TBD";
	}

	// ICDC
	try {
		icdcDate = Math.round(
			(new Date(global.icdcDate).setHours(0, 0, 0, 0) - today) /
				(1000 * 60 * 60 * 24)
		);
		icdcDate = isNaN(icdcDate) ? "TBD" : icdcDate;
	} catch (error) {
		global.icdcDate = "TBD";
		console.log(icdcDate);
	}

	// Push
	document.getElementById("dates").innerHTML =
		"<strong>" +
		cdcDate +
		"</strong>&nbsp;days&nbsp;until&nbsp;Flordia&nbsp;CDC&nbsp;Testing&nbsp;| <strong>" +
		icdcDate +
		"</strong>&nbsp;days&nbsp;until&nbsp;ICDC";
}

// Start Code
function reset() {
	document.getElementById("contnet").innerHTML = reset_content;
}

function onStart() {
	reset();

	if (debug == 1) {
		email = "admin@admin.com";
		password = "123456";

		signInWithEmailAndPassword(auth, email, password).then(
			(userCredential) => {
				// Signed in
				user = userCredential.user;
				console.log(true);
				loadUser();
			}
		);
		toggleLoginPopup();
	} else if (debug == 2) {
		document.getElementById("UsernameText").innerHTML =
			"Debug" + " <strong>☰</strong>";
		document.getElementById("LoginExternal").hidden = true;
		document.getElementById("Username").style.display = "flex";
		loggedIn = true;
	}

	// Updates countdowns
	dates();
	newExam("test");
	callReview();
	scoreTest();

	// Awakes Server
	fetch("https://deca-examprocessor.onrender.com/url?link=awake", {
		method: "GET",
	})
		.then((response) => response.json())
		.then((response) => console.log(response))
		.catch((err) => console.error(err));

	status = "await";
}

// Optimized for TEST mode, pulls up the requested question
function callQuestion(number) {
	document.getElementById("advancement<").hidden = false;
	document.getElementById("advancement>").hidden = false;
	document.getElementById("BubbleQuestion").hidden = false;

	document.getElementById("BubbleReveiw").hidden = true;
	document.getElementById("reviewButton").hidden = false;
	document.getElementById("subScore").hidden = true;

	console.log("calling" + number);
	document.getElementById("id" + currentQ).hidden = true;
	currentQ = number;
	document.getElementById("id" + number).hidden = false;
	document.getElementById("questionNumber").innerText = "Questiom " + number;
}

// Records a radio button click
function recordResponce() {
	console.log(incorrect);
	console.log(correct);
	//commit answer to data
	console.log(currentQ + "is the current Q");
	console.log("RadioButton" + currentQ);
	console.log(document.getElementsByName("RadioButton" + currentQ));

	qualifyingButtons = document.getElementsByName("RadioButton" + currentQ);

	for (let i = 0; i < qualifyingButtons.length; i++) {
		console.log(i);
		if (qualifyingButtons[i].checked) {
			if (data[currentQ][8] != true) {
				data[currentQ][8] = true;
				progress = progress + 1;
				document.getElementById("ProgressPercent").innerText =
					progress + "%";
				document.getElementById("ProgressBar").value = progress;
				document.getElementById("ProgressText").innerText =
					progress + "/100";
			}

			data[currentQ][9] = qualifyingButtons[i].id.substring(0, 1);
			console.log(qualifyingButtons[i].id.substring(0, 1));
		}
	}

	//bold answer on review
	console.log(currentQ + "CLetterR");
	if (data[currentQ][9] == "A" && data[currentQ][8]) {
		document.getElementById(currentQ + "ALetterR").innerHTML =
			"<strong>" + "&nbspA.&nbsp" + "</strong>";
		document.getElementById(currentQ + "ATextR").innerHTML =
			"<strong>" + data[currentQ][2] + "</strong>";
	} else {
		document.getElementById(currentQ + "ALetterR").innerHTML =
			"&nbspA.&nbsp";
		document.getElementById(currentQ + "ATextR").innerHTML =
			data[currentQ][2];
	}
	if (data[currentQ][9] == "B" && data[currentQ][8]) {
		document.getElementById(currentQ + "BLetterR").innerHTML =
			"<strong>" + "&nbspB.&nbsp" + "</strong>";
		document.getElementById(currentQ + "BTextR").innerHTML =
			"<strong>" + data[currentQ][3] + "</strong>";
	} else {
		document.getElementById(currentQ + "BLetterR").innerHTML =
			"&nbspB.&nbsp";
		document.getElementById(currentQ + "BTextR").innerHTML =
			data[currentQ][3];
	}
	if (data[currentQ][9] == "C" && data[currentQ][8]) {
		document.getElementById(currentQ + "CLetterR").innerHTML =
			"<strong>" + "&nbspC.&nbsp" + "</strong>";
		document.getElementById(currentQ + "CTextR").innerHTML =
			"<strong>" + data[currentQ][4] + "</strong>";
	} else {
		document.getElementById(currentQ + "CLetterR").innerHTML =
			"&nbspC.&nbsp";
		document.getElementById(currentQ + "CTextR").innerHTML =
			data[currentQ][4];
	}
	if (data[currentQ][9] == "D" && data[currentQ][8]) {
		document.getElementById(currentQ + "DLetterR").innerHTML =
			"<strong>" + "&nbspD.&nbsp" + "</strong>";
		document.getElementById(currentQ + "DTextR").innerHTML =
			"<strong>" + data[currentQ][5] + "</strong>";
	} else {
		document.getElementById(currentQ + "DLetterR").innerHTML =
			"&nbspD.&nbsp";
		document.getElementById(currentQ + "DTextR").innerHTML =
			data[currentQ][5];
	}
}

function altAnswer(q, a) {
	document.getElementById(a + "Button" + q).click();
}

// Activates the core functionality of the program
function newExam(type) {
	// Functionality is currenlty only enabled for TEST, not TRAINING.
	if (type == "test") {
		document.getElementById("newTest").innerText = "···";

		// Process Exam
		url = document.getElementById("URL").value;

		// DEBUG MODE
		url =
			"https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/67c1d65441573664321a854f_24-25_BA%20Core%20Exam.pdf";

		// fetch("https://deca-examprocessor.onrender.com/url?link=" + url, {
		// 	method: "GET",
		// })
		// 	.then((response) => response.json())
		// 	.then((response) => {
		// 		// NEEDS TO BE CLEANED
		// 		data = response;

		// hardocded
		data = global.hardCodedData;
		console.log(data);

		if (data != "error") {
			reset();
		}

		if (data != "error" && type == "test" && Array.isArray(data)) {
			status = "test";
			document.getElementById("ExamType").innerText = data[0][0];

			document.getElementById("ScoreChart").style.display = "none";

			document.getElementById("newTest").innerText = "New Test";

			document.getElementById("reviewButton").innerText = "Review";

			document.getElementById("mode").innerText = "Testing Mode";
			correct = 0;
			incorrect = 0;
			progress = 0;
			document.getElementById("ProgressPercent").innerText =
				progress + "%";
			document.getElementById("ProgressBar").value = progress;
			document.getElementById("ProgressText").innerText =
				progress + "/100";

			document.getElementById("Progress").hidden = false;
			document.getElementById("ProgressPercent").hidden = false;
			document.getElementById("ProgressBar").hidden = false;
			document.getElementById("ProgressText").hidden = false;

			questionSet = "";
			for (let i = 1; i < data.length; i++) {
				questionSet +=
					`<div id="id${i}" hidden><p id="QuestionPhrase">${i}. ${data[i][1]}</p><div id="AnswerChoices">` +
					`<div id="${i}AnswerChoiceA" class="clickable AnswerChoice"><input type="radio" onClick="code.recordResponce()" name="RadioButton${i}" id="AButton${i}"><p id="${i}ALetter" class="clickable" onClick="code.altAnswer(${i}, A)">&nbspA.&nbsp</p><p id="${i}AText" class="clickable" onClick="code.altAnswer(${i}, 'A')">${data[i][2]}</p></div>` +
					`<div id="${i}AnswerChoiceB" class="clickable AnswerChoice"><input type="radio" onClick="code.recordResponce()" name="RadioButton${i}" id="BButton${i}"><p id="${i}BLetter" class="clickable" onClick="code.altAnswer(${i}, B)">&nbspB.&nbsp</p><p id="${i}BText" class="clickable" onClick="code.altAnswer(${i}, 'B')">${data[i][3]}</p></div>` +
					`<div id="${i}AnswerChoiceC" class="clickable AnswerChoice"><input type="radio" onClick="code.recordResponce()" name="RadioButton${i}" id="CButton${i}"><p id="${i}CLetter" class="clickable" onClick="code.altAnswer(${i}, C)">&nbspC.&nbsp</p><p id="${i}CText" class="clickable" onClick="code.altAnswer(${i}, 'C')">${data[i][4]}</p></div>` +
					`<div id="${i}AnswerChoiceD" class="clickable AnswerChoice"><input type="radio" onClick="code.recordResponce()" name="RadioButton${i}" id="DButton${i}"><p id="${i}DLetter" class="clickable" onClick="code.altAnswer(${i}, D)">&nbspD.&nbsp</p><p id="${i}DText" class="clickable" onClick="code.altAnswer(${i}, 'D')">${data[i][5]}</p></div>` +
					`</div><p id="${i}Reasoning" class="reasoning" hidden></p></div>`;
			}
			document.getElementById("BubbleQuestion").innerHTML = questionSet;

			reviewSet =
				`<div style="position: absolute; top: 0.75rem; right: 0.75rem; width: 7.75rem; height: 11rem; max-height: 6rem; display: flex; align-items: flex-end;">
				<button style="width: 100%">
				Save Selected Questions to Training Plan
				</button>
				</div>`
				+ '<h2 id="RevHead" style="text-align: center;"><u>Review</u></h2><h5 id="Disclaim" hidden style="text-align: center;">*For answer descriptions, select the question :)</h5>';
			for (let i = 1; i < data.length; i++) {
				reviewSet +=
					`<div style="display: flex; flex-wrap: nowrap; justify-content: space-between;">` + 
					`<div id="rid${i}" class="reviewPart" onClick="code.callQuestion(${i})"><p id="QuestionPhrase" style="font-size: 1rem">${i}. ${data[i][1]}</p><div id="AnswerChoices">` +
					`<div id="${i}ReviewChoiceA" class="ReviewChoice"><p id="${i}ALetterR">&nbspA.&nbsp</p><p id="${i}ATextR">${data[i][2]}</p></div>` +
					`<div id="${i}ReviewChoiceB" class="ReviewChoice"><p id="${i}BLetterR">&nbspB.&nbsp</p><p id="${i}BTextR">${data[i][3]}</p></div>` +
					`<div id="${i}ReviewChoiceC" class="ReviewChoice"><p id="${i}CLetterR">&nbspC.&nbsp</p><p id="${i}CTextR">${data[i][4]}</p></div>` +
					`<div id="${i}ReviewChoiceD" class="ReviewChoice"><p id="${i}DLetterR">&nbspD.&nbsp</p><p id="${i}DTextR">${data[i][5]}</p></div>` +
					`</div></div>` +
					`<input type="checkbox" class="selectToSave clickable" id="checkboxQ${i}">` +
					`</div></div>`;
			}

			


			document.getElementById("BubbleReveiw").innerHTML = reviewSet;


			document.querySelectorAll('.selectToSave').forEach(el => {
				el.hidden = true;
			});


			document.getElementById("controls").hidden = false;
			document.getElementById("controls").className = "controlsON";

			currentQ = 1;
			callQuestion(1);
		} else {
			//error out
			document.getElementById("newTest").innerText = "New Test";
			alert("An error has occurred. Please try again.");
			console.log("error");
			console.log(data);
		}
		// 	}
		// )
		// 			.catch((err) => {
		// 				console.error(err);
		// 			});
	} else if (type == "training") {
		if (loggedIn) {
			reset();
			document.getElementById("ExamType").innerText = "Training Mode";

			document.getElementById("newTraining").innerText = "...";

			// if not logged in, set newTraining to "NT" and pop up with login pannel.

			//if status == test

			status = "training";

			document.getElementById("newTraining").innerText = "Enter Trianing";
			document.getElementById("mode").innerText = "20 Questions Avalible";

			document.getElementById("Progress").hidden = true;
			document.getElementById("ProgressPercent").hidden = true;
			document.getElementById("ProgressBar").hidden = true;
			document.getElementById("ProgressText").hidden = true;

			document.getElementById("TrainingControls").hidden = false;
			document.getElementById("TrainKeep").hidden = false;
			document.getElementById("TrainRemove").hidden = false;
			document.getElementById("TrainWords").hidden = false;

			//Get training plan
			// Pull training question from trainingPlan.
		} else {
			toggleLoginPopup();
		}
	}
}

// Optimized for TEST mode, pulls up the review page
function callReview() {
	if (progress == "Scored") {
		document.getElementById("BubbleQuestion").hidden = true;
		document.getElementById("advancement<").hidden = true;
		document.getElementById("advancement>").hidden = true;
		document.getElementById("reviewButton").hidden = true;

		document.getElementById("BubbleReveiw").hidden = false;

		document.getElementById("questionNumber").innerText = "Results Page";
	} else {
		document.getElementById("advancement<").hidden = true;
		document.getElementById("advancement>").hidden = true;
		document.getElementById("BubbleQuestion").hidden = true;

		document.getElementById("BubbleReveiw").hidden = false;
		document.getElementById("reviewButton").hidden = true;
		document.getElementById("subScore").hidden = false;

		document.getElementById("questionNumber").innerText = "Review Page";
	}
}

// Goes to the next quetion (or review page)
function nextQuestion() {
	if (currentQ < 100) {
		callQuestion(currentQ + 1);
	} else if (currentQ == 100) {
		callReview();
	}
}

// Goes to the qeustion before
function lastQuestion() {
	if (currentQ != 1) {
		callQuestion(currentQ - 1);
	}
}

// Creates chart and displays scores
function displayResults() {
	// Set Visable
	document.getElementById("ScoreChart").style.display = "flex";

	// Show Numerical Results
	document.getElementById("correct").innerHTML =
		"<strong>Correct</strong>: " + correct + "</p>";
	document.getElementById("skipped").innerHTML =
		"<strong>Skipped</strong>: " + (100 - (correct + incorrect)) + "</p>";
	document.getElementById("incorrect").innerHTML =
		"<strong>Incorrect</strong>: " + incorrect + "</p>";

	//Create Chart
	if (scoreChart) {
		scoreChart.destroy();
	}
	scoreChart = new Chart(document.getElementById("chart"), {
		type: "doughnut",
		options: {
			plugins: {
				legend: {
					display: false,
				},
			},
		},
		data: {
			labels: ["Correct", "Skipped", "Incorrect"],
			datasets: [
				{
					data: [correct, 100 - (correct + incorrect), incorrect],
					backgroundColor: [
						"rgb(43, 188, 21)",
						"rgb(54, 162, 235)",
						"rgb(234, 42, 42)",
					],
					hoverOffset: 4,
				},
			],
		},
	});
}

// Scores the test
function scoreTest() {
	document.getElementById("Progress").hidden = true;
	document.getElementById("ProgressPercent").hidden = true;
	document.getElementById("ProgressBar").hidden = true;
	document.getElementById("ProgressText").hidden = true;

	document.querySelectorAll('.selectToSave').forEach(el => {
		el.hidden = false;
	});

	progress = "Scored";

	document.getElementById("reviewButton").innerText = "Results";

	for (let i = 1; i <= 100; i++) {

		document.getElementById("checkboxQ"+i).checked = true;

		// Score

		// Set Red     // Set Green      // Set Blue
		if (data[i][8]) {
			if (data[i][9] == data[i][6]) {
				document
					.getElementById(i + "ReviewChoice" + data[i][9])
					.classList.add("greenRight");
				document
					.getElementById(i + "AnswerChoice" + data[i][9])
					.classList.add("greenRight");
				correct = correct + 1;
				document.getElementById("checkboxQ"+i).checked = false;
			} else if (data[i][9] != data[i][6]) {
				document
					.getElementById(i + "ReviewChoice" + data[i][9])
					.classList.add("redWrong");
				document
					.getElementById(i + "AnswerChoice" + data[i][9])
					.classList.add("redWrong");
				document
					.getElementById(i + "ReviewChoice" + data[i][6])
					.classList.add("actualAnswer");
				document
					.getElementById(i + "AnswerChoice" + data[i][6])
					.classList.add("actualAnswer");
				incorrect = incorrect + 1;
			}
		} else {
			document
				.getElementById(i + "ReviewChoice" + data[i][6])
				.classList.add("actualAnswer");
			document
				.getElementById(i + "AnswerChoice" + data[i][6])
				.classList.add("actualAnswer");
		}

		// Add description
		document.getElementById(i + "Reasoning").hidden = false;
		document.getElementById(i + "Reasoning").innerHTML =
			"<i><strong>" + data[i][7] + "</strong></i>";

		document.getElementById("questionNumber").innerText = "Results Page";
		document.getElementById("RevHead").innerHTML = "<u>Results</u>";

		document.getElementById("subScore").hidden = true;
		document.getElementById("Disclaim").hidden = false;

		// Lock Radio buttons
		document.getElementById("AButton" + i).disabled = true;
		document.getElementById("BButton" + i).disabled = true;
		document.getElementById("CButton" + i).disabled = true;
		document.getElementById("DButton" + i).disabled = true;

		status = "await";
	}

	// Display Score
	displayResults();
}

//Login
function errorOnLogin(error, actual) {
	document.getElementById("errorOnLogin").innerHTML = "Error on " + error;
	console.log(actual);
}

function togglePasswordVisability() {
	if (document.getElementById("showPassword").checked) {
		document.getElementById("PasswordField").type = "text";
	} else {
		document.getElementById("PasswordField").type = "password";
	}
}

function toggleLoginPopup() {
	if (!document.getElementById("LoginPage").classList.contains("open")) {
		document.getElementById("showPassword").checked = false;
		document.getElementById("UsernameTitle").hidden = true;
		document.getElementById("UsernameField").hidden = true;
		document.getElementById("UsernameField").hidden = true;
		document.getElementById("EmailField").value = "";
		document.getElementById("PasswordField").value = "";
		togglePasswordVisability();
		document.getElementById("LoginPage").classList.add("open");
		document.getElementById("errorOnLogin").innerHTML = "";
	} else {
		document.getElementById("LoginPage").classList.remove("open");
	}
}

async function loadUser() {
	console.log("loading user");
	toggleLoginPopup();

	username = await pullFromDatabase("Users/" + user.uid + "/Info/Username");
	if (username != "error") {
		document.getElementById("UsernameText").innerHTML =
			username + " <strong>☰</strong>";
		document.getElementById("LoginExternal").hidden = true;
		document.getElementById("Username").style.display = "flex";
		loggedIn = true;
		document.getElementById("UsernameWithIcon").innerHTML =
			'<img class="icon" src="Icons/user-circle.svg" style="filter: brightness(0) invert(1);"> ' +
			username;
	} else {
		console.error(username);
	}

	testAverage = await pullFromDatabase(
		"Users/" + user.uid + "/Stats/Test_Average"
	);
	if (testAverage != "error") {
		document.getElementById("AvgExam").innerHTML =
			"<strong>Average Exam:</strong> " + testAverage + "%";
	} else {
		console.error(testAverage);
	}

	totalExams = await pullFromDatabase(
		"Users/" + user.uid + "/Stats/Total_Exams"
	);
	if (totalExams != "error") {
		document.getElementById("TotalExams").innerHTML =
			"<strong>Total Exams:</strong> " + totalExams + "";
	} else {
		console.error(totalExams);
	}

	memberSince = await pullFromDatabase(
		"Users/" + user.uid + "/Info/Date_Joined"
	); //comes out in format 2025-07-09T19:52:48.536Z
	if (memberSince != "error") {
		// convert memberSince to "Jan 2025"
		const dateObj = new Date(memberSince);
		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		const formatted = `${
			monthNames[dateObj.getMonth()]
		} ${dateObj.getFullYear()}`;
		document.getElementById("UserSince").innerHTML =
			"<strong>User Since:</strong> " + formatted;
	} else {
		console.error(memberSince);
	}
}

function signUp() {
	email = document.getElementById("EmailField").value;
	password = document.getElementById("PasswordField").value;
	username = document.getElementById("UsernameField").value;
	console.log(email);
	console.log(password);
	if (!document.getElementById("UsernameTitle").hidden) {
		try {
			createUserWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					// Signed in
					user = userCredential.user;
					console.log(true);

					set(ref(database, "Users/" + user.uid + "/Info"), {
						Username: username,
						Email: email,
						Date_Joined: new Date().toISOString(),
					});

					set(ref(database, "Users/" + user.uid + "/Stats"), {
						Test_Average: 0,
						Total_Exams: 0,
					});

					loadUser();
				})
				.catch((error) => {
					errorOnLogin("Sign Up");
				});
		} catch (error) {
			errorOnLogin("Sign Up", error);
		}
	} else {
		document.getElementById("UsernameTitle").hidden = false;
		document.getElementById("UsernameField").hidden = false;
	}
}

function logIn() {
	email = document.getElementById("EmailField").value;
	password = document.getElementById("PasswordField").value;
	console.log(email);
	console.log(password);

	try {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in
				user = userCredential.user;
				console.log(true);
				loadUser();
			})
			.catch((error) => {
				errorOnLogin("Log In", error);
			});
	} catch (error) {
		errorOnLogin("Log In");
	}
}

function logout() {
	if (
		confirm(
			"Are you sure you want to log out? This will refresh all content and end any ongoing practice."
		)
	) {
		signOut(auth)
			.then(() => {
				location.reload();
			})
			.catch((error) => {
				console.error("Error signing out:", error);
			});
	}
}

function bugReport() {
	window.open(
		"https://github.com/JaxGM/DECA-ExamSimulator/issues/new",
		"_blank"
	);
}

function changePassword() {
	sendPasswordResetEmail(auth, email)
		.then(() => {
			alert("A password reset email has been sent to your inbox.");
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			alert(error);
		});
}

function deleteAccount() {
	if (
		confirm("Are you sure you want to delete this account?") &&
		confirm("This action is permanant and will remove all related content.")
	) {
		remove(ref(database, "Users/" + user.uid))
			.then(() => {
				user.delete()
					.then(() => {
						signOut.auth;
						location.reload();
					})
					.catch((error) => {
						alert("Error deleting account: " + error.message);
					});
			})
			.catch((error) => {
				alert("Error deleting user data: " + error.message);
			});
	}
}

function siteInfo() {
	window.open("https://github.com/JaxGM/DECA-ExamSimulator", "_blank");
}

/////////////////////////////////////////////////////////////////////////

// Export the functions
export {
	onStart,
	callQuestion,
	recordResponce,
	altAnswer,
	newExam,
	callReview,
	nextQuestion,
	lastQuestion,
	displayResults,
	scoreTest,
	toggleLoginPopup,
	togglePasswordVisability,
	signUp,
	logIn,
	logout,
	bugReport,
	changePassword,
	deleteAccount,
	siteInfo,
};
