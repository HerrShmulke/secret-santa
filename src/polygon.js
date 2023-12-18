const loginButton = document.querySelector('#login-button');
const loginInput = document.querySelector('#login-field');

loginButton.addEventListener('click', () => {
  login();
})

function login() {
  fetch('/auth/login', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: loginInput.value })
  })
}