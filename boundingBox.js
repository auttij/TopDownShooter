class BoundingBox {
    constructor(x, y, boxWidth, boxHeight, depth, debug = false) {
        this.x = x;
        this.y = y;
        this.width = boxWidth;
        this.height = boxHeight;
        this.depth = depth;
        this.debug = debug;
        this.quads;         // Gets filled if quadrant is split
        this.object;        // Gets filled once an object is placed in this quadrant
        this.sizeLimit = 5  // Minimum size of box
    }

    // Place an object in this Bounding box
    placeObject = function(x, y) {
        // If this box is split into quadrants, it shouldn't hold an item
        if (this.quads) {
            // Place the item in one of the existing quadrants
            let quad = this.getQuad(x, y);
            quad.placeObject(x, y);
            
        } else {
            // If this box doesn't already have an item, place one in it.
            if (!this.object)
                this.object = [x, y];

            // If we aren't at the size limit and we already have an object in this box
            // Split box into quadrants and move the two items into those quadrants.
            else if (this.width > this.sizeLimit && this.height > this.sizeLimit) {
                this.createQuads();

                // Move old object into new quadrant
                let ox = this.object[0], oy = this.object[1];
                let oldQuad = this.getQuad(this.object[0], this.object[1]); 
                oldQuad.placeObject(ox, oy); 

                // Move new object into qudrant
                let quad = this.getQuad(x, y);
                quad.placeObject(x, y);

                // Delete the old object reference
                delete this.object;
            }
        }
    }

    // Splits this Bounding box into 4 new quadrants
    createQuads = function() {
        if (this.width >= this.sizeLimit && this.height >= this.sizeLimit) {
            console.log("created new quads with width", this.width);
            this.quads = new Array(4);
            var i;
            for (i = 0; i < 4; i++) {
                var x = this.x + (this.width / 2 * (i % 2));
                var y = this.y + (this.height / 2 * floor(i / 2));
    
                var quad = new BoundingBox(x, y, this.width / 2, this.height / 2, this.depth + 1, this.debug);
                this.quads[i] = quad;
            }
        }
    }

    // Checks if given coordinates are withing this bounding box
    isInBox = function(x, y) {
        var xIf = this.x <= x && x < (this.x + this.width);
        var yIf = this.y <= y && y < (this.y + this.height);
        return xIf && yIf;
    }

    // Returns the qudrant that the given coordinates belong to
    getQuad = function(x, y) {
        if (!this.isInBox(x, y))
            return null;
        if (!this.quads)
            return this;

        var xIsLow = x < this.x + (this.width / 2);
        var yIsLow = y < this.y + (this.height / 2);
        
        if (xIsLow && yIsLow) {
            return this.quads[0];
        } else if (!xIsLow && yIsLow) {
            return this.quads[1];
        } else if (xIsLow && !yIsLow) {
            return this.quads[2];
        } else {
            return this.quads[3];
        }
    }

    // returns quadrant, but searches recursively for deepest one
    getQuadDeep = function(x, y) {
        let quad = this.getQuad(x, y);
        if (quad) {
            if (this.quads) {
                return quad.getQuadDeep(x, y);
            } else {
                return this
            }
        }
        return null;
    }

    // Draws lines around each bounding box
    draw = function() {
        if (this.debug) {
            fill(155);
            stroke(0);
            strokeWeight(1);
            rect(this.x, this.y, this.width, this.height);

            // If this Bounding box has been spread into quadrants, draw them too
            if (this.quads) {
                var i;
                for (i = 0; i < 4; i++) {
                    this.quads[i].draw();
                }
            }
        }
        if (this.object) {
            fill(255);
            stroke(0);
            strokeWeight(1);
            circle(this.object[0], this.object[1], 4);
        }
    }
}