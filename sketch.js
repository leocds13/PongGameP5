let level = 0;
let score = {
  player: 0,
  enemy: 0
}

let racketWidth = 10;
let racketHeight = 150;
let racketX = 15;

let racketPlayerY = 0;
let racketEnemyY = 0;

let racketVelocity = 6;

let ballSize = 15;
let ballRadio = ballSize/2;
let ballX = 0;
let ballY = 0;

let ballVelocityX = 6;
let ballVelocityY = 6;

//sons do jogo
let racketedSound;
let pointSound;
let backgroundSound;

function preload() {
  backgroundSound = loadSound("MusicaFundo.wav");
  pointSound = loadSound("Ponto.wav");
  racketedSound = loadSound("Raquetada.wav");
}

function setup() {
  createCanvas(600, 500);
  backgroundSound.loop();
  
  racketPlayerY = (height/2)-(racketHeight/2);
  racketEnemyY = (height/2)-(racketHeight/2);
  
  ballX = width/2;
  ballY = height/2;
  
  HandleEnemyMove(1);
}

function draw() {
  background(0);
  DrawScores();
  DrawBall();
  DrawRacket();
  DrawRacket(true);
}

function DrawScores() {
  stroke(255);
  strokeWeight(2);
  fill(255,140,0);
  rect(width/3-20, 30-10, 40, 30);
  rect(width/3*2-20, 30-10, 40, 30);
  
  stroke(0);
  strokeWeight(0);
  fill(255);
  textAlign(CENTER);
  textSize(16);
  
  text(score.player, width/3, 40);
  text(score.enemy, width/3*2, 40);
  text(`Level: ${level}`, width/2, 100);
}

function DrawRacket(enemy = false) {
  if (enemy) {
    // HandleEnemyMove();
  } else {
    HandlePlayerMove();
  }
  
  let x = racketX;
  if(enemy) {
    x = width - racketX - racketWidth;
  }
  
  fill(255);
  rect(
    x, 
    enemy ? racketEnemyY : racketPlayerY, 
    racketWidth, 
    racketHeight);
}

function HandlePlayerMove() {
  if(keyIsDown(UP_ARROW)) {
    racketPlayerY -= racketVelocity;
  }
  if(keyIsDown(DOWN_ARROW)) {
    racketPlayerY += racketVelocity;
  }
}

function HandleEnemyMove(interval) {
  setTimeout(() => {
    EnemyMove();
  }, interval);
}

function EnemyMove() {
  if(ballY < racketEnemyY + racketHeight*0.4) {
    racketEnemyY -= racketVelocity * (1+level/10.0);
  }
  
  if(ballY > racketEnemyY + racketHeight*0.6) {
    racketEnemyY += racketVelocity * (1+level/10.0);
  }
  
  if(ballY >= racketEnemyY + racketHeight*0.4 &&
     ballY <= racketEnemyY + racketHeight*0.6) {
    
    let interval = random(0,1) * 300;
    
    interval -= interval * level / 100
    
    HandleEnemyMove(
      random(0,1) * 300// - levelingInterval + 300
    );
    return;
  }
  
  setTimeout(EnemyMove, 15);
}

function DrawBall() {
  MoveBall();
  HandleBallColides();
  
  fill(255);
  circle(ballX, ballY, ballSize);
}

function MoveBall() {
  ballX += ballVelocityX * (1+(level/10.0));
  ballY += ballVelocityY * (1+(level/10.0));
}

function HandleBallColides() {
  //if (ColidesOnRackets()) {
  if (ColidesOnRacketsLib()) {
    racketedSound.play();
    ballVelocityX *= -1;
    return;
  }
  
  if(((ballX+ballRadio) >= width && ballVelocityX > 0) || 
     ((ballX-ballRadio) <= 0      && ballVelocityX < 0)) {
    ballVelocityX *= -1;
    // point
    AddScore((ballX-ballRadio) <= 0);
  }
  if(((ballY+ballSize) >= height  && ballVelocityY > 0) || 
     ((ballY-ballRadio) <= 0      && ballVelocityY < 0)) {
    ballVelocityY *= -1;
  }
}

function ColidesOnRackets() {
  let ballLeft = ballX - ballRadio;
  let ballRight = ballX + ballRadio;
  
  // Player Racket
  if (ballVelocityX < 0 &&
      ballY >= racketPlayerY && 
      ballY <= racketPlayerY+racketHeight &&
      ballX - ballRadio <= racketX + racketWidth) {
    return true;
  }
  
  // Enemy Racket
  if (ballVelocityX > 0 &&
      ballY >= racketEnemyY && 
      ballY <= racketEnemyY+racketHeight &&
      ballX + ballRadio >= width - racketX - racketWidth) {
    return true;
  }
  
  return false;
}

function ColidesOnRacketsLib() {
  if(ballVelocityX < 0)
    return collideRectCircle(racketX, racketPlayerY, racketWidth, racketHeight, ballX, ballY, ballSize);
  
  if(ballVelocityX > 0)
    return collideRectCircle(width - racketX - racketWidth, racketEnemyY, racketWidth, racketHeight, ballX, ballY, ballSize);
}

function AddScore(enemy) {
  pointSound.play();
  if(enemy) {
    score.enemy += 1;
  } else {
    score.player += 1;
  }
  
  let total = score.enemy + score.player;
  if (total > 0 && total % 5 == 0 && level < 20) {
    level += 1;
  }
}
