soundOn = false;

// theme
var snakeColor = "lime";
var appleColor = "red";
var bgndColor = "black";
var eat = new Audio('eat.mp3');
var crash = new Audio('crash.mp3');
var font = "24px franklin gothic";
var textColor = "white";

// game factors
var initLength = 3;
var fps = 13;
gameMode = "wrap";

const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = font;
    context.fillText(text, x, y);
}

function playCrash() {
    if (soundOn) {
        crash.play();
    }
}

var score = 0;
var endGame = false;

var squareSize = 20;
var xTiles = 30;
var yTiles = 20;

var player_x = 8;
var player_y = 10;
var vx = 0;
var vy = 0;
var length = initLength;
var trail = [];

var apple_x = 20;
var apple_y = 10;

function reset() {
    score = 0;

    player_x = 8;
    player_y = 10;
    vx = 0;
    vy = 0;
    length = initLength;
    trail = [];

    apple_x = 20;
    apple_y = 10;
}

function keyPush(event) {
    switch (event.keyCode) {
        case 37:
            if (vx != 1) {
                vx = -1;
                vy = 0;
            }
            break;
        case 38:
            if (vy != 1) {
                vx = 0;
                vy = -1;
            }
            break;
        case 39:
            if (vx != -1) {
                vx = 1;
                vy = 0;
            }
            break;
        case 40:
            if (vy != -1) {
                vx = 0;
                vy = 1;
            }
            break;
    }
}

document.addEventListener("keydown", keyPush);

function update() {
    // update the snake's position
    player_x += vx;
    player_y += vy;

    if (gameMode == "wrap") {
        // wrap the snake around the board
        if (player_x < 0) {
            player_x = xTiles - 1;
        }
        else if (player_x > xTiles - 1) {
            player_x = 0;
        }
        else if (player_y < 0) {
            player_y = yTiles - 1;
        }
        else if (player_y > yTiles - 1) {
            player_y = 0;
        }
    }
    else {
        // reset the game when the snake leaves the board
        if (player_x < 0) {
            endGame = true;
        }
        else if (player_x > xTiles - 1) {
            endGame = true;
        }
        else if (player_y < 0) {
            endGame = true;
        }
        else if (player_y > yTiles - 1) {
            endGame = true;
        }
    }

    // refresh the display
    drawRect(0, 0, canvas.width, canvas.height, bgndColor);

    // show the snake
    for (var i = 0; i < trail.length; i++) {
        drawRect(trail[i].x * squareSize, trail[i].y * squareSize, squareSize, squareSize, snakeColor)

        if (trail[i].x == player_x && trail[i].y == player_y) {
            endGame = true;
        }
    }

    // add a new square to the snake at the head
    trail.push({
        x: player_x,
        y: player_y
    });

    // reduce the snake's length
    while (trail.length > length) {
        trail.shift();
    }

    // eat and replace the apple
    if (apple_x == player_x && apple_y == player_y) {
        if (soundOn) {
            eat.play();
        }

        score++;
        length++;
        apple_x = Math.floor(Math.random() * xTiles);
        apple_y = Math.floor(Math.random() * yTiles);
    }

    // show the apple
    drawRect(apple_x * squareSize, apple_y * squareSize, squareSize, squareSize, appleColor);

    // show the score
    drawText(score, 60, 60, textColor)

    if (endGame && (vx != 0 || vy != 0)) {
        playCrash();
        reset();
    }

    endGame = false;
}

setInterval(update, 1000 / fps)