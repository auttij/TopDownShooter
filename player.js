function Player() {
    this.x = w/2;
    this.y = h/2;
    this.targetX = this.x;
    this.targetY = this.y;

    this.acc = 0.1;
    this.step = 3;
    this.maxDiff = 100;

    this.aimAngle = 0;
    this.aimX = 0;
    this.aimY = 0;
    this.aimAcc = 0.1; // Aim acceleration multiplier, how fast aim follows the mouse

    // Has dodge button (spacebar) been pressed?
    this.isDodge  = false;
    
    // Movement keys held down?
    this.isUp    = false;
    this.isDown  = false;
    this.isLeft  = false;
    this.isRight = false;

    // Draw player in current position
    this.show = function() {
        // Draw player
        fill("yellow");
        stroke("black");
        strokeWeight(2);
        circle(this.x, this.y, 10);

        // Draw sighline
        strokeWeight(1);
        stroke("red");
        line(this.x, this.y, this.aimX, this.aimY);
    }
    
    // Update player location
    this.update = function() {
        this.move();
        this.aim();
    }

    this.move = function() {
        this.checkMovement();

        // Movement is done by moving towards target location
        var dx = this.targetX - this.x;
        this.x += dx * this.acc;
        
        var dy = this.targetY - this.y;
        this.y += dy * this.acc;
    }

    this.aim = function() {
        // Calculate Aim direction based on mouse
        targetAngle = Math.atan2((mouseY - this.y), (mouseX - this.x));

        // Calculate the amount that angle changes each frame.
        diffAngle = targetAngle - this.aimAngle;
        // Limit the angle change so it stays between [-PI, PI]
        // Necessary to always use the shorterst distances and not loop the wrong way round
        diffAngle -= diffAngle > Math.PI ? 2 * Math.PI : 0;
        diffAngle += diffAngle < -Math.PI ? 2 * Math.PI : 0;

        // Update the aim angle
        this.aimAngle += diffAngle * this.aimAcc;
        // Limit the angle so it stays between [-PI, PI]
        // Necessary to always use the shorterst distances and not loop the wrong way round
        this.aimAngle -= this.aimAngle > Math.PI ? 2 * Math.PI : 0;
        this.aimAngle += this.aimAngle < -Math.PI ? 2 * Math.PI : 0;

        // Length of sightline
        l = w + h;
        // Update end positions of sightline
        this.aimX = this.x + l * Math.cos(this.aimAngle);
        this.aimY = this.y + l * Math.sin(this.aimAngle);
    }

    // Change target position of movement
    this.changeTarget = function(x, y) {
        this.targetX += x;
        this.targetY += y;
    
        // Constrain targets to certain distance away from current position
        this.targetX = constrain(this.targetX, this.x - this.maxDiff, this.x + this.maxDiff);
        this.targetY = constrain(this.targetY, this.y - this.maxDiff, this.y + this.maxDiff);
    
        // Constrain targets to canvas boundaries
        this.targetX = constrain(this.targetX, 0, w);
        this.targetY = constrain(this.targetY, 0, h);
    }

    // Calculate how many movement keys are pressed down
    this.movementKeyDownCount = function() {
        return this.isUp + this.isDown + this.isLeft + this.isRight;
    }

    // Check if keys are pressed and if we need to move in certain position
    this.checkMovement = function() {
        // if player is dodging, movement speed should immediately go to max, else step
        var stepSize = this.isDodge ? this.maxDiff : this.step;
        
        // Diagonal movement shouldn't be faster than regular movement
        // So if multiple buttons are pressed down, we need to lower movement size
        if (this.movementKeyDownCount() > 1) {
            stepSize /= Math.sqrt(2);
        }

        // Update target towards each direction that a key is pressed
        if (this.isUp) {
            this.changeTarget(0, -stepSize);
        } 
        if (this.isDown) {
            this.changeTarget(0, stepSize);
        } 
        if (this.isLeft) {
            this.changeTarget(-stepSize, 0);
        } 
        if (this.isRight) {
            this.changeTarget(stepSize, 0);
        }
        
        // Always reset dodge
        if (this.isDodge) this.isDodge = false;
    }

    // Change movement booleans based on keyPresses
    this.setMove = function(keyCode, bool) {
        switch(keyCode) {
            case UP_ARROW:
            case 87: // w
                this.isUp = bool;
                break;
            case DOWN_ARROW:
            case 83: // s
                this.isDown = bool;
                break;
            case LEFT_ARROW:
            case 65: // a
                this.isLeft = bool;
                break;
            case RIGHT_ARROW:
            case 68: // d
                this.isRight = bool;
                break;
            case 32: // spacebar
                this.isDodge = bool;
                break;
            default:
                break;
        }
    }
}
