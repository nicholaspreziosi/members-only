// MEMBER FORM TOGGLE FUNCTIONALITY
const memberInput = document.querySelector("#member");
const memberToggle = document.querySelector("#member-toggle");
const memberSubmit = document.querySelector("#member-submit");
const memberPassword = document.querySelector("#member-password-container");
const memberValue = memberInput.value;

const toggleMemberIcon = () => {
  if (memberToggle.getAttribute("src") === `/images/toggle.svg`) {
    memberToggle.src = `/images/toggle-off.svg`;
    memberInput.value = "false";
  } else {
    memberToggle.src = `/images/toggle.svg`;
    memberInput.value = "true";
  }
};

const compareMemberInputValues = () => {
  let newMemberInput = document.querySelector("#member");
  if (newMemberInput.value !== memberValue) {
    memberPassword.classList.remove("hidden");
    memberSubmit.classList.remove("hidden");
  } else {
    memberPassword.classList.add("hidden");
    memberSubmit.classList.add("hidden");
  }
};

memberToggle.addEventListener("click", () => {
  toggleMemberIcon();
  compareMemberInputValues();
});

// ADMIN FORM TOGGLE FUNCTIONALITY
const adminInput = document.querySelector("#admin");
const adminToggle = document.querySelector("#admin-toggle");
const adminSubmit = document.querySelector("#admin-submit");
const adminPassword = document.querySelector("#admin-password-container");
const adminValue = adminInput.value;

const toggleAdminIcon = () => {
  if (adminToggle.getAttribute("src") === `/images/toggle.svg`) {
    adminToggle.src = `/images/toggle-off.svg`;
    adminInput.value = "false";
  } else {
    adminToggle.src = `/images/toggle.svg`;
    adminInput.value = "true";
  }
};

const compareAdminInputValues = () => {
  let newAdminInput = document.querySelector("#admin");
  if (newAdminInput.value !== adminValue) {
    adminPassword.classList.remove("hidden");
    adminSubmit.classList.remove("hidden");
  } else {
    adminPassword.classList.add("hidden");
    adminSubmit.classList.add("hidden");
  }
};

adminToggle.addEventListener("click", () => {
  toggleAdminIcon();
  compareAdminInputValues();
});

//EDIT INFO FUNCTIONALITY
const firstNameInput = document.querySelector("#first_name");
const firstNameSubmit = document.querySelector("#first-name-submit");

const lastNameInput = document.querySelector("#last_name");
const lastNameSubmit = document.querySelector("#last-name-submit");

const toggleFirstName = () => {
  if (firstNameSubmit.disabled === true) {
    firstNameSubmit.disabled = false;
  }
};

const toggleLastName = () => {
  if (lastNameSubmit.disabled === true) {
    lastNameSubmit.disabled = false;
  }
};

firstNameInput.addEventListener("input", toggleFirstName);
lastNameInput.addEventListener("input", toggleLastName);

// TOGGLE MEMBER PASSWORD VISIBILITY
const memberPasswordInput = document.querySelector("#member-password");
const toggleMemberVisibilityIcon = document.querySelector(
  "#toggle-member-pw-visbility"
);

const toggleMemberPasswordVisbility = () => {
  if (memberPasswordInput.type === "password") {
    memberPasswordInput.type = "text";
    toggleMemberVisibilityIcon.src = "/images/eye-off.svg";
  } else {
    memberPasswordInput.type = "password";
    toggleMemberVisibilityIcon.src = "/images/eye.svg";
  }
};

toggleMemberVisibilityIcon.addEventListener(
  "click",
  toggleMemberPasswordVisbility
);

// TOGGLE ADMIN PASSWORD VISIBILITY
const adminPasswordInput = document.querySelector("#admin-password");
const toggleAdminVisibilityIcon = document.querySelector(
  "#toggle-admin-pw-visbility"
);

const toggleAdminPasswordVisbility = () => {
  if (adminPasswordInput.type === "password") {
    adminPasswordInput.type = "text";
    toggleAdminVisibilityIcon.src = "/images/eye-off.svg";
  } else {
    adminPasswordInput.type = "password";
    toggleAdminVisibilityIcon.src = "/images/eye.svg";
  }
};

toggleAdminVisibilityIcon.addEventListener(
  "click",
  toggleAdminPasswordVisbility
);

// CHANGE PASSWORD FUNCIONALITY
const savePasswordBtn = document.querySelector("#save-password");
const oldPasswordInput = document.querySelector("#old-password");
const newPasswordInput = document.querySelector("#new-password");
const confirmPasswordInput = document.querySelector("#confirm-password");

const togglePasswordSave = () => {
  if (savePasswordBtn.disabled === true) {
    savePasswordBtn.disabled = false;
  }
};

oldPasswordInput.addEventListener("input", togglePasswordSave);
newPasswordInput.addEventListener("input", togglePasswordSave);
confirmPasswordInput.addEventListener("input", togglePasswordSave);
