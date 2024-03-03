soundOn = false;

// theme
var font = "24px franklin gothic";
var bounce = new Audio('bounce.mp3');
var point = new Audio('point.mp3');
var die = new Audio('die.mp3');
var backgroundColor = "#000000";
var paddleColor = "#ffffff";
var ballColor = "#3333ff";
var scoreColor = "#00aa00";
var heartColor = "#ff0000";
var netColor = "#ffffff";

// game factors
var initBallSpeedX = 3.5;
var initBallSpeedY = 3.5;
var ballAccelleration = 0.5;
var playerSpeed = 0.01;
var botSpeed = 3.25;

var playing = true;

const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = font;
    context.fillText(text, x, y);
}

function drawTri(x1, y1, x2, y2, x3, y3, color) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x3, y3);
    context.closePath();

    context.lineWidth = 10;
    context.strokeStyle = color;
    context.stroke();

    context.fillStyle = color;
    context.fill();
}

const player = {
    x: 0,
    y: canvas.height / 2 - 100 / 2,
    width: 20,
    height: 100,
    color: paddleColor,
    score: 0,
    health: 3
}

const bot = {
    x: canvas.width - 20,
    y: canvas.height / 2 - 100 / 2,
    width: 20,
    height: 100,
    color: paddleColor,
}

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    color: ballColor,
    speedX: Math.sign((Math.random() * (1 - (-1) + 1) + (-1))) * initBallSpeedX,
    speedY: Math.sign((Math.random() * (1 - (-1) + 1) + (-1))) * initBallSpeedY
}

const net = {
    x: canvas.width / 2 - 4 / 2,
    y: 0,
    width: 4,
    height: 15,
    color: netColor
}

function resetBall() {
    player.y = canvas.height / 2 - 100 / 2;
    bot.y = canvas.height / 2 - 100 / 2;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = Math.sign((Math.random() * (1 - (-1) + 1) + (-1))) * initBallSpeedX;
    ball.speedY = Math.sign((Math.random() * (1 - (-1) + 1) + (-1))) * initBallSpeedY;
}

function collision(ball, paddle) {
    paddle.top = paddle.y;
    paddle.bottom = paddle.y + paddle.height;
    paddle.left = paddle.x;
    paddle.right = paddle.x + paddle.width;

    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    return ball.right > paddle.left && ball.left < paddle.right && ball.top < paddle.bottom && ball.bottom > paddle.top;
}

window.addEventListener("mousemove", (event) => {
    player.y = event.clientY - player.height - 155;

    if (player.y <= 0) {
        player.y = 0;
    }
    else if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
    }
});

function moveBot() {
    if (ball.y < bot.y + bot.height / 2) {
        bot.y -= botSpeed;
    }
    else if (ball.y > bot.y + bot.height / 2) {
        bot.y += botSpeed;
    }

    if (bot.y <= 0) {
        bot.y = 0;
    }
    else if (bot.y + bot.height >= canvas.height) {
        bot.y = canvas.height - bot.height;
    }
}

function updateData() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;
    }

    let paddle = (ball.x < canvas.width / 2) ? player : bot;

    if (collision(ball, paddle)) {
        ball.speedX = -ball.speedX;

        if (ball.speedX > 0) {
            ball.speedX += ballAccelleration;
        }
        else {
            ball.speedX -= ballAccelleration;
        }

        if (ball.y >= paddle.y && ball.y <= paddle.y + 15) {
            if (ball.speedY > 0) {
                ball.speedY += ballAccelleration;
                ball.speedY *= -1;
            }
            else {
                ball.speedY -= ballAccelleration;
            }
        }
        else if (ball.y <= paddle.y + paddle.height && ball.y >= paddle.y + paddle.height - 15) {
            if (ball.speedY > 0) {
                ball.speedY += ballAccelleration;
            }
            else {
                ball.speedY -= ballAccelleration;
                ball.speedY *= -1;
            }
        }

        player.score++;

        if (soundOn) {
            bounce.play();
        }
    }

    if ((ball.y <= 0) || (ball.y + ball.radius >= canvas.height)) {
        ball.speedY = -ball.speedY;
    }

    if (ball.x - ball.radius < 0 && playing) {
        player.health--;

        if (soundOn) {
            die.play();
        }

        playing = false;

        function reset() {
            setTimeout(function () { resetBall(); playing = true; }, 500);
        }

        reset();

        if (player.health == 0) {
            player.health = 3;
            player.score = 0;
        }
    }

    else if (ball.x + ball.radius > canvas.width && playing) {
        player.score += 5;

        if (soundOn) {
            point.play();
        }

        playing = false;

        function reset() {
            setTimeout(function () { resetBall(); playing = true; }, 500);
        }

        reset();
    }

    if (ball.speedX > 0) {
        moveBot();
    }
}

function updateScreen() {
    // reset screen
    drawRect(0, 0, canvas.width, canvas.height, backgroundColor);

    // draw the net
    for (let i = 2.5; i < canvas.height; i += 20) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }

    // draw the paddles
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(bot.x, bot.y, bot.width, bot.height, bot.color);

    // draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    // draw the health
    for (i = 0; i < player.health; i++) {
        var x = i * 35 + 60;
        drawCircle(x, 40, 8, heartColor);
        drawCircle(x + 11, 40, 8, heartColor);
        drawTri(x + 4.9, 49, x + 6.8, 49, x + 5.9, 50, heartColor);
    }

    // draw the score
    drawText("score: " + player.score, 440, 50, scoreColor);
}

function game() {
    updateData();
    updateScreen();
}

var fps = 60;

setInterval(game, 1000 / fps)
