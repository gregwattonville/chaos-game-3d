const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};

const drawPyramidByLines = () => {
    line(-100,-100,-100,100,-100,-100);
    line(100,-100,-100,100,100,-100);
    line(100,100,-100,-100,100,-100);
    line(-100,100,-100,-100,-100,-100);
    line(-100,-100,-100,0,0,100);
    line(100,-100,-100,0,0,100);
    line(100,100,-100,0,0,100);
    line(-100,100,-100,0,0,100);
}


console.log('Started');

let scaleValue = 1;

// Create a random starting point inside the pyriamid
// This is broken down into a couple of steps
// First pick a random starting z value corresponding to the height within the pyramid.
// The pyramid's, extents from -100 to 100 giving a max height of 200
const startingVertexZ = getRandomInt(200)-100;
// Nox that the hieght is constant, we can find a limit for the base.
// Since the top of the pyramid is at (0,0,100) the bottom edge of the pyramid is at (100, 0,-100)
// We can use these points to find the slope of the slant of the pyramid. the Slope = -2/1
// Create an equation for line running along the slant of the pyramid from top to the base.
// h(x) = -2x + 100
// Since we know the height, we can rewrite this equations to solve for the max x.
// x = (h - 100)/-2
// However, this gives a max length of x from the center of the pyramid to the edge, 
// but we want edge to edge thus x is doubled. Resulting in the new equation
// length(x) = -(h - 100)
// Since the base of the pyramid is square, the slope on the y is equal to the x side
// Thus we can use the same equation for y
// length(y) = -(h - 100)
// Finally, use the lengths as a limit to find random values for x and y
const startingBaseLength = -(startingVertexZ-100);
const startingVertexX = getRandomInt(startingBaseLength) - (startingBaseLength/2)
const startingVertexY = getRandomInt(startingBaseLength) - (startingBaseLength/2)
// A random point within the pyramid
const startingVertex = [startingVertexX, startingVertexY, startingVertexZ];

console.log(`Starting height: ${startingVertexZ}, x: ${startingBaseLength}, and y: ${startingVertexY}`);


const vertices = [
    [-100,-100,-100],
    [100,-100,-100],
    [100,100,-100],
    [-100,100,-100],
    [0,0,100]    
];

if ( window.innerWidth <= window.innerHeight ) {
    Math.floor(window.innerWidth * 0.6);
} else {
    Math.floor(window.innerHeight * 0.6);
}

const w = window.innerWidth;
const h = window.innerHeight;

function setup() {
    createCanvas(w, h, WEBGL);
}

function draw() {
    background(0);

    //let camX = map(mouseX, 0, w, -w/4, w/4);
    //camera(camX,0,(h/3) / tan(PI/6), 0,0,0, 0,1,0);

    stroke(255);
    strokeWeight(1);
    fill(255,255,255,0);

    rotateX(PI/2);
    rotateZ(-PI/6);

    //rotateX(frameCount * 0.01);
    //rotateY(frameCount * 0.01);

    noFill();


    drawPyramidByLines();

    stroke(255,0,150);
    strokeWeight(10);
    beginShape(POINTS);
        for (let i = 0; i < vertices.length; i++) {
            const p = vertices[i];
            vertex(p[0],p[1],p[2]);
        }
    endShape();
    stroke(255,150,0);
    beginShape(POINTS);
        vertex(startingVertex[0], startingVertex[1], startingVertex[2]);
    endShape();
    
}



