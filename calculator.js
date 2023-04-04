let currentNumber;
let previousNumber = null;
let operationInProgress = false;
let operatorSymbol;
let operatorName;
let populationInProgress = false;
let result;

let roundingDecimal = 6;
const disabledDisplayColor = '#0000007c';
const enabledDisplayColor = '#000000';

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b !== 0) {
        return a / b;
    }
    else return "Math ERROR";
}

function roundToDecimal(number, decimal)
{
    return Math.round(number * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

function operate(operatorName, a, b) {
    // operationInProgress = false;
    switch (operatorName) {
        case 'add':
            result = add(a, b);
            return roundToDecimal(result, roundingDecimal);
        case 'subtract':
            result = subtract(a, b);
            return roundToDecimal(result, roundingDecimal);
        case 'divide':
            result = divide(a, b);
            return roundToDecimal(result, roundingDecimal);
        case 'multiply':
            result = multiply(a, b);
            return roundToDecimal(result, roundingDecimal);
        case 'percent':
            break;
        case 'sign':
            break;
        case 'equals':
            break;
    }
    
}

function populateDisplay(e) {
    //handle start value is 0
    if (currentDisplay.textContent === '0') {
        if (e === '.') {
            updateCurrentDisplay('0.');
            return;
        }
        updateCurrentDisplay(e);
        currentNumber = Number(currentDisplay.textContent);
        populationInProgress = true;
        return;
    }
    //handle if operator pressed
    if (operationInProgress && !populationInProgress) {
        updateCurrentDisplay('');
        // operationInProgress = false;
    }
    //handle decimal point
    if (e === '.' && !currentDisplay.textContent.includes('.')) {
        updateCurrentDisplay(`${currentDisplay.textContent}.`);
        return;
    }
    else if (e === '.' && currentDisplay.textContent.includes('.')) {
        return;
    }
    updateCurrentDisplay(`${currentDisplay.textContent}${e}`);
    
    currentNumber = Number(currentDisplay.textContent);
    populationInProgress = true;
}

function updateCurrentDisplay(text) {
    currentDisplay.textContent = text;
}

function updatePreviousDisplay(text, operatorSymbol) {
    if (operatorSymbol !== undefined) {
        previousDisplay.textContent = text + operatorSymbol;
        return;
    }
    previousDisplay.textContent = text;
}

function clearDisplay() {
    currentNumber = 0;
    updateCurrentDisplay(currentNumber);
    previousNumber = null;
    updatePreviousDisplay(previousNumber);
    result = 0;
    enableButtons(numberButtons);
    operationInProgress = false;
    currentDisplay.style.color = enabledDisplayColor;
}

function disableButtons(buttons) {
    buttons.forEach(button => button.disabled = true);
    currentDisplay.style.color = disabledDisplayColor;
}

function enableButtons(buttons) {
    buttons.forEach(button => button.disabled = false);
}

function backspace() {
    if (currentDisplay.textContent.length === 1) {
        updateCurrentDisplay('0');
        currentNumber = 0;
        return;
    }
    if (!operationInProgress) {
        previousNumber = null;
    }
    currentDisplay.textContent = currentDisplay.textContent.slice(0,-1);
    currentNumber = Number(currentDisplay.textContent);
    enableButtons(numberButtons);
    enableButtons(operatorButtons);
    currentDisplay.style.color = enabledDisplayColor;
}

// function observeCurrentDisplay(mutation, observer) {
//     if (currentDisplay.textContent.length > 9) {
//         console.log('too many digits');
//         disableButtons(numberButtons);
//         disableButtons(operatorButtons);
//     }
// }

// function observePreviousDisplay(mutation, observer) {
//     if (previousDisplay.textContent.length > 9) {
//         console.log('too many digits');
//         previousDisplay.classList.add("ellipsis");
//     }
// }

function doOperation(e) {
    // if there is already a previous operation
    if (operationInProgress) {
        // if two or more operators pressed in a row, do nothing
        if (!populationInProgress) {
            operatorSymbol = e.target.textContent;
            updatePreviousDisplay(previousNumber, operatorSymbol);
            return;
        }
        result = operate(operatorName, previousNumber, currentNumber);
        previousNumber = result;
        updateCurrentDisplay(result);
        operatorSymbol = e.target.textContent;
        updatePreviousDisplay(result, operatorSymbol);
        operatorName = e.target.id;
        console.log(`${e.target.textContent} pressed`);
        operationInProgress = true;
        populationInProgress = false;
        return;
    }
    //if there is no previous operation
    operatorSymbol = e.target.textContent;
    operatorName = e.target.id;
    console.log(`${e.target.textContent} pressed`);
    previousNumber = currentNumber;
    updatePreviousDisplay(currentNumber, operatorSymbol);
    operationInProgress = true;
    populationInProgress = false;
}

// function doOperation(operatorName, operatorSymbol) {
//     // if there is already a previous operation
//     if (operationInProgress) {
//         // if two or more operators pressed in a row, do nothing
//         if (!populationInProgress) {
//             updatePreviousDisplay(previousNumber, operatorSymbol);
//             return;
//         }
//         result = operate(operatorName, previousNumber, currentNumber);
//         previousNumber = result;
//         updateCurrentDisplay(result);
//         updatePreviousDisplay(result, operatorSymbol);
//         console.log(`${operatorSymbol} pressed`);
//         operationInProgress = true;
//         populationInProgress = false;
//         return;
//     }
//     //if there is no previous operation
//     console.log(`${operatorSymbol} pressed`);
//     previousNumber = currentNumber;
//     updatePreviousDisplay(currentNumber, operatorSymbol);
//     operationInProgress = true;
//     populationInProgress = false;
// }
//DO SIGN CHANGING
//DO PERCENT
//DO KEYBOARD OPERATOR INPUT
//DO MAGIC KEYS

function equals() {
    populationInProgress = false;
    operationInProgress = false;
    console.log(`equals pressed`);
    if (operatorName === 'equals') {
        return;
    }
    if (currentNumber === null) {
        return;
    }
    result = operate(operatorName, previousNumber, currentNumber);
    operatorName = 'equals';
    updateCurrentDisplay(result);
    updatePreviousDisplay(`${previousNumber}${operatorSymbol}${currentNumber}=`)
    previousNumber = null;
    currentNumber = Number(currentDisplay.textContent);
}

function handleKeyboardInput(e) {
    if (e.key >= 0 && e.key <= 9 || e.key === '.') populateDisplay(e.key);
    if (e.key === '=' || e.key === 'Enter') equals()
    if (e.key === 'Backspace') backspace();
    if (e.key === 'Escape') clearDisplay();
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/')
      doOperation();
}


const previousDisplay = document.getElementById("display-previous");
const currentDisplay = document.getElementById("display-current");
const numberButtons = document.querySelectorAll(".number-button");
const operatorButtons = document.querySelectorAll(".operator-button");
const clearButton = document.getElementById("clear");
const backspaceButton = document.getElementById("backspace");
const equalsButton = document.getElementById("equals");


// const currentDisplayObserverOptions = {childList: true};
// const currentDisplayObserver = new MutationObserver(observeCurrentDisplay);
// currentDisplayObserver.observe(currentDisplay, currentDisplayObserverOptions);

// const previousDisplayObserverOptions = {childList: true};
// const previousDisplayObserver = new MutationObserver(observePreviousDisplay);
// previousDisplayObserver.observe(previousDisplay, previousDisplayObserverOptions);

backspaceButton.addEventListener("click", backspace);

clearButton.addEventListener("click", clearDisplay);
operatorButtons.forEach(button => button.addEventListener("click", doOperation));
// operatorButtons.forEach(button => button.addEventListener("click",(e) => doOperation(e.target.id, e.target.textContent)));
equalsButton.removeEventListener("click", doOperation);
equalsButton.addEventListener("click", equals);
numberButtons.forEach(button => button.addEventListener("click", (e) => populateDisplay(e.target.textContent)));
window.addEventListener('keydown', handleKeyboardInput)