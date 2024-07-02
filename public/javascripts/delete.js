// OPEN & CLOSE MODAL FUNCTIONALITY
const openDeletePostModal = document.querySelectorAll(
  ".open-delete-post-modal"
);
const closeDeletePostModal = document.querySelectorAll(
  ".close-delete-post-modal"
);
const deletePostForm = document.querySelectorAll(".delete-post-form");

const openModal = (index) => {
  if (deletePostForm[index].classList.contains("hidden")) {
    deletePostForm[index].classList.remove("hidden");
  }
};
const closeModal = (index) => {
  if (!deletePostForm[index].classList.contains("hidden")) {
    deletePostForm[index].classList.add("hidden");
  }
};

// BIND EVENTS
for (let i = 0; i < deletePostForm.length; i++) {
  openDeletePostModal[i].addEventListener("click", () => {
    openModal(i);
  });
  closeDeletePostModal[i].addEventListener("click", () => {
    closeModal(i);
  });
}

// PASSWORD VISIBILITY TOGGLE FUNCTION
const togglePasswordVisibility = (inputElem, iconElem, index) => {
  if (inputElem[index].type === "password") {
    inputElem[index].type = "text";
    iconElem[index].src = "/images/eye-off.svg";
  } else {
    inputElem[index].type = "password";
    iconElem[index].src = "/images/eye.svg";
  }
};

const deletePasswordInput = document.querySelectorAll(".delete-password-input");
const toggleDeletePwIcon = document.querySelectorAll(
  ".toggle-delete-pw-visibility"
);

// BIND EVENTS
for (let i = 0; i < deletePasswordInput.length; i++) {
  toggleDeletePwIcon[i].addEventListener("click", () => {
    togglePasswordVisibility(deletePasswordInput, toggleDeletePwIcon, i);
  });
}
