document.addEventListener('click', function (event) {
  event.preventDefault();
  const ele = event.target;
  console.log(ele);
  if (ele.matches('#login-btn')) {
    const usernameInput = document.getElementById('username-input');
    const pwdInput = document.getElementById('pwd-input');
    const data = {
      username: usernameInput.value,
      password: pwdInput.value
    };
    Http.Post('/api/auth/login', data)
    .then(() => {
      window.location.href = '/users';
    })
  }
}, false)
