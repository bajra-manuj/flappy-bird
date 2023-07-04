const HOLEHEIGHT = 300;
const GAMEHEIGHT = 800;
const GAMEWIDTH = 800;

class Entity {
  constructor() {
    if (this.constructor == Entity) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }
  getRect() {
    throw new Error("Method 'getRect()' must be implemented.");
  }
  isColliding() {
    throw new Error("Method 'isColliding()' must be implemented.");
  }
}

class Pipe extends Entity {
  constructor(pipeBottom, pipeTop) {
    super();
    this.pipeBottom = pipeBottom;
    this.pipeTop = pipeTop;
    this.randomizeHeights();
    this.pipeBottom.style.bottom = "0px";
    this.setLeft(GAMEWIDTH);
  }
  getRect() {
    return this.pipe.getBoundingClientRect();
  }
  isColliding(birdPos) {
    let pipeTopPos = this.pipeTop.getBoundingClientRect();
    let pipeBottomPos = this.pipeBottom.getBoundingClientRect();
    let holePos = {
      bottom: pipeBottomPos.top,
      top: pipeTopPos.bottom,
    };

    if (birdPos.top > holePos.top && birdPos.bottom < holePos.bottom) {
      return false;
    }
    if (birdPos.right < pipeTopPos.left || birdPos.left > pipeTopPos.right) {
      return false;
    }
    return true;
  }
  randomizeHeights() {
    const bottomPipeHeight = parseInt(Math.random() * 400);
    const topPipeHeight = GAMEHEIGHT - bottomPipeHeight - HOLEHEIGHT;
    this.pipeTop.style.height = `${topPipeHeight}px`;
    this.pipeBottom.style.height = `${bottomPipeHeight}px`;
  }

  setLeft(left) {
    this.pipeBottom.style.left = `${left}px`;
    this.pipeTop.style.left = `${left}px`;
  }
}

class Bird extends Entity {
  constructor(birdElem) {
    super();
    this.bird = birdElem;
    this.topPos = 200;
  }
  getRect() {
    return this.bird.getBoundingClientRect();
  }
  jump(jumpDist) {
    this.topPos = Math.max(this.topPos - jumpDist, 0);
    this.bird.style.top = `${this.topPos}px`;
    bird.className = "soaring";
  }
  fall(fallDist) {
    this.topPos = Math.min(
      this.topPos + fallDist,
      GAMEHEIGHT - this.getRect().height
    );
    this.bird.style.top = `${this.topPos}px`;
    bird.className = "";
  }

  isAtTop() {
    if (Math.abs(this.bird.style.top - GAMEHEIGHT) <= 10) {
      return true;
    }
    return false;
  }
}

class Score {
  constructor(scoreElem, highScoreElem) {
    this.score = 0;
    this.scoreElem = scoreElem;
    this.highScoreElem = highScoreElem;
    const highScore = parseInt(localStorage.getItem("highscore"));
    this.highScoreElem.innerText = highScore;
    this.highScore = highScore || 0;
  }
  incScore() {
    this.score += 1;
    this.scoreElem.innerText = this.score;
  }
  updateHighScore() {
    if (this.score > this.highScore) {
      localStorage.setItem("highscore", this.score);
      this.highScoreElem.innerText = this.score;
    }
  }
}

class Game {
  constructor(gameElem, pipeElem, birdElem, scoreElem) {
    this.gameElem = gameElem;
    this.pipeElem = pipeElem;
    this.birdElem = birdElem;
    this.scoreElem = scoreElem;
    this.isOver = false;
    this.pipeLeft = GAMEWIDTH;
    this.jumpHeight = 0;
    this.pipeElem.setLeft(this.pipeLeft);
  }
  run() {
    let id = setInterval(() => {
      if (this.isOver) {
        clearInterval(id);
        return;
      }
      if (this.pipeLeft <= -100) {
        this.pipeLeft = GAMEWIDTH;
        this.scoreElem.incScore();
        const bottomPipeHeight = parseInt(Math.random() * 300) + 50;
        const topPipeHeight = GAMEHEIGHT - bottomPipeHeight - HOLEHEIGHT;
        pipeTop.style.height = `${topPipeHeight}px`;
        pipeBottom.style.height = `${bottomPipeHeight}px`;
      } else {
        this.pipeLeft -= 5;
      }
      this.pipeElem.setLeft(this.pipeLeft);
      if (this.jumpHeight === 0) {
        this.birdElem.fall(3);
      } else {
        this.birdElem.jump(5);
        this.jumpHeight -= 5;
      }
      if (pipe.isColliding(this.birdElem.getRect())) {
        this.isOver = true;
        this.scoreElem.updateHighScore();
      }
    }, 8.3);
  }
  triggerJump() {
    if (!this.birdElem.isAtTop()) {
      this.jumpHeight += 100;
    }
  }
}

const game = document.getElementById("game");
const pipeTop = document.getElementById("pipe-top");
const pipeBottom = document.getElementById("pipe-bottom");
const bird = document.getElementById("bird");
const scoreElem = document.getElementById("score");
const highScoreElem = document.getElementById("highscore");

let birdElem = new Bird(bird);
let pipe = new Pipe(pipeBottom, pipeTop);
let scoreObj = new Score(scoreElem, highScoreElem);
let gameObj = new Game(game, pipe, birdElem, scoreObj);

gameObj.run();

document.addEventListener("keydown", (e) => {
  if (e.keyCode === 32) {
    gameObj.triggerJump();
  }
});
