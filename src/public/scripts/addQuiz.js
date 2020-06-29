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
  const questions = document.getElementById('quiz-questions-input');
  // Check if name is not html
  if (!/<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/.test(
      name.value)) {
    const data = {
      quiz: {
        name: name.value.innerText,
        questions: questions.value
      },
    };
    Http.Post('/api/quizzes/add', data)
    .then(response => response.json())
    .then((response) => {
      if (response.error) {
        window.location.href = '/addQuiz';
      } else {
        goBack();
      }
    });
  }
}

function goBack() {
  window.location.href = '/quiz';
}
