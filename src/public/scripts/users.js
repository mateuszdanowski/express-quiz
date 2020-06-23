/******************************************************************************
 *                          Fetch and display users
 ******************************************************************************/

displayUsers();

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

/******************************************************************************
 *                        Add, Edit, and Delete Users
 ******************************************************************************/

document.addEventListener('click', function (event) {
  event.preventDefault();
  const ele = event.target;
  if (ele.matches('#change-pwd-btn')) {
    changePassword();
  } else if (ele.matches('#logout-btn')) {
    logoutUser();
  }
}, false)

/******************************************************************************
 *                        Add, Edit, and Delete Users
 ******************************************************************************/

function logoutUser() {
  Http.Get('/api/auth/logout')
  .then(() => {
    window.location.href = '/';
  })
}

function changePassword() {
  window.location.href = '/password';
}
