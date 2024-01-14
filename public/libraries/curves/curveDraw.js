//USE THIS TO HAND DRAW CURVES
//COPY FINAL OBJECT OUT OF THE CONSOLE LOG AND USE AS NORMALIZED DATA


// from usefulFunctions1_2.js
// FUNCTION: clamp ---------------------------------------------- //
function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}
// FUNCTION: norm -------------------------------------------------- //
const norm = (num, in_min, in_max) => {
  return (num - in_min) * (1.0 - 0.0) / (in_max - in_min);
}
let clr_limeGreen = 'rgb(153,255,0)';



let canvasH = 100;
let canvasW = 950;
let curveCoords = [];
let canvasSize = [];


// wait for the content of the window element
// to load, then performs the operations.
// This is considered best practice.
window.addEventListener('load', () => {

  resize(); // Resizes the canvas once the window loads
  document.addEventListener('mousedown', startPainting);
  document.addEventListener('mouseup', stopPainting);
  document.addEventListener('mousemove', sketch);
  window.addEventListener('resize', resize);
});

const canvas = document.querySelector('#canvas');

// Context for the canvas for 2 dimensional operations
const ctx = canvas.getContext('2d');

// Resizes the canvas to the available size of the window.
function resize() {
  ctx.canvas.width = canvasW;
  ctx.canvas.height = canvasH;
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}



// Stores the initial position of the cursor
let coord = {
  x: 0,
  y: 0
};

// This is the flag that we are going to use to
// trigger drawing
let paint = false;

// Updates the coordianates of the cursor when
// an event e is triggered to the coordinates where
// the said event is triggered.
function getPosition(event) { //grab coordinates here
  let tx = event.clientX - canvas.offsetLeft;
  let ty = event.clientY - canvas.offsetTop;
  tx = clamp(tx, 0, canvasW);
  ty = clamp(ty, 0, canvasH);
  coord.x = tx;
  coord.y = ty;
  let td = {};
  td['x'] = norm(tx, 0, canvasW);
  td['y'] = norm(ty, 0, canvasH);
  curveCoords.push(td)
  console.log(curveCoords);
}

// The following functions toggle the flag to start
// and stop drawing
function startPainting(event) {
  paint = true;
  getPosition(event);
}

function stopPainting() {
  paint = false;
}

function sketch(event) {
  if (!paint) return;
  ctx.beginPath();

  ctx.lineWidth = 2;

  // Sets the end of the lines drawn
  // to a round shape.
  ctx.lineCap = 'round';

  ctx.strokeStyle = clr_limeGreen;

  // The cursor to start drawing
  // moves to this coordinate
  ctx.moveTo(coord.x, coord.y);

  // The position of the cursor
  // gets updated as we move the
  // mouse around.
  getPosition(event);

  // A line is traced from start
  // coordinate to this coordinate
  ctx.lineTo(coord.x, coord.y);

  // Draws the line.
  ctx.stroke();
}
