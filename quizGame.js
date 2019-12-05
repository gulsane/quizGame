const fs = require("fs");
const { stdout, stdin } = process;
stdin.setEncoding("utf8");

const recordCounter = function(contestantRecord, questionBank, questionNumber) {
  console.clear();
  stdout.write(`Correct Answers: ${contestantRecord.correct}\n`);
  stdout.write(`Incorrect Answers: ${contestantRecord.incorrect}\n`);
  stdout.write(questionFormatter(questionBank, questionNumber));
};

const questionFormatter = function(questionBank, questionNumber) {
  if (questionNumber >= questionBank.length) {
    process.exit();
  }
  const question = questionBank[questionNumber].question;
  const options = Object.entries(questionBank[questionNumber].options)
    .map(option => option.join(": "))
    .join("\n");
  return `${question}\n${options}\nEnter Option:`;
};

const startQuiz = function(questionBank, contestantRecord) {
  let questionNumber = 0;
  const checkAnswer = function(userOption = "wrong") {
    clearTimeout(timeout);
    if (userOption.trim() == questionBank[questionNumber].answer) {
      contestantRecord.correct++;
    } else {
      contestantRecord.incorrect++;
    }
    questionNumber++;
    recordCounter(contestantRecord, questionBank, questionNumber);
    timeout = setTimeout(checkAnswer, 3000);
  };
  stdout.cursorTo(40, 15);
  stdout.write(questionFormatter(questionBank, questionNumber));
  stdin.on("data", checkAnswer);
  let timeout = setTimeout(checkAnswer, 3000);
};

const main = function() {
  let contestantRecord = { correct: 0, incorrect: 0 };
  fs.readFile("./questionFile.json", "utf8", (err, data) => {
    const questionBank = JSON.parse(data);
    startQuiz(questionBank, contestantRecord);
  });
};

main();