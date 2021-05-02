var speaker2 = document.getElementById("speakerImage")

speaker2.addEventListener("click", function(speaker) {
    if (soundOn) {
        soundOn = false;
        speaker2.src = '../icons/sound_off.png';
    }
    else {
        soundOn = true;
        speaker2.src = '../icons/sound_on.png';
    }
})
