/******************************************************************************
 *                          Fetch and display scores
 ******************************************************************************/

displayStatsTemplate();

function displayStatsTemplate() {
  Http.Get('/api/quizzes/allForUser')
  .then(response => response.json())
  .then((response) => {
    const allQuizzes = response.quizzesForUser;
    // Empty the anchor
    const allStatsAnchor = document.getElementById('all-stats-anchor');
    allStatsAnchor.innerHTML = '';
    // Append finished quizzes to anchor
    allQuizzes.forEach((quiz) => {
      if (quiz.finished) {
        allStatsAnchor.innerHTML += getStatsDisplayEle(quiz);
      }
    });
  })
  .then(() => {
    displayScoresForUser().then(resolve => displayHighScoresAndAvgTimes());
  });
}

function getStatsDisplayEle(quiz) {
  return `<div id="data-quiz-id-${quiz.id}" class="stats-display-ele">
            <h1>${quiz.name}</h1>
            <div class="high-scores">
              TOP 5 scores!
              <ol id="scores-for-quiz-id-${quiz.id}"></ol>
            </div>
            <h3>
              Poprawnych odpowiedzi: <span id="correct-for-quiz-id-${quiz.id}">1</span> z <span id="questions-number-for-quiz-id-${quiz.id}">10</span>
            </h3>
            <h2>
              Ostateczny wynik: <span id="result-for-quiz-id-${quiz.id}">1</span>s
            </h2>
            <h1>Informacja zwrotna</h1>
            <ul id="feedback-for-quiz-id-${quiz.id}" class="feedback"></ul>
          </div>`;
}

function displayScoresForUser() {
  Http.Get('/api/scores/allForUser')
  .then(response => response.json())
  .then((response) => {
    const scores = response.scores;
    scores.forEach(score => {
      score.statistics = JSON.parse(score.statistics);
    });

    scores.forEach(score => {
      fillSpanValues(score);
      createFeedback(score);
    });
  });
}

function fillSpanValues(score) {
  const correctElem = document.getElementById(
      `correct-for-quiz-id-${score.quizId}`);
  const questionsNumberElem = document.getElementById(
      `questions-number-for-quiz-id-${score.quizId}`);
  const finalResultElem = document.getElementById(
      `result-for-quiz-id-${score.quizId}`);

  let correct = 0;

  for (let i = 0; i < score.statistics.length; i++) {
    if (score.statistics[i].question.answer
        === score.statistics[i].usersAnswer) {
      correct++;
    }
  }

  correctElem.innerHTML = correct.toString();
  questionsNumberElem.innerText = score.statistics.length.toString();
  finalResultElem.innerHTML = score.result.toString();
}

function createFeedback(score) {
  const feedbackAnchor = document.getElementById(
      `feedback-for-quiz-id-${score.quizId}`);
  for (let i = 0; i < score.statistics.length; i++) {
    feedbackAnchor.innerHTML += createFeedbackForQuestion(score, i);
  }
}

function createFeedbackForQuestion(score, idx) {
  return `<li>
            Pytanie nr ${idx}:
            ${score.statistics[idx].question.statement}
            Twoja odpowiedź:
            ${score.statistics[idx].usersAnswer}
            Poprawna odpowiedź:
            ${score.statistics[idx].question.answer}
            Średni czas:
            <span id="avg-time-for-quiz-id-${score.quizId}-and-question-${idx}">TODO</span>
            Twój czas:
            ${score.statistics[idx].timeSpent}
          </li>`
}

const highScoresLimit = 5;

function displayHighScoresAndAvgTimes() {
  Http.Get('/api/scores/all')
  .then(response => response.json())
  .then((response) => {
    const allScores = response.scores;

    let scoresGroupedByQuiz = {};

    allScores.forEach((score) => {
      if (scoresGroupedByQuiz[score.quizId]) {
        scoresGroupedByQuiz[score.quizId].scores.push(score.result);
        scoresGroupedByQuiz[score.quizId].statistics.push(
            JSON.parse(score.statistics));
      } else {
        scoresGroupedByQuiz[score.quizId] = {
          scores: [score.result],
          statistics: [JSON.parse(score.statistics)],
          quizId: score.quizId,
        };
      }
    });

    displayHighScores(scoresGroupedByQuiz);
    displayAvgTimes(scoresGroupedByQuiz);
  });
}

function displayHighScores(scoresGroupedByQuiz) {
  Object.values(scoresGroupedByQuiz).forEach((quizScores) => {
    quizScores.scores.sort(
        (a, b) => a - b);
    // Find the anchor
    const quizScoresAnchor = document.getElementById(
        `scores-for-quiz-id-${quizScores.quizId}`);
    if (quizScoresAnchor != null) {
      // Append scores to anchor
      quizScores.scores.slice(0, highScoresLimit).forEach((score) => {
        quizScoresAnchor.innerHTML += getScoreDisplayEle(score);
      });
    }
  });
}

function getScoreDisplayEle(score) {
  return `<li>${score}</li>`;
}

function displayAvgTimes(scoresGroupedByQuiz) {
  Object.values(scoresGroupedByQuiz).forEach((quizScores) => {
    let sumTimeForQuestion = Array(quizScores.statistics[0].length).fill(0);

    quizScores.statistics.forEach(statistic => {
      for (let i = 0; i < statistic.length; i++) {
        sumTimeForQuestion[i] += statistic[i].timeSpent;
      }
    });

    let avgTimeForQuestion = Array(quizScores.statistics[0].length);
    for (let i = 0; i < sumTimeForQuestion.length; i++) {
      avgTimeForQuestion[i] = sumTimeForQuestion[i]
          / quizScores.statistics.length;
    }

    for (let i = 0; i < avgTimeForQuestion.length; i++) {
      const avgTime = document.getElementById(
          `avg-time-for-quiz-id-${quizScores.quizId}-and-question-${i}`);
      avgTime.innerHTML = avgTimeForQuestion[i].toString();
    }
  });
}

/******************************************************************************
 *                          Event listeners
 ******************************************************************************/

document.addEventListener('click', function (event) {
  event.preventDefault();
  const ele = event.target;
  if (ele.matches('#go-back-btn')) {
    goBack();
  }
}, false)

function goBack() {
  window.location.href = '/quiz';
}
