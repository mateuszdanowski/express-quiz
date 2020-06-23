/******************************************************************************
 *                          Fetch and display users
 ******************************************************************************/

displayUsers();
displayQuizzes();

function displayUsers() {
  Http.Get('/api/users/all')
  .then(response => response.json())
  .then((response) => {
    console.log(response);
    const allUsers = response.users;
    // Empty the anchor
    const allUsersAnchor = document.getElementById('all-users-anchor');
    allUsersAnchor.innerHTML = '';
    // Append users to anchor
    allUsers.forEach((user) => {
      allUsersAnchor.innerHTML += getUserDisplayEle(user);
    });
  });
}

function getUserDisplayEle(user) {
  return `<div class="user-display-ele">

        <div class="normal-view">
            <div>Username: ${user.username}</div>
            <div>Password: ${user.pwdHash}</div>
        </div>
    </div>`;
}

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
  }
  else if (ele.matches('#change-pwd-btn')) {
    changePassword();
  } else if (ele.matches('#logout-btn')) {
    logoutUser();
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
