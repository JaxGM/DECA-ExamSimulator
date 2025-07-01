import * as code from './code.js';
window.code = code;

// Run on page load
window.addEventListener("load", () => {
  code.onStart();

  // Set up event listeners here
  document.getElementById("LoginExternal").addEventListener("click", code.toggleLoginPopup);
  document.getElementById("newTest").addEventListener("click", () => code.newExam("test"));
  document.getElementById("enterTraining").addEventListener("click", () => code.newExam("training"));
  document.getElementById("showPassword").addEventListener("click", code.togglePasswordVisability);
  document.getElementById("advancement<").addEventListener("click", code.lastQuestion);
  document.getElementById("advancement>").addEventListener("click", code.nextQuestion);
  document.getElementById("reviewButton").addEventListener("click", code.callReview);
  document.getElementById("subScore").addEventListener("click", code.scoreTest);
  document.getElementById("closeLogin").addEventListener("click", code.toggleLoginPopup);

  // (add others here if needed)
});