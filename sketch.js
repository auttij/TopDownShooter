w = 640;
h = 640;

var world;
var p;
var running = true;

function setup() {
    let canvas = createCanvas(w, h);
    let framerate = 15;
    p = new Player();
    world = new World(w, h);
}

function draw() {
    background(155);
    if (running) {
        p.update();
    }
    world.draw();
    p.show();
}

function keyPressed() {
    if (keyCode == ESCAPE) {
        running = !running; // Toggles paused
    } else if (keyCode == 69) {
        world.box.placeObject(mouseX, mouseY);
    }

    p.setMove(keyCode, true);

}

function mouseClicked() {
    //let obj = new WorldObject(world, mouseX - 20, mouseX + 20, mouseY - 20, mouseY + 20);
    //world.objects.push(obj);
    console.log(world.box.getQuad(mouseX, mouseY));
}

function keyReleased() {
    p.setMove(keyCode, false);
}

function World(worldWidth, worldHeight) {
    this.width = worldWidth;
    this.height = worldHeight;
    this.objects = [];
    this.box = new BoundingBox(0, 0, worldWidth, worldHeight, 1, true);

    this.draw = function() {
        this.box.draw();
        for (i = 0; i < this.objects.length; i++) {
            this.objects[i].draw();
        }
    }
}

class WorldObject {
    constructor(world, x1, x2, y1, y2) {
        this.world = world;
        this.x1 = Math.min(x1, x2);
        this.x2 = Math.max(x1, x2);
        this.y1 = Math.min(y1, y2);
        this.y2 = Math.max(y1, y2);
        this.width = x2 - x1;
        this.height = y2 - y1;
    }

    draw = function() {
        fill("orange");
        stroke("black");
        strokeWeight(2);
        rect(this.x1, this.y1, this.width, this.height);
    }
}