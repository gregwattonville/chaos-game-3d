
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
const _jsBtnPlayPause = document.getElementById('js-btn-playPause');
const _speeds = [120, 60, 30, 15, 6, 1];
const _verticeLimit = 50000;
let _speed = 0;
let _paused = false;
let _rotate = false;

let _scaleValue = 1.5;
let diffVector;
let endVector;

let _angle = {
    x: -Math.PI/2,
    y: Math.PI/6,
}

let _mouse = {
    wheelScale: 1,
    scaleFactor: 0.25,
    currentFactor: 6,
    maxFactor: 20,
    lastX: -1,
    lastY: -1
}

let _plane = {
    addPlane: false,
    color: '#808588',
    rotateX: Math.PI/2,
    translate: {
        x: 0,
        y:200
    },
    size: {
        x: 800,
        y: 800
    }
}


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
            noStroke();
            fill(_cornersColor);
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

    // Random starting point vector inside pyramid
    startingVector = createVector(randomStartingVertex[0], randomStartingVertex[1], randomStartingVertex[2]);
    
    // Pick a random corner of the pyramid
    randomCornerVector = getRandomCornerVector();
    // takes the difference of the two vectors and returns
    // the distance from the random corner to the random point and with direction toward the random point
    diffVector = p5.Vector.sub(startingVector, randomCornerVector);

    //diffVector.normalize();
    print(randomCornerVector);
    print(diffVector);
    
    // Scale the distance vector by half
    // This is really just for precision. The last animation vector should be at the midpoint, but why not just find it exactly
    midpointVector = p5.Vector.mult(diffVector, 0.5);
    // add the random corner vector to the vector contain the scaled vector
    // the resulting midpointVector contains exact coornidates of midpoint
    // The midpoint isn't stored because we want animate first
    // After animation complete midpint vector is stored and drawn
    midpointVector.add(randomCornerVector);


    // Animation is done by scaling the vector back each time the draw loop is called
    // This calculates home much to scale back depending on the set speed
    // The speed sets the number of increments, how many times the vector is animated back before it reaches the midpoint
    // Higher speed means fewer increments and fewer times the draw loop runs before the vector is scaled back to the midpoint
    // Vice versa, slower speed equals more incremnts so the draw loop takes longer to scale back the vector
    // First get the current magnitude of the vector from the random corner to the random point
    mag = diffVector.mag();
    print(mag);
    // Next take half of the magnitude because we are only going to animate to the the midpoint or half way between
    // Then take that and divide it by the number of increments or speed to get delta 
    // Delta is how much the vector needs to be scaled back each time the draw loop is called
    delta = (mag/2)/epochs;
    print(delta);

    // Reorientate pyramid so the tip is at the top and it is turned so that one corner is coming toward the screen
    rotateX(Math.PI/2);
    rotateZ(-Math.PI/6);

}

function draw() {
    background(_backgroundColor);
    // Print total vertices on screen. The +1 is for the random starting vertex
    _jsTotalVertices.innerHTML = 'Vertices: '+(vertices.length+1);
    // Messing around with camera 
    // let camX = map(mouseX, 0, w, -w/4, w/4);
    // camera(camX,0,(h/3) / tan(PI/6), 0,0,0, 0,1,0);
    scale(_mouse.wheelScale);

    //rotateX(frameCount * 0.01);
    //rotateY(frameCount * 0.01);
    
    // Set by html button
    if ( _plane.addPlane ) {
        push();
            noStroke();
            fill( _plane.color );
            translate(  _plane.translate.x,_plane.translate.y);
            rotateX( _plane.rotateX );
            plane( _plane.size.x, _plane.size.y);
        pop();
    }

    // Set by html button
    if(_rotate) {
        rotateY(-frameCount * 0.005);
    }

    rotateX(-_angle.x);
    rotateZ(-_angle.y);

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
    // if the vector has been scaled by to midpoint
    // reset epoches, pick new random corner, find midpoint, and calulate new delta. Make sure to adjust if speed has changed
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

function mouseDragged() {
    let x = mouseX;
    let y = mouseY;

    const factor = 10/_h;
    let dx = factor * (x - _mouse.lastX);
    let dy = factor * (y - _mouse.lastY);

    _angle.x += dy;
    _angle.y += dx;

    _mouse.lastX = x;
    _mouse.lastY = y;
    // prevent default
    return false;
}



function mouseWheel(event) {
    //print(event.delta);
    //if mouse wheel event is negative zoom out; if positive zoom in
    if ( (event.delta < 0) && (_mouse.currentFactor > 1) ) {
        _mouse.wheelScale -= _mouse.scaleFactor;
        _mouse.currentFactor--;
    }
    if ( (event.delta > 0) && (_mouse.currentFactor < _mouse.maxFactor) ) {
        _mouse.wheelScale += _mouse.scaleFactor;
        _mouse.currentFactor++;
    }
    //print(_mouse.wheelScale);
    //uncomment to block page scrolling
    return false;
  }

document.getElementById("js-btn-playPause").addEventListener("click", function(){
    if (_paused) {
        console.log('play');
        _jsBtnPlayPause.innerHTML = '||';
        _paused = false;
    } else {
        console.log('pause');
        _jsBtnPlayPause.innerHTML = '>';
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

document.getElementById("js-btn-rotate").addEventListener("click", function(){
    console.log('pause');
    _rotate = !_rotate;
});

document.getElementById("js-btn-addPlane").addEventListener("click", function(){
    console.log('add plane');
    _plane.addPlane = !_plane.addPlane
});

// Set initial scale of pyramid based on size of window
if ( window.innerWidth <= window.innerHeight ) {
    _scaleValue = window.innerWidth/200 * 0.45;
    _mouse.wheelScale = _scaleValue;
} else {
    _scaleValue = window.innerHeight/200 * 0.45;
    _mouse.wheelScale = _scaleValue;
}

