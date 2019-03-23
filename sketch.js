w = 600;
h = 480;

var p;
var running = true;

function setup() {
    let canvas = createCanvas(w, h);
    let framerate = 15;
    p = new Player();
}

function draw() {
    background(155);
    if (running) {
        p.update();
    }
    p.show();
}

function keyPressed() {
    if (keyCode == ESCAPE) {
        running = !running; // Toggles paused
    }
    p.setMove(keyCode, true);
}

function keyReleased() {
    p.setMove(keyCode, false);
}
