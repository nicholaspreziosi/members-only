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

// PASSWORD VALIDATION
const comparePasswords = () => {
  if (
    confirmInput.value.length > 0 &&
    passwordInput.value !== confirmInput.value
  ) {
    passwordInput.classList.remove("border-slate-500");
    confirmInput.classList.remove("border-slate-500");
    passwordInput.classList.add("border-red-500");
    confirmInput.classList.add("border-red-500");
    passwordInput.classList.add("focus:outline-none");
    confirmInput.classList.add("focus:outline-none");
  } else {
    passwordInput.classList.remove("border-red-500");
    confirmInput.classList.remove("border-red-500");
    passwordInput.classList.remove("focus:outline-none");
    confirmInput.classList.remove("focus:outline-none");
    passwordInput.classList.add("border-slate-500");
    confirmInput.classList.add("border-slate-500");
  }
};

passwordInput.addEventListener("input", comparePasswords);
confirmInput.addEventListener("input", comparePasswords);
