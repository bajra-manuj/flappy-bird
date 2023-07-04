// moving background
const HOLEHEIGHT = 300;
const GAMEHEIGHT = 800;

const game = document.getElementById("game");
const pipeTop = document.getElementById("pipe-top");
const pipeBottom = document.getElementById("pipe-bottom");
const bird = document.getElementById("bird");
const scoreElem = document.getElementById("score");
const highScoreElem = document.getElementById("highscore");

let jumpHeight = 0;
let birdTop = 200;
let score = 0;
let pipeLeft = 800;
let initialOffset = Math.random() * 300 + 50;
const highScore = getHighScoreFromLocalStorage();
highScoreElem.innerText = highScore;

pipeBottom.style.bottom = "0px";
function getHighScoreFromLocalStorage() {
  const highScore = parseInt(localStorage.getItem("highscore"));
  if (highScore) {
    return highScore;
  }
  return 0;
}

function frame() {
  if (pipeLeft === -100) {
    pipeLeft = 800;
    const bottomPipeHeight = parseInt(Math.random() * 300) + 50;
    const topPipeHeight = GAMEHEIGHT - bottomPipeHeight - HOLEHEIGHT;
    pipeTop.style.height = `${topPipeHeight}px`;
    pipeBottom.style.height = `${bottomPipeHeight}px`;
    score += 1;
    scoreElem.innerText = score;
  } else {
    pipeLeft -= 5;
  }
  pipeBottom.style.left = `${pipeLeft}px`;
  pipeTop.style.left = `${pipeLeft}px`;
  if (jumpHeight === 0) {
    birdTop = Math.min(birdTop + 3, 750);
    bird.className = "";
  } else {
    birdTop = Math.max(birdTop - 5, 0);
    bird.className = "soaring";
    jumpHeight -= 5;
  }
  bird.style.top = `${birdTop}px`;
  if (isColliding()) {
    clearInterval(id);
    let highscore = Math.max(score, highScore || 0);
    localStorage.setItem("highscore", highscore);
  }
}

function isColliding() {
  let birdPos = bird.getBoundingClientRect();
  let pipeTopPos = pipeTop.getBoundingClientRect();
  let pipeBottomPos = pipeBottom.getBoundingClientRect();
  let holePos = {
    bottom: pipeBottomPos.top,
    top: pipeTopPos.bottom,
  };

  if (birdPos.top > holePos.top && birdPos.bottom < holePos.bottom) {
    console.log(false);
    return false;
  }
  if (birdPos.right < pipeTopPos.left || birdPos.left > pipeTopPos.right) {
    return false;
  }
  return true;
}

const bottomPipeHeight = parseInt(Math.random() * 400);
const topPipeHeight = GAMEHEIGHT - bottomPipeHeight - HOLEHEIGHT;
pipeTop.style.height = `${topPipeHeight}px`;
pipeBottom.style.height = `${bottomPipeHeight}px`;

var id = setInterval(frame, 8.3);
document.addEventListener("keydown", (e) => {
  if (e.keyCode === 32) {
    jumpHeight += 100;
  }
});
