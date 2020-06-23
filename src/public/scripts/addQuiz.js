document.addEventListener('click', function (event) {
  event.preventDefault();
  const ele = event.target;
  if (ele.matches('#add-quiz-btn')) {
    addQuiz();
  } else if (ele.matches('#go-back-btn')) {
    goBack();
  }
}, false)

function addQuiz() {
  const name = document.getElementById('quiz-name-input');
  const content = document.getElementById('quiz-content-input');
  const data = {
    quiz: {
      name: name.value,
      content: content.value
    },
  };
  Http.Post('/api/quizzes/add', data)
  .then(response => response.json())
  .then((response) => {
    console.log(response);
    if (response.error) {
      window.location.href = '/addQuiz';
    } else {
      goBack();
    }
  });
}

function goBack() {
  window.location.href = '/users';
}
