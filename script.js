
var screen = document.getElementById('display')

function appendToDisplay(num) {
    if(screen.textContent==0){
        screen.innerText =`${num}`
    }else{
        screen.innerText += `${num}`;
    }
}

function clearAll() {
    screen.innerHTML = ""
}

function clearLast(num) {
    screen.textContent = screen.textContent.slice(0, -1);
}

function oncal(expression) {
    let tokens = expression.match(/(\d+(\.\d+)?)|[+\-*/()]/g);
    if (!tokens) return "Error"

    let numStack = []
    let opstack = []

    let precedence = { "+": 1, "-": 1, "*": 2, "/": 2, "(": 0 };

    function applyop() {
        if (numStack.length < 2 || opstack.length === 0) return;

        let b = numStack.pop();
        let a = numStack.pop();
        let op = opstack.pop();

        let result;
        switch (op) {
            case "+": result = a + b; break;
            case "-": result = a - b; break;
            case "*": result = a * b; break;
            case "/": result = a / b; break;
            default: return;
        }
        numStack.push(result);
    }

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];


        if (!isNaN(parseFloat(token))) {
            numStack.push(parseFloat(token));

            if (i > 0 && tokens[i - 1] === ")") {
                opstack.push("*")    // insert implicit multiplication
            }
        }
        else if (token === "(") {
            if (i > 0 && (!isNaN(parseFloat(tokens[i - 1])) || tokens[i - 1] === ")")) {
                opstack.push("*");   // Insert implicit multiplication
            }
            opstack.push(token);
        }
        
        else if (token === ")") {
            while (
                opstack.length > 0 &&
                opstack[opstack.length - 1] !== "(") {
                applyop();
            }
            opstack.pop();
        }
        else {
            while (
                opstack.length > 0 &&
                precedence[opstack[opstack.length - 1]] >= precedence[token] && opstack[opstack.length - 1] !== "("
            ) {
                applyop();
            }
            opstack.push(token)
        }
    }
    while (opstack.length > 0) {
        applyop();
    }
    return numStack.length > 0 ? numStack[0] : "Error";
}

function calculateResult() {
    let expression = screen.textContent;
    let result = oncal(expression);
    screen.textContent = result;
}
