/* 
iPhone Calculator from iOS 13.3.1
by Daniel Martinez-Gamboa (Started: March 2021) 
- keep .html, .css, .js in same directory
- run calculator_index.html in browser
*/

// wish list: refactor displayText.innerText to something like 'display'
// wish list: refactor all buttons to one query selector ".calc-button", and learn to use switch/case: should clean code up alot.

// TODO: make displayText font-size decrease as length of string exceeds display-row; textFit JS lib. should do the job
// TODO: update 'updateClearButton' and 'clearState' functions
// TODO: scientific notation works sometimes, but breaks other times. 
// TODO: highlight currently queued operator button
// TODO: truncate infinitly repeating decimals (i.e 10/3)

const displayText = document.querySelector('.display'); 
const normalButton = document.querySelectorAll('.normal'); 
const specialButton = document.querySelectorAll('.special');
const operatorButton = document.querySelectorAll('.operator');

let storedDisplay = 0;
let queuedOperation = "";
let awaitingInput = true; 
let mostRecentOperand = 0; // for use when pressing equals over and over
let mostRecentOperation = ""; // " "

function debug() {
    console.log(`storedDisplay ${storedDisplay}`);
    console.log(`queuedOperation ${queuedOperation}`);
    console.log(`awaitingInput ${awaitingInput}`);
    console.log(`mostRecentOperand ${mostRecentOperand}`);
    console.log(`mostRecentOperation ${mostRecentOperation}`);
}

function formatDisplay() {
    if (displayText.innerText == "Infinity" || displayText.innerText == "NaN") {
        displayText.innerText = "Error";
    }
    if (displayText.innerText.slice(0,1) == "0" && displayText.innerText.length > 1) { // remove leading zeroes
        displayText.innerText = displayText.innerText.slice(1);
    }
    if (displayText.innerText.split('.').length - 1 > 1) { // remove extra decimal points
        displayText.innerText = displayText.innerText.slice(0,-1);
    }
    // textFit(displayText); // download JS library
    console.log("formatDisplay called");
}

function updateDisplay(value) {
    displayText.innerText = displayText.innerText + value;
    console.log("displayUpdated"); //debugging
}

function storeDisplay() {
    storedDisplay = parseFloat(displayText.innerText);
}

function updateClearButton() { // switch clear button innerText between "C" and "AC"
    if (displayText.innerText == 0 && storedDisplay == 0 && queuedOperation == "") {
        specialButton[0].innerText = "AC";
    }
    else {
        specialButton[0].innerText = "C";
    }
}

function clearState() { 
    if (queuedOperation != "" && displayText.innerText != 0) {
        displayText.innerText = 0;
        awaitingInput = true;
    }
    else if (queuedOperation == "" && displayText.innerText != 0) {
        displayText.innerText =0;
        queuedOperation = "";
        storedDisplay = 0;
        awaitingInput = true; 
        mostRecentOperand = 0;
        mostRecentOperation = "";
    }
    else {
    // if (queuedOperation != "" && displayText.innerText == 0) {
        // queuedOperation = "";
        // storedDisplay = 0;
        // awaitingInput = true; 
        // mostRecentOperand = 0;
        // mostRecentOperation = "";
    }
    // else {
    //     storedDisplay = 0;
    //     displayText.innerText = "0";
    //     awaitingInput = true; 
    //     mostRecentOperand = 0;
    //     mostRecentOperation = "";
    // }
}

function divide() { // updates display after operation
    displayText.innerText = parseFloat(storedDisplay) / parseFloat(mostRecentOperand);
}
function multiply() {
    displayText.innerText = parseFloat(storedDisplay) * parseFloat(mostRecentOperand);
}
function subtract() {
    displayText.innerText = parseFloat(storedDisplay) - parseFloat(mostRecentOperand);
}
function add() {
    displayText.innerText = parseFloat(storedDisplay) + parseFloat(mostRecentOperand);
}

function operate(operation) {
    if (operation == "÷") {
        console.log("divide is being called") //debugging
        divide();
    }
    else if (operation == "×") {
        console.log("multiply is being called") //debugging
        multiply();
    }
    else if (operation == "-") {
        console.log("subtract is being called") //debugging
        subtract();
    }
    else if (operation == "+") {
        console.log("add is being called") //debugging
        add();
    }
    formatDisplay(); // most recent change, switched this with below line: 
    storedDisplay = displayText.innerText;
}

function assignOperation(operator) {  
    if (operator == "=") { //equals is pressed                
        if (queuedOperation == "") { // good
            storeDisplay();
            operate(mostRecentOperation)
            displayText.innerText = storedDisplay;
            console.log("Equals button clicked with no queuedOperation"); // debugging
            awaitingInput = true; 
        }
        else { // good
            console.log("Equals button clicked with queuedOperation"); // debugging
            mostRecentOperand = displayText.innerText;
            mostRecentOperation = queuedOperation;
            operate(mostRecentOperation);
            queuedOperation = "";
            awaitingInput = true;
        }
    }
    else { // all other operator buttons are pressed
        if (queuedOperation == "") {
            console.log("Operation button clicked with no queuedOperation") // debugging
            storeDisplay();
            queuedOperation = operator;
            awaitingInput = true;
        }
        else {
            if (awaitingInput == false) {
                console.log("Operation button clicked with queuedOperation");
                mostRecentOperand = displayText.innerText;
                mostRecentOperation = queuedOperation;
                operate(mostRecentOperation);
                mostRecentOperation = operator;
                queuedOperation = operator;
                awaitingInput = true;
            }
            else {
                queuedOperation = operator;
            }
        }
    }
}

for (let i = 0; i < normalButton.length; i++) { // assigning normal button click event functions (dark grey)
    normalButton[i].addEventListener('click', function() {
        if (awaitingInput) {
            awaitingInput = false;
            displayText.innerText = 0;
        }
        if (displayText.innerText == "Error") {
            displayText.innerText = "0"
        }
        updateDisplay(normalButton[i].innerText);
        updateClearButton();
        formatDisplay();
        debug(); // debugging
    });
}

for (let i = 0; i < specialButton.length; i++) { // assigning special button click event functions (light grey)
    specialButton[i].addEventListener('click', function() {
        if (specialButton[i].innerText == "AC" || specialButton[i].innerText == "C") { 
            clearState();
        }
        else if (specialButton[i].innerText == "+/-") {
            displayText.innerText = -1 * (parseFloat(displayText.innerText));
            storeDisplay();
            formatDisplay();
        }
        else { // percent symbol
            displayText.innerText = (parseFloat(displayText.innerText) / 100);
            storeDisplay();
            formatDisplay();
        }
        updateClearButton();
        debug(); // debugging
    });
}   

for (let i = 0; i < operatorButton.length; i++) { // assigning operator button click event functions (orange)
    operatorButton[i].addEventListener('click', function() {
        assignOperation(operatorButton[i].innerText);
        debug(); // debugging
    });
}