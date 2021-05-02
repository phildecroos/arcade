document.getElementById("themeButton").onclick = function() {toggleTheme()};

function toggleTheme() {
    theme++;
    
    if (theme > 4) {
        theme = 1;
    }
}
