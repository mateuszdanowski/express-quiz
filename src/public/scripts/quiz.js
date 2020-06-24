/******************************************************************************
 *                          Fetch and display quizzes
 ******************************************************************************/

// const userId = (req!.user as User)._id as string;
// const quizzes = (await db.quizzes.find({})) as Quiz[];
//
// const activeQuizzes = await Promise.all(
//     quizzes.map(async quiz => {
//       const quizWithActivity = quiz as QuizWithActivity;
//       quizWithActivity.done =
//           (await db.results.count({userId: userId, quizId: quiz.id})) > 0;
//       return quizWithActivity;
//     })
// );
// return res.render('index', {quizzes: activeQuizzes});
//
// displayQuizzes();
//
// markActiveQuizzesForUser

function displayQuizzes() {
  Http.Get('/api/quizzes/all')
  .then(response => response.json())
  .then((response) => {
    console.log(response);
    const allQuizzes = response.quizzes;
    // Empty the anchor
    const allQuizzesAnchor = document.getElementById('all-quizzes-anchor');
    allQuizzesAnchor.innerHTML = '';
    // Append users to anchor
    allQuizzes.forEach((quiz) => {
      allQuizzesAnchor.innerHTML += getQuizDisplayEle(quiz);
    });
  });
}

function getQuizDisplayEle(quiz) {
  return `<div class="user-display-ele">

        <div class="normal-view">
            <div>Name: ${quiz.name}</div>
            <div>Content: ${quiz.content}</div>
        </div>
    </div>`;
}

/******************************************************************************
 *                        Add, Edit, and Delete Users
 ******************************************************************************/

document.addEventListener('click', function (event) {
  event.preventDefault();
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

/******************************************************************************
 *                        Add, Edit, and Delete Users
 ******************************************************************************/

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
