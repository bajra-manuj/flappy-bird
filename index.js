// moving background
// set highscore and store in localstorage

const game = document.getElementById("game");
const pipe = document.getElementById("pipe");
const hole = document.getElementById("hole");
const bird = document.getElementById("bird");
const scoreElem = document.getElementById("score");

let jumpHeight = 0;
let birdTop = 200;
let score = 0;
const highScore = parseInt(localStorage.getItem("highscore"));
if (highScore) {
  document.getElementById("highscore").innerText = highScore;
}

function frame() {
  if (pipeLeft === -100) {
    pipeLeft = 800;
    score += 1;
    scoreElem.innerText = score;
    let offset = Math.max(Math.random() * 450, 50);
    hole.style.top = `${offset}px`;
  } else {
    pipeLeft -= 5;
    pipe.style.left = `${pipeLeft}px`;
  }
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
  let holePos = hole.getBoundingClientRect();
  let pipePos = pipe.getBoundingClientRect();

  if (birdPos.top > holePos.top && birdPos.bottom < holePos.bottom) {
    return false;
  }
  if (birdPos.right < pipePos.left || birdPos.left > pipePos.right) {
    return false;
  }
  return true;
}

var id = setInterval(frame, 8.3);
let pipeLeft = 800;
let initialOffset = Math.random() * 300 + 50;
hole.style.top = `${initialOffset}px`;
document.addEventListener("keydown", (e) => {
  if (e.keyCode === 32) {
    jumpHeight += 100;
  }
});
