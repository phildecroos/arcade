soundOn = false;

// theme
var snakeColor = "lime";
var appleColor = "red";
var bgndColor = "black";
var eat = new Audio('eat.mp3');
var crash = new Audio('crash.mp3');

// game factors
var initLength = 3;
var fps = 15;
var gameMode = "wrap";

const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function playCrash() {
    if (soundOn) {
        crash.play();
    }
}

var squareSize = 20;
var tiles = 20;

var player_x = 4;
var player_y = 10;
var vx = 0;
var vy = 0;
var length = initLength;
var trail = [];

var apple_x = 15;
var apple_y = 10;

function reset() {
    player_x = 4;
    player_y = 10;
    vx = 0;
    vy = 0;
    length = initLength;
    trail = [];

    apple_x = 15;
    apple_y = 10;
}

function keyPush(event) {
    switch(event.keyCode) {
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
            player_x = tiles - 1;
        }
        else if (player_x > tiles - 1) {
            player_x = 0;
        }
        else if (player_y < 0) {
            player_y = tiles - 1;
        }
        else if (player_y > tiles - 1) {
            player_y = 0;
        }
    }
    else {
        // reset the game when the snake leaves the board
        if (player_x < 0) {
            playCrash();
            reset();
        }
        else if (player_x > tiles - 1) {
            playCrash();
            reset();
        }
        else if (player_y < 0) {
            playCrash();
            reset();
        }
        else if (player_y > tiles - 1) {
            playCrash();
            reset();
        }
    }

    // refresh the display
    drawRect(0, 0, canvas.width, canvas.height, bgndColor);

    // show the snake
    for (var i = 0; i < trail.length; i++) {
        drawRect(trail[i].x*squareSize, trail[i].y*squareSize, squareSize, squareSize, snakeColor)
        
        if (trail[i].x == player_x && trail[i].y == player_y) {
            if (vx != 0 || vy != 0) {
                playCrash();
            }

            reset();
        }
    }

    trail.push({
        x : player_x,
        y : player_y    
    });

    // ensure that the snake is the correct length
    while (trail.length > length) {
        trail.shift();
    }

    // eat and replace the apple
    if (apple_x == player_x && apple_y == player_y) {
        if (soundOn) {
            eat.play();
        }

        length++;
        apple_x = Math.floor(Math.random() * tiles);
        apple_y = Math.floor(Math.random() * tiles);
    }

    // show the apple
    drawRect(apple_x*squareSize, apple_y*squareSize, squareSize, squareSize, appleColor);
}

setInterval(update, 1000/fps)