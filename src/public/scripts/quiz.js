/******************************************************************************
 *                   Fetch and display quizzes for user
 ******************************************************************************/

displayQuizzesForUser();

function displayQuizzesForUser() {
  Http.Get('/api/quizzes/allForUser')
  .then(response => response.json())
  .then((response) => {
    const quizzes = response.quizzesForUser;
    const quizzesListAnchor = document.getElementById('quizzes-list-anchor');
    quizzesListAnchor.innerHTML = '';
    quizzes.forEach((quiz) => {
      quizzesListAnchor.innerHTML += getQuizSelectDisplayEle(quiz);
    });
  });
}

function getQuizSelectDisplayEle(quiz) {
  const disabled = quiz.finished ? 'disabled' : '';
  return `<option value="${quiz.id}" ${disabled}>${quiz.name}</option>`;
}

/******************************************************************************
 *                           Event listeners
 ******************************************************************************/

document.addEventListener('click', function (event) {
  const ele = event.target;
  if (ele.matches('#add-quiz-btn')) {
    addQuiz();
  } else if (ele.matches('#change-pwd-btn')) {
    changePassword();
  } else if (ele.matches('#display-scores-btn')) {
    displayScores();
  }
}, false)

function addQuiz() {
  window.location.href = '/addQuiz';
}

function changePassword() {
  window.location.href = '/password';
}

function displayScores() {
  window.location.href = '/scores';
}
