const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//satrting
let password = "";
let passLength = 10;
let checkCount = 0;

handleSlider();
setIndictor("#ccc");

function handleSlider() {
  inputSlider.value = passLength;
  lengthDisplay.innerText = passLength;

  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passLength - min) * 100) / (max - min) + "$ 100%";
}

function setIndictor(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNo() {
  return getRandomInt(0, 9);
}
function generateUpperCase() {
  return String.fromCharCode(getRandomInt(65, 91));
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInt(97,123));
}
function generateSymbol() {
  const randNum = getRandomInt(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passLength >= 8) {
    setIndictor("#0f0");
  } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passLength >= 6) {
    setIndictor("#ff0");
  } else {
    setIndictor("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }
  //make copy span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  //fidher vase method
  for (let i = array.length - 1; i > 0; i--) {
    //random j,find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index andj index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  //special condition
  if (passLength < checkCount) {
    passLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  //none of the checkbox are selected
  if (checkCount == 0) {
    return;
  }
  if (passLength < checkCount) {
    passLength = checkCount;
    handleSlider();
  }

  // let's start the jouney to find new password
  console.log("Starting the Journey");
  //remove old password
  password = "";

  let funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);

  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);

  if (numbersCheck.checked) funcArr.push(generateRandomNo);

  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  //compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("Compulsory adddition done");

  //remaining adddition
  for (let i = 0; i < passLength - funcArr.length; i++) {
    let randIndex = getRandomInt(0, funcArr.length);
    console.log("randIndex" + randIndex);
    password += funcArr[randIndex]();
  }
  console.log("Remaining adddition done");
  //shuffle the password
  password = shufflePassword(Array.from(password));
  console.log("Shuffling done");
  //show in UI
  passwordDisplay.value = password;
  console.log("UI adddition done");
  //calculate strength
  calcStrength();
});
