// TODO: Make the bat cursor

const 
    screenWidth = document.body.clientWidth,
    loadScreen  = document.querySelector('.loadscreen'),
    res_error   = document.querySelector('.resolution-error'),
    store          = window.localStorage;

const
    holes          = document.querySelectorAll('.hole'),
    doggos         = document.querySelectorAll('.doggo'),
    scoreBoard     = document.querySelector('.score'),
    countdownBoard = document.querySelector('.countdown'),
    startBtn       = document.querySelector('.startbutton'),
    bonkSound      = document.getElementById('bonkSound'),
    bestScore      = document.querySelector('.bestscore'),
    bat            = document.querySelector('.batCursor');

let
    timeUp    = false,
    timeLimit = 40000, 
    score     = 0,
    maxTime   = 1300,
    countdown,
    lastHole;

function loadData() {

    loadScreen.style.display = 'flex';

    window.onresize = function (e) {
        window.location = window.location.href;
    };

    window.addEventListener('click', bonkCursor);

    startBtn.addEventListener('click', startGame);

    doggos.forEach(doggo => doggo.addEventListener('click', bonk));

    if (store.getItem('score') === null) {
        store.setItem('score', 0);
    }

    bestScore.textContent = "Your best score: " + store.getItem('score');

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (screenWidth < 800) {
                reject();
            } else {
                resolve();
            }
        }, 1000);
    });
}

loadData()
    .then(() => {
        loadScreen.style.display = 'none';
    })
    .catch(() => {
        res_error.style.display = 'block';
    });

function pickRandomHole(holes) {
    const randomHole = Math.floor(Math.random() * holes.length);
    const hole = holes[randomHole];
    if (hole === lastHole) {
        return pickRandomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function popOut() {
    const time = Math.random() * maxTime + 400;
    const hole = pickRandomHole(holes);
    hole.classList.add('up');
    if (score > 10) maxTime = 400;
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) popOut();
    }, time);
}

function startGame() {
    startBtn.disabled = true;
    countdown = timeLimit/1000;
    scoreBoard.textContent = 0;
    scoreBoard.style.display = 'block';
    countdownBoard.textContent = countdown;
    score = 0;
    timeUp = false;
    popOut();
    setTimeout(() => {
        timeUp = true;
    }, timeLimit);

    let startCountDown = setInterval(() => {
        countdown -= 1;
        countdownBoard.textContent = countdown;
        if (countdown < 0) {
            clearInterval(startCountDown);
            countdownBoard.textContent = 'Times up!';
            startBtn.disabled = false;
            if (store.getItem('score') < score) {
                store.setItem('score', score);
                bestScore.textContent = "Your new best score: " + score;``
            }
        }
    }, 1000);
}

function bonk() {
    bonkSound.play();
    score++;
    this.style.backgroundImage = `url("./assets/cried_doggo.png")`;
    this.style.pointerEvents = 'none';
    setTimeout(() => {
        this.style.backgroundImage = `url("./assets/doggo.png")`;
        this.style.pointerEvents = 'all';
    }, 800);
    scoreBoard.textContent = score;
}

function bonkCursor() {
    document.body.style.cursor = `url("./assets/baseball-bat(bonked).png") 128 4, pointer`;
    setTimeout(() => {
        document.body.style.cursor = `url("./assets/baseball-bat.png") 128 64, pointer`;
    }, 200);
}