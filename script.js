const form = document.querySelector('form');
const Q10 = document.getElementById('Q10');
const Q25 = document.getElementById('Q25');
const Q50 = document.getElementById('Q50');
const Q99 = document.getElementById('Q99');

const eqContainer = document.querySelector('.equations-container');
const inputContainer = document.querySelector('.input-container');
const resultsContainer = document.querySelector('.results-container');
const buttonContainer = document.querySelector('.button-container');

const resultTimeEl = document.getElementById('time');
const baseTimeEl = document.getElementById('base-time-span');
const penaltyTimeEl = document.getElementById('penalty-time-span');

const submitBtn = document.getElementById('submit');
const rightBtn = document.getElementById('right');
const wrongBtn = document.getElementById('wrong');
const playAgainBtn = document.getElementById('play-again');

const highScoresAll = document.querySelectorAll('.bestScoreNumber');

const countdownContainer = document.querySelector(".countdown-container");

// Questions Arrays
let questions = [];
// Answer Array
let actualAnswerArray = [];
let userAnswerArray = [];
// Get Number of clicks
let clicks = 1;
// Get Total Equations
let nEquations = 0;
// ScrollTo Buffer
let scrollToBuffer = 1
// Countdown Checker
const countdownTime = 3 //Use this to change the countdown time.
let countdownChecker = countdownTime;
let interval = function(){};
// Change Navigation function
// Capture Time
let startTime = 0;
let endTime = 0;
let baseTime = 0;
let penaltyTime = 0;
// High Score
let highScores = {
    10: [0, '0.0s'],
    25: [0, '0.0s'],
    50: [0, '0.0s'],
    99: [0, '0.0s'],
};

function setHighScores() {
    if (localStorage.getItem('highScore')) {
        highScores = JSON.parse(localStorage.getItem('highScore'));
    } else {
        localStorage.setItem('highScore', highScores);
    }
    // Display the high scores
    Array.from(highScoresAll, (el, index) => el.textContent = Object.values(highScores)[index][1]);
}

function changeNav(screen) {
    if (screen === 'playScreen' && nEquations > 0) {
        inputContainer.classList.add('hidden');
        countdownContainer.classList.remove('hidden');
        countdownContainer.textContent = countdownChecker;
        // Hide Submit Button
        submitBtn.hidden = true;
        buttonContainer.style.background =  'rgba(255, 255, 255, 0.6)';
        countdownChecker--;
            interval = setInterval(()=>{
                if (countdownChecker === 0) {
                    countdownChecker--;
                    countdownContainer.textContent = 'GO!';    
                } else if (countdownChecker === -1) {
                    showEquationPage();
                    clearInterval(interval);
                } else {
                    countdownContainer.textContent = countdownChecker;
                    countdownChecker--;
                }
            },1000)
    } else if (screen === 'resultsScreen') {
        // Change Container
        eqContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        // Change Buttons
        rightBtn.hidden = true;
        wrongBtn.hidden = true;
        setTimeout(() => playAgainBtn.hidden = false ,1000)
        buttonContainer.style.background =  'rgba(255, 255, 255, 0.6)';
        
    } else {
        // Reset background color
        // Change Container
        resultsContainer.classList.add('hidden');
        inputContainer.classList.remove('hidden');
        buttonContainer.style.background =  'black';
        // Change Buttons
        playAgainBtn.hidden = true;
        submitBtn.hidden = false;
        // Fetch Latest High Score
        setHighScores();
        
    };
}


function showEquationPage() {
    clearInterval(interval);
    // Change Container
    countdownContainer.classList.add('hidden');
    eqContainer.classList.remove('hidden');
    buttonContainer.style.background =  'black';
    // Change Buttons
    
    rightBtn.hidden = false;
    wrongBtn.hidden = false;
    // Add Styling for first equation:
    document.getElementById('equation1').classList.add('active-equation-background');
    // Scroll to first equation
    document.getElementById('equation' + scrollToBuffer).scrollIntoView({block: "center"});
    countdownChecker = countdownTime;
    countdownContainer.textContent = countdownChecker;      
}

// Functionality
function generateEquations() {
    let number1 = [];
    let number2 = [];
    number1 = Array.from({length: nEquations}, () => Math.floor(Math.random() * 11));
    number2 = Array.from({length: nEquations}, () => Math.floor(Math.random() * 11));
    let equationsArray = [];
    
    // Right Wrong Logic + Add to Answer Array
    number1.forEach((number, i) => {
        
        // Randomly decide whether to push the right answer
        if (Math.floor(Math.random() * 2) === 1) {
            const rightAnswer = number * number2[i];
            equationsArray.push(`${number} X ${number2[i]} = ${rightAnswer}`);
            actualAnswerArray.push(1);
             
        } else {
            // Otherwise generate and push the wrong answer
            // Add some jitter to the wrong answer
            let jitter = Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3)
            // If jitter becomes 0, then answer is right, so make it wrong
            jitter = jitter === 0 ? 1 : jitter;
            
            const wrongAnswer = number * number2[i] + jitter;
            equationsArray.push(`${number} X ${number2[i]} = ${wrongAnswer}`);
            actualAnswerArray.push(0);
        }
         
    })
    return equationsArray;
}

function storeFormData(e) {
    const selectedOption = [Q10.checked, Q25.checked, Q50.checked, Q99.checked];
    e.preventDefault();
    // Reset ScrollTo buffer
    scrollToBuffer = 1;
    // Reset Number of clicks
    clicks = 1;
    // Reset necessary time variables
    baseTime = 0;
    penaltyTime = 0;
    // Reset User & Answer Arrays
    actualAnswerArray = [];
    userAnswerArray = [];
    
    const indices = selectedOption.reduce(
        (acc, bool, index) => bool ? acc.concat(index) : acc, 
        []
      )
    
    switch (indices[0]) {
        case 0:
            nEquations = 10;
            questions = generateEquations(10);
            createDOM(10);
            break;
        case 1:
            nEquations = 25;
            questions = generateEquations(25);
            createDOM(25);
            break;
        case 2:
            nEquations = 50;
            questions = generateEquations(50);
            createDOM(50);
            break;
        case 3:
            nEquations = 99;
            questions = generateEquations(99);
            createDOM(99);
            break;
    }

    changeNav('playScreen');

}

function scrollEquation(userGuess) {
    n = nEquations;
    // Start Timer if first click
    clicks === 1 ? startTime = performance.now() : false;
    // Push guess to user Answer Array
    userGuess === 1 ? userAnswerArray.push(1) : userAnswerArray.push(0);
    

    scrollToBuffer++
    document.getElementById('equation' + scrollToBuffer).scrollIntoView({block: "center"});
    clicks++
    clicks > 1 ? document.getElementById('equation' + Number(clicks - 1)).classList.remove('active-equation-background') : false;
    document.getElementById('equation' + clicks).classList.add('active-equation-background');
    if (clicks === n + 1) {
        changeNav('resultsScreen');
        endTime = performance.now();
        // Check how many wrong answers
        userAnswerArray.forEach((e, i) => {
            if (e != actualAnswerArray[i]) {
                penaltyTime += 0.5;
            };
        })
        
        // Set TextContent
        baseTimeEl.textContent = ((endTime - startTime) / 1000).toFixed(1);
        penaltyTimeEl.textContent = penaltyTime.toFixed(1);
        timeTaken = ((endTime - startTime + (penaltyTime * 1000)) / 1000);
        resultTimeEl.textContent = timeTaken.toFixed(1) + 's';
        
        // Check and set high score
        if (highScores[nEquations][0] > timeTaken || highScores[nEquations][0] === 0){
            highScores[nEquations] = [timeTaken, resultTimeEl.textContent];
            localStorage.setItem('highScore', JSON.stringify(highScores));
            // Fetch Latest High Score
            setHighScores();
        }
        
    }
}

function createDOM() {
    const newEquations = Array.from(Array(nEquations).keys()).map(e => 'equation' + Number(e+1));
    // Reset the equations container
    eqContainer.textContent = '';
    
    // First add 4 empty divs to leave some whitespace at the top
    for (let index = -3; index < 1; index++) {
        const newBlankDiv = document.createElement('div');
        newBlankDiv.setAttribute('id', 'equation' + index);
        newBlankDiv.textContent = '\u00A0';
        eqContainer.appendChild(newBlankDiv);
    }

    // Build out the equations
    newEquations.forEach((eq, i) => {
        const newEq = document.createElement('div');
        const question = questions[i]
        newEq.setAttribute('id', eq);
        newEq.textContent = `\u00A0\u00A0\u00A0${question}`;
        eqContainer.appendChild(newEq);
        // After all equations are built, add 3 blank divs at the end for aesthetics.
        if (i === newEquations.length - 1) {
            for (let index = i + 2; index < i + 7; index++) {
                const newBlankDiv = document.createElement('div');
                newBlankDiv.setAttribute('id', 'equation' + index);
                newBlankDiv.textContent = '\u00A0';
                eqContainer.appendChild(newBlankDiv);
            }
        }
    })
}

form.addEventListener('submit', (e) => storeFormData(e));
playAgainBtn.addEventListener('click', changeNav);

// Always fetch the high scores from local storage
setHighScores();