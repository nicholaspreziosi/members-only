const passwordInput = document.querySelector("#password");
const confirmInput = document.querySelector("#confirm");
const togglePwIcon = document.querySelector("#toggle-pw");
const toggleConfirmIcon = document.querySelector("#toggle-confirm");

const togglePassword = () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePwIcon.src = "/images/eye-off.svg";
  } else {
    passwordInput.type = "password";
    togglePwIcon.src = "/images/eye.svg";
  }
};

const toggleConfirm = () => {
  if (confirmInput.type === "password") {
    confirmInput.type = "text";
    toggleConfirmIcon.src = "/images/eye-off.svg";
  } else {
    confirmInput.type = "password";
    toggleConfirmIcon.src = "/images/eye.svg";
  }
};

togglePwIcon.addEventListener("click", togglePassword);
toggleConfirmIcon.addEventListener("click", toggleConfirm);
