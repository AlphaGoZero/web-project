
const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const _bgMusic = document.getElementById("myAudio"); 
const _clickSound = document.getElementById("click-sound");
const _clickSound2 = document.getElementById("click-sound-2");
const _winSound = document.getElementById("win-sound");
const _errorSound = document.getElementById("error-sound");
const _interfaceSound = document.getElementById("interface-sound");

var category = 0;
var difficulty = 0;
var type = 0;
var maxScore = 0;
let correctAnswer = "";
let correctScore = askedCount = 0;
let totalQuestion = 0;


// load question from API
async function loadQuestion(){
    var APIUrl = 'https://opentdb.com/api.php?amount=1';
    if (category !== 0){
        APIUrl += '&category=' + category;
    }
    if (difficulty !== 0){
        APIUrl += '&difficulty=' + difficulty;
    }
    if (type !== 0){
        APIUrl += '&type=' + type;
    }
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();
    _result.innerHTML = "";
    showQuestion(data.results[0]);
}

// event listeners
function eventListeners(){
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    _totalQuestion.textContent = maxScore;
    _correctScore.textContent = correctScore;
});


// display question and options
function showQuestion(data){
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    // console.log(correctAnswer);

    
    _question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}


// options selection
function selectOption(){
    _options.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// answer checking
function checkAnswer(){
    _checkBtn.disabled = true;
    if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer == HTMLDecode(correctAnswer)){
            winSound();
            correctScore++;
            if (correctScore > maxScore){
                maxScore = correctScore;
            }
            _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
        } else {
            errorSound();
            correctScore = 0;
            _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        _checkBtn.disabled = false;
    }
}

// to convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

// if player answers 2000 questions, the highscore will be showed and change to 0.
function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == 2000){
        setTimeout(function(){
            console.log("");
        }, 5000);
        _result.innerHTML += `<p>Your current highscore is ${max}.</p>`;
        maxScore = 0;
        askedCount = 0;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(function(){
            loadQuestion();
        }, 1000);
    }
}

function setCount(){
    _totalQuestion.textContent = maxScore;
    _correctScore.textContent = correctScore;
}

//change the URL suffix according to button action
function set(item){
    interfaceSound();
    if (item === "RC"|| item === "RD" || item === "RT"){
        switch(item){
            case "RC":
                category = 0;
                break;
            case "RD":
                difficulty = 0;
                break;
            case "RT":
                type = 0;
                break;
        }
    }else if(item === "multiple" || item === "boolean"){
        type = item;
    }else if(item === "easy" || item === "medium" || item === "hard"){
        difficulty = item;
    } else {
        category = item;
    }
    loadQuestion();
}

function darkMode() {
    clickSound(0);
    var element = document.body;
    element.classList.toggle("dark-mode");
}

var x = document.getElementById("myAudio"); 
function playAudio() { 
    clickSound(0);
    _bgMusic.play(); 
} 

function pauseAudio() { 
    clickSound(0);
    _bgMusic.pause();
    _bgMusic.currentTime = 0;
} 

let volume = document.getElementById('volume-slider');
volume.addEventListener("change", function(e) {
    _bgMusic.volume = e.currentTarget.value / 100;
})

function clickSound(value){
    if (value === 0) {
        _clickSound.play();
    }else {
        _clickSound2.play();
    }
}

function winSound(){
    _winSound.play();
}

function errorSound(){
    _errorSound.play();
}

function interfaceSound(){
    _interfaceSound.play();
}

// reset the quiz game
function restartQuiz(){
    clickSound(0);
    category = type = difficulty = maxScore = 0;
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}

var textWrapper = document.querySelector('.ml9 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
.add({
    targets: '.ml9 .letter',
    scale: [0, 1],
    duration: 6000,
    elasticity: 600,
    delay: (el, i) => 45 * (i+1)
}).add({
    targets: '.ml9',
    opacity: 0,
    duration: 1000,
    easing: "easeInOutSine",
    direction: 'alternate',
    delay: 1000,
    delay: anime.stagger(100, {from: 'center'})
});

var ztxt = new Ztextify(".hero-text", {
    depth: "30px",
    layers: 20,
    fade: true,
    direction: "forwards",
    event: "pointer",
    eventRotation: "35deg"
 });
