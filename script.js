document.addEventListener('DOMContentLoaded', () => {
    const result = document.getElementById('result');
    const expression = document.getElementById('expression');
    const loader = document.getElementById('loader');
    let currentInput = '';
    let currentOperator = '';
    let previousInput = '';
    let shiftMode = false;
    let alphaMode = false;

    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.add('pressed');
            setTimeout(() => button.classList.remove('pressed'), 200);

            const action = button.dataset.action;
            const digit = button.dataset.digit;

            if (digit) handleDigit(digit);
            if (action) handleAction(action);

            updateDisplay();
        });
    });

    function handleDigit(digit) {
        if (currentInput === 'Error') clear();
        if (currentInput.includes('.') && digit === '.') return;
        if (currentInput === '0' && digit !== '.') currentInput = '';
        currentInput += digit;
    }

    function handleAction(action) {
        switch (action) {
            case 'shift':
                shiftMode = !shiftMode;
                alphaMode = false;
                break;
            case 'alpha':
                alphaMode = !alphaMode;
                shiftMode = false;
                break;
            case 'mode':
            case 'mixed':
            case 'degree':
            case 'hyp':
            case 'eng':
            case 'sto':
            case 'm-plus':
            case 'rcl':
            case 'ans':
                // Placeholder for future functionality
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
            case 'power':
                handleOperator(action);
                break;
            case 'dot':
                handleDigit('.');
                break;
            case 'ac':
                clear();
                break;
            case 'del':
                currentInput = currentInput.slice(0, -1) || '0';
                break;
            case 'calculate':
                calculate();
                break;
            case 'sqrt':
                currentInput = Math.sqrt(parseFloat(currentInput)).toString();
                break;
            case 'square':
                currentInput = (parseFloat(currentInput) ** 2).toString();
                break;
            case 'log':
                currentInput = Math.log10(parseFloat(currentInput)).toString();
                break;
            case 'ln':
                currentInput = Math.log(parseFloat(currentInput)).toString();
                break;
            case 'sin':
            case 'cos':
            case 'tan':
                handleTrigonometry(action);
                break;
            case 'minus':
                currentInput = (parseFloat(currentInput) * -1).toString();
                break;
            case 'open-bracket':
            case 'close-bracket':
                // Placeholder for future functionality
                break;
            case 'exp':
                handleOperator('multiply');
                currentInput = '10';
                handleOperator('power');
                break;
        }
    }

    function handleOperator(operator) {
        if (currentOperator && currentInput) {
            calculate();
        }
        previousInput = currentInput;
        currentInput = '';
        currentOperator = operator;
    }

    function calculate() {
        if (!previousInput || !currentInput) return;

        expression.textContent = `${previousInput} ${getOperatorSymbol(currentOperator)} ${currentInput} =`;
        result.textContent = '';
        loader.style.display = 'block';

        setTimeout(() => {
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            let resultValue;

            switch (currentOperator) {
                case 'add': resultValue = prev + current; break;
                case 'subtract': resultValue = prev - current; break;
                case 'multiply': resultValue = prev * current; break;
                case 'divide': resultValue = current !== 0 ? prev / current : 'Error'; break;
                case 'power': resultValue = prev ** current; break;
            }

            if (resultValue !== 'Error') {
                resultValue = Math.round(resultValue * 1e10) / 1e10; // Round to 10 decimal places
            }
            currentInput = resultValue.toString();
            previousInput = '';
            currentOperator = '';

            loader.style.display = 'none';
            updateDisplay();
        }, 800); // Simulating calculation time (800ms)
    }

    function handleTrigonometry(func) {
        const angle = parseFloat(currentInput) * (Math.PI / 180); // Convert to radians
        switch (func) {
            case 'sin': currentInput = Math.sin(angle).toString(); break;
            case 'cos': currentInput = Math.cos(angle).toString(); break;
            case 'tan': currentInput = Math.tan(angle).toString(); break;
        }
    }

    function clear() {
        currentInput = '';
        previousInput = '';
        currentOperator = '';
        expression.textContent = '';
        result.textContent = '';
        loader.style.display = 'none';
    }

    function getOperatorSymbol(operator) {
        const symbols = { add: '+', subtract: '-', multiply: '×', divide: '÷', power: '^' };
        return symbols[operator] || '';
    }

    function updateDisplay() {
        const maxDigits = 12; // You can adjust this number
        if (currentInput.length > maxDigits) {
            currentInput = currentInput.slice(0, maxDigits);
        }

        if (currentInput === 'Error') {
            result.textContent = 'Error';
        } else if (currentInput === '') {
            result.textContent = '';
        } else {
            result.textContent = Number(currentInput).toLocaleString('en-US', {
                maximumFractionDigits: 10,
                useGrouping: true
            });
        }
    }

    // Enhanced Keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (/\d/.test(key)) handleDigit(key);
        if (key === '.') handleAction('dot');
        if (['+', '-', '*', '/', '^'].includes(key)) handleAction(getActionFromSymbol(key));
        if (key === 'Enter') handleAction('calculate');
        if (key === 'Backspace') handleAction('del');
        if (key === 'Escape') handleAction('ac');
        if (key === 's') handleAction('sin');
        if (key === 'c') handleAction('cos');
        if (key === 't') handleAction('tan');
        if (key === 'l') handleAction('log');
        if (key === 'n') handleAction('ln');
        if (key === 'r') handleAction('sqrt');
        if (key === 'q') handleAction('square');
        updateDisplay();
        event.preventDefault();
    });

    function getActionFromSymbol(symbol) {
        const actions = { '+': 'add', '-': 'subtract', '*': 'multiply', '/': 'divide', '^': 'power' };
        return actions[symbol] || '';
    }
});