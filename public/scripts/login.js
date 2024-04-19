function togglePassword(str) {
  let passwordField = document.querySelector("#pswd-input" + str);
  let toggleImage = document.getElementById("toggle-icon" + str);
  let toggleText = document.getElementById("toggle-text" + str);
  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleImage.src = "hide_pswd.svg";
    toggleText.innerHTML = "Hide password";
  } else {
    passwordField.type = "password";
    toggleImage.src = "show_pswd.svg";
    toggleText.innerHTML = "Show password";
  }
}

function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

const createBtn = document.querySelector("#create-account");
const loginBtn = document.querySelector("#login");

try{
  createBtn.addEventListener("click", () => {
    window.location.href = "signup";
  });
}
catch{
  loginBtn.addEventListener("click", () => {
    window.location.href = "login";
  });
}