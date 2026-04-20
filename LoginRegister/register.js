const form = document.getElementById("signupForm");

const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");

// ERROR ELEMENTS
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmError = document.getElementById("confirmError");
const termsError = document.getElementById("termsError");

// VALIDATION FUNCTIONS
function validateName() {
  if (name.value.trim() === "") {
    nameError.textContent = "Name is required";
    return false;
  }
  nameError.textContent = "";
  return true;
}

function validateEmail() {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.value.trim())) {
    emailError.textContent = "Enter valid email";
    return false;
  }
  emailError.textContent = "";
  return true;
}

function validatePassword() {
  if (password.value.length < 6) {
    passwordError.textContent = "Min 6 characters";
    return false;
  }
  passwordError.textContent = "";
  return true;
}

function validateConfirm() {
  if (confirmPassword.value !== password.value) {
    confirmError.textContent = "Passwords do not match";
    return false;
  }
  confirmError.textContent = "";
  return true;
}

function validateTerms() {
  if (!terms.checked) {
    termsError.textContent = "Accept terms";
    return false;
  }
  termsError.textContent = "";
  return true;
}

// REAL-TIME
name.addEventListener("input", validateName);
email.addEventListener("input", validateEmail);
password.addEventListener("input", validatePassword);
confirmPassword.addEventListener("input", validateConfirm);

// SUBMIT
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const valid =
    validateName() &&
    validateEmail() &&
    validatePassword() &&
    validateConfirm() &&
    validateTerms();

  if (valid) {
    alert("Signup Successful 🎉");
  }
});

// PASSWORD TOGGLE
function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

// THEME
document.getElementById("themeToggle").onclick = () => {
  document.documentElement.dataset.theme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
};

// RTL
document.getElementById("rtlToggle").onclick = () => {
  document.documentElement.dir =
    document.documentElement.dir === "rtl" ? "ltr" : "rtl";
};