const csrfInput = document.getElementById('csrf');
const csrfCookie = document.cookie.split('; ').find(
    cookie => cookie.startsWith('csrfToken'));
csrfInput.value = csrfCookie.split('=')[1];

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

  if (newPassInput.value !== '' && newPassConfirmationInput.value !== '') {
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
      if (response.error) {
        printErr(response.error);
      } else {
        window.location.href = '/logout';
      }
    });
  }
}

function goBack() {
  window.location.href = '/quiz';
}

function printErr(err) {
  alert(err);
  console.log(err);
}
