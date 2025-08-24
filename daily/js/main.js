import { setupOption, setupCheckbox } from "/daily/js/option";
import { setupRenderer, setupScene, startAnimation, stopAnimation, updateConfig,
    rectState, score} from "/daily/js/rect";

//=================AUDIO=================//

import lainAudio from '/res/lain8bitserialQ.mp3';
const BG_AUDIO = new Audio(lainAudio);
BG_AUDIO.volume = 0.7;
function toggleMusic(value) {
    if (value) {
        BG_AUDIO.play();
        rectState.audio = true;
    } else {
        BG_AUDIO.pause();
        rectState.audio = false;
    }
    console.log("audio =", value);
}
setupCheckbox("audio", toggleMusic, false);


//=================DEBUG=================//
function toggleDebug(value) {
    if (value) {
        rectState.debug = true;
    } else {
        rectState.debug = false;
    }
    console.log("debug =", value);
}
setupCheckbox("debug", toggleDebug, false);


//=================COLORS=================//
const colors = {
    "red": "red",
    "green": "greenyellow",
    "blue": "blue"
};
function updateColor(key) {
    document.documentElement.style.setProperty("--ui", colors[key]);
    console.log("color =", key);
}
setupOption("color", colors, updateColor, 0);


//=================STYLES=================//
const styles = {
  "3th":  "style-3th",
  "void": "style-void",
};
function updateStyle(key) {
    const body = document.body;
    Object.values(styles).forEach(cls => body.classList.remove(cls));
    body.classList.add(styles[key]);
    console.log("style =", key);
}
setupOption("style", styles, updateStyle, 0);


//=================RECT INITIALIZATION=================//
// Initialize the 3D renderer and scene
updateConfig({ COUNT: 12, SPEED: 0.1 });
setupRenderer();
setupScene();
startAnimation();
