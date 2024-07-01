const password = document.querySelector("#password");
const toggle = document.querySelector("#toggle-pw");

const togglePassword = () => {
  if (password.type === "password") {
    password.type = "text";
    toggle.src = "/images/eye-off.svg";
  } else {
    password.type = "password";
    toggle.src = "/images/eye.svg";
  }
};

toggle.addEventListener("click", togglePassword);
