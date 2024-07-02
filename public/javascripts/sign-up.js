// PASSWORD VISIBILITY TOGGLE FUNCTION
const togglePasswordVisibility = (inputElem, iconElem) => {
  if (inputElem.type === "password") {
    inputElem.type = "text";
    iconElem.src = "/images/eye-off.svg";
  } else {
    inputElem.type = "password";
    iconElem.src = "/images/eye.svg";
  }
};

const passwordInput = document.querySelector("#password");
const confirmInput = document.querySelector("#confirm");
const togglePwIcon = document.querySelector("#toggle-pw");
const toggleConfirmIcon = document.querySelector("#toggle-confirm");

togglePwIcon.addEventListener("click", () => {
  togglePasswordVisibility(passwordInput, togglePwIcon);
});
toggleConfirmIcon.addEventListener("click", () => {
  togglePasswordVisibility(confirmInput, toggleConfirmIcon);
});

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
