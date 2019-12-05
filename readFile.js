const fs = require("fs");
const { stdout, stdin } = process;
stdin.setEncoding("utf8");

const recordCounter = function(contestantRecord, questionBank, index) {
  console.clear();
  stdout.write(`Correct Answers: ${contestantRecord.correct}\n`);
  stdout.write(`Incorrect Answers: ${contestantRecord.incorrect}\n`);
  stdout.write(questionFormatter(questionBank, index));
};

const questionFormatter = function(questionBank, index) {
  if (index >= questionBank.length) {
    process.exit();
  }
  const question = questionBank[index].question;
  const options = Object.entries(questionBank[index].options)
    .map(option => option.join(": "))
    .join("\n");
  return `${question}\n${options}\n`;
};

const startQuiz = function(questionBank, contestantRecord) {
  let index = 0;
  const checkAnswer = function(userOption = "wrong") {
    clearTimeout(timeout);
    if (userOption.trim() == questionBank[index].correctAnswer) {
      contestantRecord.correct++;
    } else {
      contestantRecord.incorrect++;
    }
    index++;
    recordCounter(contestantRecord, questionBank, index);
    timeout = setTimeout(checkAnswer, 3000);
  };
  stdout.write(questionFormatter(questionBank, index));
  stdin.on("data", checkAnswer);
  let timeout = setTimeout(checkAnswer, 3000);
};

const readFile = function() {
  let contestantRecord = { correct: 0, incorrect: 0 };
  fs.readFile("./questionFile.json", "utf8", (err, data) => {
    const questionBank = JSON.parse(data);
    startQuiz(questionBank, contestantRecord);
  });
};

readFile();
