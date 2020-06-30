const csrfInput = document.getElementById('csrf');
const csrfCookie = document.cookie.split('; ').find(
    cookie => cookie.startsWith('csrfToken'));
csrfInput.value = csrfCookie.split('=')[1];
