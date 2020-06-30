const csrfInput = document.getElementById('csrf');
const csrfCookie = document.cookie.split('; ').find(
    cookie => cookie.startsWith('csrfToken'));
csrfInput.value = csrfCookie.split('=')[1];


class Timer {

  start() {
    this.startTime = new Date().getTime();
    this.elapsedTime = 0;
  }

  stop() {
    const currentTime = new Date().getTime();
    this.elapsedTime += currentTime - this.startTime;
  }

  getTimeInMs() {
    return this.elapsedTime;
  }
}

let questionTimers = [];

let quizData;
let questions;
let usersAnswers = [];
let currentQuestionNumber;
let questionsAnswered;
let quizTimer;
let elapsedTime;
let receivedDataTime;

fetchDataAndStartQuiz();

function fetchDataAndStartQuiz() {
  Http.Get('/api/quizzes/oneForUser')
  .then(response => response.json())
  .then((response) => {
    receivedDataTime = response.sendDataTime;
    quizData = response.quiz;
    questions = quizData.questions;
    startQuiz();
  });
}

function mainTimerFunc() {
  elapsedTime++;
  document.getElementById('elapsed-time').innerText = elapsedTime + 's';
}

function startQuiz() {
  usersAnswers = Array(questions.length).fill('');
  currentQuestionNumber = 0;
  questionsAnswered = 0;
  elapsedTime = 0;

  document.getElementById('elapsed-time').innerText = '0s';
  document.getElementById('finish-button').classList.remove('finish-active');

  quizTimer = setInterval('mainTimerFunc()', 1000);

  questionTimers = [];
  for (let i = 0; i < questions.length; i++) {
    questionTimers.push(new Timer());
  }
  displayCurrentQuestion();
}

function displayCurrentQuestion() {
  const currentQuestion = questions[currentQuestionNumber];

  setControls();
  setAnswerInput();
  displayQuestionInfo();
  displayPenaltyForQuestion(currentQuestion);
  displayQuestionStatement(currentQuestion);
  questionTimers[currentQuestionNumber].start();
}

function setControls() {
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  const finishButton = document.getElementById('finish-button');
  prevButton.classList.remove('inactive');
  nextButton.classList.remove('inactive');
  finishButton.classList.remove('inactive');
  finishButton.removeAttribute('disabled');

  if (currentQuestionNumber === 0) {
    prevButton.classList.add('inactive');
  }
  if (currentQuestionNumber === questions.length - 1) {
    nextButton.classList.add('inactive');
  }
  const allAnswered = usersAnswers.find(answer => answer === '') === undefined;
  if (!allAnswered) {
    finishButton.classList.add('inactive');
    finishButton.setAttribute('disabled', '');
  }
}

function setAnswerInput() {
  const answerInput = document.getElementById('answer');
  answerInput.value = usersAnswers[currentQuestionNumber];
}

function displayQuestionInfo() {
  const questionNumber = document.getElementById('question-number');
  const questionCount = document.getElementById('question-count');

  questionNumber.innerHTML = `${currentQuestionNumber + 1}`;
  questionCount.innerHTML = `${questions.length}`;
}

function displayPenaltyForQuestion(question) {
  const penaltyElement = document.getElementById('penalty');
  penaltyElement.innerHTML = question.penalty + 's';
}

function displayQuestionStatement(question) {
  const questionElement = document.getElementById('question');
  questionElement.innerHTML = question.statement;
}

/******************************************************************************
 *                           Event listeners
 ******************************************************************************/

document.addEventListener('click', function (event) {
  // event.preventDefault();
  const ele = event.target;
  if (ele.matches('#prev-button')) {
    changeQuestionTo(currentQuestionNumber - 1);
  } else if (ele.matches('#next-button')) {
    changeQuestionTo(currentQuestionNumber + 1);
  } else if (ele.matches('#cancel-button')) {
    cancelQuiz();
  } else if (ele.matches('#finish-button')) {
    finishQuiz();
  }
}, false)

document.getElementById('answer').addEventListener('change', function (event) {
  const ele = event.target;
  saveAnswer(ele.value);

  const allAnswered = usersAnswers.find(answer => answer === '') === undefined;

  const finishButton = document.getElementById('finish-button');
  if (allAnswered) {
    finishButton.classList.remove('inactive');
    finishButton.classList.add('finish-active');
    finishButton.removeAttribute('disabled');
  } else {
    finishButton.classList.remove('finish-active');
    finishButton.classList.add('inactive');
    finishButton.setAttribute('disabled', '');
  }
}, false)

function saveAnswer(value) {
  usersAnswers[currentQuestionNumber] = value;
}

function changeQuestionTo(nextQuestionNumber) {
  if (0 <= nextQuestionNumber && nextQuestionNumber < questions.length) {
    questionTimers[currentQuestionNumber].stop();
    currentQuestionNumber = nextQuestionNumber;
    displayCurrentQuestion();
  }
}

function finishQuiz() {
  const allAnswered = usersAnswers.find(answer => answer === '') === undefined;

  if (allAnswered) {
    clearInterval(quizTimer);
    questionTimers[currentQuestionNumber].stop();
    sendScore();
  }
}

function cancelQuiz() {
  clearInterval(quizTimer);
  questionTimers[currentQuestionNumber].stop();
  window.location.href = '/quiz';
}

function sendScore() {
  const timePercentageForEachQuestion = Array(questions.length).fill(0.0);
  let fullTime = 0;
  for (let i = 0; i < questions.length; i++) {
    fullTime += questionTimers[i].getTimeInMs();
  }
  for (let i = 0; i < questions.length; i++) {
    timePercentageForEachQuestion[i] = questionTimers[i].getTimeInMs()
        / fullTime;
  }

  const data = {
    scoreData: {
      usersAnswers: usersAnswers,
      timePercentageForEachQuestion: timePercentageForEachQuestion
    },
    receivedDataTime: receivedDataTime,
  };
  Http.Post('/api/scores/add', data)
  .then(() => {
    window.location.href = '/quiz';
  });
}
