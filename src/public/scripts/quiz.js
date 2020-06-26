/******************************************************************************
 *                   Fetch and display quizzes for user
 ******************************************************************************/

displayQuizzesForUser();

function displayQuizzesForUser() {
  Http.Get('/api/quizzes/allForUser')
  .then(response => response.json())
  .then((response) => {
    console.log(response);
    const quizzes = response.quizzesForUser;
    const quizzesListAnchor = document.getElementById('quizzes-list-anchor');
    quizzesListAnchor.innerHTML = '';
    quizzes.forEach((quiz) => {
      quizzesListAnchor.innerHTML += getQuizSelectDisplayEle(quiz);
    });
  });
}

function getQuizSelectDisplayEle(quiz) {
  console.log(quiz.name, quiz.finished);
  const disabled = quiz.finished ? 'disabled' : '';
  return `<option value="${quiz.id}" ${disabled}>${quiz.name}</option>`;
}

/******************************************************************************
 *                           Event listeners
 ******************************************************************************/

document.addEventListener('click', function (event) {
  // event.preventDefault();
  const ele = event.target;
  if (ele.matches('#add-quiz-btn')) {
    addQuiz();
  } else if (ele.matches('#change-pwd-btn')) {
    changePassword();
  } else if (ele.matches('#logout-btn')) {
    logoutUser();
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

function logoutUser() {
  Http.Get('/api/auth/logout')
  .then(() => {
    window.location.href = '/';
  })
}

function displayScores() {
  window.location.href = '/scores';
}
