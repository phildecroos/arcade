soundOn = false;

// theme
var bgndColor = "black";
var unplayedColor = "white";
var playedColor = "#555555";
var currentColor = "#0088cc";
var playableColor = "#33cc33";
var font = "24px franklin gothic";
var textColor = "white";
var pop = new Audio('pop.mp3');

const canvas = document.getElementById("tenbyten");
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

function playSound() {
    if (soundOn) {
        pop.play();
    }
}

var fps = 60;
score = 0;
var currentX = 0;
var currentY = 0;
squares = 10;
var tlHgt = 40;
var sqHgt = 36;
board = [];
firstMove = true;

function reset() {
    score = 0;
    firstMove = true;
    board = [];

    for (var i = 0; i < squares; i++) {
        board.push([[3, 0], [3, 0], [3, 0], [3, 0], [3, 0], [3, 0], [3, 0], [3, 0], [3, 0], [3, 0]])
    }
}

reset();

function onBoard(x, y) {
    return (x >= 0 && x <=9) && (y >= 0 && y <=9);
}

function findPlayable() {
    // mark all previously playable squares as unplayed
    for (var x = 0; x < squares; x++) {
        for (var y = 0; y < squares; y++) {
            if (board[x][y][0] == 3) {
                board[x][y][0] = 0;
            }
        }
    }
    
    // check board for possible moves
    if (onBoard(currentX, currentY - 3) && board[currentX][currentY - 3][0] != 1) {
        board[currentX][currentY - 3][0] = 3;
    }
    if (onBoard(currentX + 2, currentY - 2)&& board[currentX + 2][currentY - 2][0] != 1) {
        board[currentX + 2][currentY - 2][0] = 3;
    }
    if (onBoard(currentX + 3, currentY) && board[currentX + 3][currentY][0] != 1) {
        board[currentX + 3][currentY][0] = 3;
    }
    if (onBoard(currentX + 2, currentY + 2) && board[currentX + 2][currentY + 2][0] != 1) {
        board[currentX + 2][currentY + 2][0] = 3;
    }
    if (onBoard(currentX, currentY + 3) && board[currentX][currentY + 3][0] != 1) {
        board[currentX][currentY + 3][0] = 3;
    }
    if (onBoard(currentX - 2, currentY + 2) && board[currentX - 2][currentY + 2][0] != 1) {
        board[currentX - 2][currentY + 2][0] = 3;
    }
    if (onBoard(currentX - 3, currentY) && board[currentX - 3][currentY][0] != 1) {
        board[currentX - 3][currentY][0] = 3;
    }
    if (onBoard(currentX - 2, currentY - 2) && board[currentX - 2][currentY - 2][0] != 1) {
        board[currentX - 2][currentY - 2][0] = 3;
    }
}

canvas.addEventListener("mousedown", (event) => {
    select(event);
});

var rect = canvas.getBoundingClientRect();

function select(event) {
    var selectionX = 0;
    var selectionY = 0;

    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
    
    while (x >= tlHgt) {
        selectionX++;
        x -= tlHgt;
    }

    while (y >= tlHgt) {
        selectionY++;
        y -= tlHgt;
    }

    if (board[selectionX][selectionY][0] == 3) {
        board[selectionX][selectionY][0] = 2;
        if (!firstMove) {
            board[currentX][currentY][0] = 1;
        }
        firstMove = false;
        currentX = selectionX;
        currentY = selectionY;
        findPlayable();
        score++;
        board[currentX][currentY][1] = score;
    }
}

function update() {
    // display the board
    for (var x = 0; x < squares; x++) {
        for (var y = 0; y < squares; y++) {
            drawRect(x*tlHgt, y*tlHgt, tlHgt, tlHgt, bgndColor);

            // 0 = unplayed, 1 = played, 2 = current, 3 = playable
            if (board[x][y][0] == 0) {
                drawRect(x*tlHgt + 2, y*tlHgt + 2, sqHgt, sqHgt, unplayedColor);
            }
            else if (board[x][y][0] == 1) {
                drawRect(x*tlHgt + 2, y*tlHgt + 2, sqHgt, sqHgt, playedColor);
                if (board[x][y][1] < 10) {
                    drawText(board[x][y][1], x*tlHgt + 13, y*tlHgt + 28, textColor);
                }
                else {
                    drawText(board[x][y][1], x*tlHgt + 6, y*tlHgt + 28, textColor);
                }
            }
            else if (board[x][y][0] == 2) {
                drawRect(x*tlHgt + 2, y*tlHgt + 2, sqHgt, sqHgt, currentColor);
                if (board[x][y][1] < 10) {
                    drawText(board[x][y][1], x*tlHgt + 13, y*tlHgt + 28, textColor);
                }
                else if (board[x][y][1] == 100) {
                    drawText(board[x][y][1], x*tlHgt - 1, y*tlHgt + 28, textColor);
                }
                else {
                    drawText(board[x][y][1], x*tlHgt + 6, y*tlHgt + 28, textColor);
                }
                
            }
            else if (board[x][y][0] == 3) {
                drawRect(x*tlHgt + 2, y*tlHgt + 2, sqHgt, sqHgt, playableColor);
            }
        }
    }
}

setInterval(update, 1000/fps)