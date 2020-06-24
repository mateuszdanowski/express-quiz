document.addEventListener('click', function (event) {
  event.preventDefault();
  const ele = event.target;
  if (ele.matches('#change-password-btn')) {
    changePassword();
  } else if (ele.matches('#go-back-btn')) {
    goBack();
  }
}, false)

function changePassword() {
  const currentPassInput = document.getElementById('current-password-input');
  const newPassInput = document.getElementById('new-password-input');
  const newPassConfirmationInput = document.getElementById(
      'new-password-confirmation-input');
  const data = {
    passwordUpdateData: {
      currentPass: currentPassInput.value,
      newPass: newPassInput.value,
      newPassConfirmation: newPassConfirmationInput.value
    },
  };
  Http.Post('/api/users/update', data)
  .then(response => response.json())
  .then((response) => {
    console.log(response);
    if (response.error) {
      window.location.href = '/password';
    } else {
      logoutUser();
    }
  });
}

function goBack() {
  window.location.href = '/quiz';
}

function logoutUser() {
  Http.Get('/api/auth/logout')
  .then(() => {
    window.location.href = '/';
  })
}
