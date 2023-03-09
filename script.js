const lengthSlider=document.querySelector("[data-lengthSlider]");
const lengthNumber=document.querySelector("[data-lengthNumber]");
const passwordDisplayer=document.querySelector("[data-passwordDisplayer]");
const copy=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-passwordIndicator]");
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols="~!@#$%^&*_+>.,?/':;<`";
let password="";
let checkCount=0;
let passwordLength=10;
setIndicator("#ccc");
handleSlider();
function handleSlider(){
    lengthSlider.value=passwordLength;
    lengthNumber.innerText=passwordLength;
    const min=lengthSlider.min;
    const max=lengthSlider.max;
    lengthSlider.style.backgroundSize=( (passwordLength - min)*100/(max - min)) + "% 100%";
}
function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`
}
function generateRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
function generateRandomNumber(){
    return generateRndInteger(0,9);
}
function generateUppercase(){
    return String.fromCharCode(generateRndInteger(65,91));
}
function generateLowercase(){
    return String.fromCharCode(generateRndInteger(97,123))
}
function generateSymbols(){
    return symbols.charAt(generateRndInteger(0,symbols.length));
}
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum||hasSym) && passwordLength>=8){
        setIndicator('#0f0');
    }
    else if(
        (hasUpper || hasLower)&&
        (hasNum || hasSym)&&
        passwordLength.length>=6
    ){
        setIndicator('#ff0')
    }
    else{
        setIndicator('#f00')
    }
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplayer.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    // To make copy span visible
    copyMsg.classList.add('active');
    setTimeout(()=>{
        copyMsg.classList.remove('active');
    },2000)
}
lengthSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})
copy.addEventListener('click',()=>{
    if(passwordDisplayer.value){
        copyContent();
    }
})
function handleCheckbox(){
checkCount=0;
allCheckBox.forEach((checkbox)=>{
    if(checkbox.checked){
        checkCount++;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
})
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckbox);
})
function shuffle(array){
    //Fisher Yates Method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((element)=>(str+=element));
    return str;
}
generateBtn.addEventListener('click',()=>{
    if(checkCount<=0) return;
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    password="";
    let funArr=[];
    if(uppercaseCheck.checked){
        funArr.push(generateUppercase)
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowercase)
    }
    if(numbersCheck.checked){
        funArr.push(generateRandomNumber)
    }
    if(symbolsCheck.checked){
        funArr.push(generateSymbols)
    }
    // compulsory addition
    for(let i=0;i<funArr.length;i++){
        password+=funArr[i]();
    }
    // remaining addition
    for(let i=0;i<passwordLength-funArr.length;i++){
        let randomIndex=generateRndInteger(0,funArr.length);
        password+=funArr[randomIndex]();
    }
    password=shuffle(Array.from(password));
    passwordDisplayer.value=password;
    calcStrength();

})