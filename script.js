const inputSlider = document.querySelector("[data-lengthSlider]");  //get by custom attribute
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]"); 
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
handleSlider();
let checkCount = 0;
setIndicator("#ccc");


//set PasswordLength on UI
function handleSlider(){
    inputSlider.value =  passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min) * 100 / (max-min)) + `% 100%`;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max-min)) + min; //int between min-max
}

function generateRandomNumber(){
    return getRandomInt(0, 9);
}

function generateLowercase(){
    return String.fromCharCode(getRandomInt(97, 123)); //ascii to char
}   

function generateUppercase(){
    return String.fromCharCode(getRandomInt(65, 91)); 
} 

function generateSymbol(){
    const randomNum =  getRandomInt(0, symbols.length);
    return symbols.charAt(randomNum);
}

//rules
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
      setIndicator("#0f0");
    } 
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
      setIndicator("#ff0");
    } 
    else{
      setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value); //returns promise
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = 'failed';
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

//shuffle algo - fisher yates method(applied on array)
function shufflePassword(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckboxChange(){
    checkCount =0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });
    
    // edge condition
    if(passwordLength < checkCount)
        passwordLength = checkCount;
        
        handleSlider();
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange)
});

inputSlider.addEventListener('input', (event) => {
    passwordLength = event.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', ()=>{
     if(passwordDisplay.value)
        copyContent();
});

generateBtn.addEventListener('click', ()=>{
   //none of the checkbox is selected
   if(checkCount == 0) return;

   if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
   }

    //to find new passwd
    console.log('find the pass');
    //remove old passwd
    password = "";
   
    let funcArr = [];

    if(uppercaseCheck.checked) 
        funcArr.push(generateUppercase);
    if(lowercaseCheck.checked) 
        funcArr.push(generateLowercase);
    if(numbersCheck.checked) 
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked) 
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i](); //func call
    }    
    console.log('compulsory addition done');

    //remaining addition
    for(let i=0; i<(passwordLength - funcArr.length); i++){
        let randomIndex = getRandomInt(0, funcArr.length);
        password += funcArr[randomIndex]();
    }
    console.log('remaining addition done');

    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log('shuffling done');

    //show in UI
    passwordDisplay.value = password;
    console.log('UI update done');

    //calc the strength
    calcStrength();
    
});
