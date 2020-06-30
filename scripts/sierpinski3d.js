
const _w = window.innerWidth;
const _h = window.innerHeight;
const _backgroundColor = 0;
const _cornersColor = '#5982E9';
const _linesColor = '#FFF';
const _startingVertexColor = '#97FBD1';
const _verticesColor = '#1CC6FF';
const _vectorColor = '#F6A4EC';
const _cornerVertices = [
    [-100,-100,-100],
    [100,-100,-100],
    [100,100,-100],
    [-100,100,-100],
    [0,0,100]    
];
const _jsTotalVertices = document.getElementById('js-span-totalVertices');
const _speeds = [120, 60, 30, 15, 6, 1];
const _verticeLimit = 50000;
let _speed = 0;
let _paused = false;

let _scaleValue = 1.5;
let diffVector;
let endVector;



const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};

const drawPyramidByLines = () => {
    stroke(_linesColor);
    strokeWeight(1);
    line(-100,-100,-100,100,-100,-100);
    line(100,-100,-100,100,100,-100);
    line(100,100,-100,-100,100,-100);
    line(-100,100,-100,-100,-100,-100);
    line(-100,-100,-100,0,0,100);
    line(100,-100,-100,0,0,100);
    line(100,100,-100,0,0,100);
    line(-100,100,-100,0,0,100);
};

const drawCornersByVertices = () => {
    for (let i = 0; i < _cornerVertices.length; i++) {
        const p = _cornerVertices[i];
        push()
        stroke(_cornersColor);
        //strokeWeight(1);
        translate(p[0],p[1],p[2]);
        sphere(3);
        pop()
    }
};

const pickRandomCorner = () => {
   return _cornerVertices[Math.floor(Math.random() * _cornerVertices.length)];
};

const getRandomCornerVector = () => {
    const randomCorner = pickRandomCorner();
    return createVector(randomCorner[0], randomCorner[1], randomCorner[2]);
};






console.log('Started');

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
const randomStartingVertex = [startingVertexX, startingVertexY, startingVertexZ];
let startingVector;

console.log(`Starting height: ${startingVertexZ}, x: ${startingBaseLength}, and y: ${startingVertexY}`);



let epochs = _speeds[_speed];
let mag;
let delta;
let vertices = [
    [-100,-100,-100]
];
let midpointVector;
let font;

function preload() {
    //font = loadFont('Source Code Pro');
}

function setup() {
    createCanvas(_w, _h, WEBGL);

    startingVector = createVector(randomStartingVertex[0], randomStartingVertex[1], randomStartingVertex[2]);
    
    randomCornerVector = getRandomCornerVector();
    diffVector = p5.Vector.sub(startingVector, randomCornerVector);

    //diffVector.normalize();
    print(randomCornerVector);
    print(diffVector);
    
    
    midpointVector = p5.Vector.mult(diffVector, 0.5);
    midpointVector.add(randomCornerVector);
    mag = diffVector.mag();
    print(mag);
    delta = (mag/2)/epochs;
    print(delta);

}

function draw() {
    background(_backgroundColor);
    // Print total vertices on screen. The +1 is for the random starting vertex
    _jsTotalVertices.innerHTML = 'Vertices: '+(vertices.length+1);
    //let camX = map(mouseX, 0, w, -w/4, w/4);
    //camera(camX,0,(h/3) / tan(PI/6), 0,0,0, 0,1,0);
    scale(_scaleValue);
    rotateX(PI/2);
    rotateZ(-PI/6);

    //rotateX(frameCount * 0.01);
    //rotateY(frameCount * 0.01);
    rotateZ(frameCount * 0.005);
    //print(frameCount * 0.01);
    //rotateY(map(mouseY, 0, height, 0, -3));
    //rotateZ(map(mouseX, 0, width, 0, 3));

    drawPyramidByLines();
    drawCornersByVertices();
    
    stroke(_startingVertexColor);
    strokeWeight(10);
    beginShape(POINTS);
        vertex(startingVector.x, startingVector.y, startingVector.z);
    endShape();

    stroke(_verticesColor);
    strokeWeight(3);
    
    // at least one vertex must be provided or beginShape will crash
    if (vertices.length > 0) {
        beginShape(POINTS);
            for (let i = 0; i < vertices.length; i++) {
                vertex(vertices[i][0], vertices[i][1], vertices[i][2]);
            }
        endShape();
    }
    
    stroke(_vectorColor);
    strokeWeight(3);
    //line(randomCornerVector.x, randomCornerVector.y, randomCornerVector.z, startingVector.x, startingVector.y, startingVector.z);
    //diffVector.mult(0.999);
    diffVector.setMag(mag);
    const animationVector = p5.Vector.add(randomCornerVector, diffVector);
    line(randomCornerVector.x, randomCornerVector.y, randomCornerVector.z, animationVector.x, animationVector.y, animationVector.z);
    //mag -= 5;

    if (!_paused) {
        epochs -= 1;
        mag -= delta;
    }
    //print(mag);
    //print(epoch);
    if ((epochs < 1) && !_paused && (vertices.length < _verticeLimit)) {
        epochs = _speeds[_speed];
        vertices.push([midpointVector.x, midpointVector.y, midpointVector.z]);
        randomCornerVector = getRandomCornerVector();
        diffVector = p5.Vector.sub(midpointVector, randomCornerVector);

        midpointVector = p5.Vector.mult(diffVector, 0.5);
        midpointVector.add(randomCornerVector);
        mag = diffVector.mag();
        delta = (mag/2)/epochs;
        //print(vertices.length);
    }
    
}

document.getElementById("js-btn-play").addEventListener("click", function(){
    console.log('play');
    if (_paused) {
        _paused = false;
    }
});

document.getElementById("js-btn-pause").addEventListener("click", function(){
    console.log('pause');
    if (!_paused) {
        _paused = true;
    }
});

document.getElementById("js-btn-speedUp").addEventListener("click", function(){
    console.log('speedUp');
    if (_speed != _speeds.length-1) {
        _speed += 1;
    }
});

document.getElementById("js-btn-slowDown").addEventListener("click", function(){
    console.log('slowDown');
    if (_speed != 0) {
        _speed -= 1;
    }
});

if ( window.innerWidth <= window.innerHeight ) {
    _scaleValue = window.innerWidth/200 * 0.45;
} else {
    _scaleValue = window.innerHeight/200 * 0.45;
}

