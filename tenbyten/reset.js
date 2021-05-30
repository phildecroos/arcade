var setting = document.getElementById("reset");

setting.addEventListener("click", function(reset) {
    score = 0;
    firstMove = true;
    board = [];

    for (var i = 0; i < squares; i++) {
        board.push([[3, 0], [3, 0], [3, 0], [3, 0], [3, 0], [3, 0], [3, 0], [3, 0], [3, 0], [3, 0]])
    }
})




