const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");


let x = Math.floor(Math.random() * canvas.width);
let y = Math.floor((1+Math.random()) * (canvas.height/2));

let dx = Math.random() < 0.5 ? -2 : 2;
let dy = -2;

const paddleHeight = 8;
const paddleWidth = 55;
var paddleX = (canvas.width-paddleWidth) / 2;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 45;
const brickHeight = 15;
const brickPadding = 8;
const brickOffsetTop = 50;
const brickOffsetLeft = 30;

var rightPressed = false;
var leftPressed = false;

const ballRadius = 6;

var score = 0;
var lives = 3;

var isPaused = false;
var isStarted = false;


function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawStartText() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Click the START button",80,180);
    ctx.fillText("to start a new game",93,200);
}


var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = Math.floor(Math.random()*16777215).toString(16);
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function brickCollisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth+ballRadius && y > b.y && y < b.y+brickHeight+ballRadius) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    brickSound();
                   // setTimeout(function(){brickSound.stop()},1000);
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
       
    drawScore();
    drawLives();
    drawBricks();
    drawBall();
    drawPaddle();
    brickCollisionDetection();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    
 

    x += dx;
    y += dy;

    if(!isPaused) {
        requestAnimationFrame(draw);
    }
    
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


function brickSound(){
    var audio = document.createElement("audio");
    audio.src = "./assets/hit.wav";
    audio.currentTime=0;
    audio.load();  
    audio.play(); 
}

var startButton = document.getElementById("startButton");
startButton.onclick = () => {
    if(isStarted) {
        document.location.reload();
    }
    draw();
    isStarted = true;
    startButton.innerHTML = 'END';
}
var pauseButton = document.getElementById("pauseButton");
pauseButton.onclick = () => {
   isPaused = !isPaused;
   draw();
}
drawStartText();

