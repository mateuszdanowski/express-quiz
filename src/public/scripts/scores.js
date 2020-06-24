/******************************************************************************
 *                          Fetch and display scores
 ******************************************************************************/

displayQuizNamesUserFinished();
displayScores();

function displayQuizNames() {
  Http.Get('/api/quizzes/all')
  .then(response => response.json())
  .then((response) => {
    console.log(response);
    const allQuizzes = response.quizzes;
    // Empty the anchor
    const allScoresAnchor = document.getElementById('all-scores-anchor');
    allScoresAnchor.innerHTML = '';
    // Append quizNames to anchor
    allQuizzes.forEach((quiz) => {
      allScoresAnchor.innerHTML += getQuizNameDisplayEle(quiz);
    });
  });
}

function getQuizNameDisplayEle(quiz) {
  return `<div class="score-display-ele">
            <div class="normal-view">
                <div>Name: ${quiz.name}</div>
                <div>Id: ${quiz.id}</div>
            </div>
            <ol id="data-quiz-id-${quiz.id}">
              
            </oi>
    </div>`;
}

const highScoresLimit = 5;

function displayScores() {
  Http.Get('/api/scores/all')
  .then(response => response.json())
  .then((response) => {
    console.log(response);
    const allScores = response.scores;

    let scoresGroupedByQuiz = {};

    allScores.forEach((score) => {
      if (scoresGroupedByQuiz[score.quizId]) {
        scoresGroupedByQuiz[score.quizId].scores.push(score.result);
      } else {
        scoresGroupedByQuiz[score.quizId] = {
          scores: [score.result],
          quizId: score.quizId
        };
      }
    });

    Object.values(scoresGroupedByQuiz).forEach((quizScores) => {
      quizScores.scores.sort(
          (a, b) => Number(a.slice(0, -1)) - Number(b.slice(0, -1)));
      // Find the anchor
      const quizScoresAnchor = document.getElementById(
          `data-quiz-id-${quizScores.quizId}`);
      if (quizScoresAnchor != null) {
        // Append scores to anchor
        quizScores.scores.slice(0, highScoresLimit).forEach((score) => {
          quizScoresAnchor.innerHTML += getScoreDisplayEle(score);
        });
      }
    });
  });
}

function getScoreDisplayEle(score) {
  return `<li>${score}</li>`;
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
  window.location.href = '/users';
}
