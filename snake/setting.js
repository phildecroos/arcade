var setting = document.getElementById("snakeSetting");

setting.addEventListener("click", function (speaker) {
    if (gameMode == "wrap") {
        gameMode = "wall";
        setting.src = '../icons/box.png';
    }
    else {
        gameMode = "wrap";
        setting.src = '../icons/infinity.png';
    }
})
