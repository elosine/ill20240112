//#ef NOTES
/*
Scrolling Cursors
*/
//#endef NOTES

//#ef General Variables
const TEMPO_COLORS = [clr_limeGreen, clr_mustard, clr_brightBlue, clr_brightOrange, clr_lavander, clr_darkRed2, clr_brightGreen, clr_lightGrey, clr_neonMagenta, clr_plum, clr_blueGrey, clr_lightGrey, clr_lightGreen];
//#endef General Variables

//#ef Animation Engine
let cumulativeChangeBtwnFrames_MS = 0;
let epochTimeOfLastFrame_MS;
let FRAMECOUNT = 0;
const FRAMERATE = 60;
const MS_PER_FRAME = 1000.0 / FRAMERATE;

function animationEngine(timestamp) {
  let ts_Date = new Date(TS.now());
  let tsNowEpochTime_MS = ts_Date.getTime();
  cumulativeChangeBtwnFrames_MS += tsNowEpochTime_MS - epochTimeOfLastFrame_MS;
  epochTimeOfLastFrame_MS = tsNowEpochTime_MS;
  while (cumulativeChangeBtwnFrames_MS >= MS_PER_FRAME) {
    if (cumulativeChangeBtwnFrames_MS > (MS_PER_FRAME * FRAMERATE)) cumulativeChangeBtwnFrames_MS = MS_PER_FRAME;
    update();
    FRAMECOUNT++;
    cumulativeChangeBtwnFrames_MS -= MS_PER_FRAME;
  }
  requestAnimationFrame(animationEngine);
}

function update() {

}
//#endef Animation Engine

//#ef INIT
function init() { //runs from html file: ill20231212.html <body onload='init();'></body>
  makeCanvas();
  mkStaffRects();
  //Initialize clock and start animation engine
  let ts_Date = new Date(TS.now()); //Date stamp object from TimeSync library
  let tsNowEpochTime_MS = ts_Date.getTime(); //current time at init in Epoch Time MS
  epochTimeOfLastFrame_MS = tsNowEpochTime_MS;
  // requestAnimationFrame(animationEngine); //kick off animation
}
//#endef INIT

//#ef Canvas
const NOTATION_H = 100;
const GAP_BTWN_NOTATION_LINES = 3;
const VERT_DISTANCE_BETWEEN_LINES = NOTATION_H + GAP_BTWN_NOTATION_LINES;
const NUM_NOTATION_LINES = 5;
let WORLD_W = 945;
let WORLD_H = (NOTATION_H * NUM_NOTATION_LINES) + (GAP_BTWN_NOTATION_LINES * (NUM_NOTATION_LINES - 1));
console.log(WORLD_H);
let canvas = {};
let panelTitle = "Interactive Looping Line 20240112";

function makeCanvas() {
  let tPanel = mkPanel({
    w: WORLD_W,
    h: WORLD_H,
    title: panelTitle,
    onwindowresize: true,
    clr: 'none',
    ipos: 'center-top',
  });
  tPanel.content.addEventListener('click', function() {
    document.documentElement.webkitRequestFullScreen({
      navigationUI: 'hide'
    });
  });
  canvas['panel'] = tPanel;
  canvas['div'] = tPanel.content;
  let tSvg = mkSVGcontainer({
    canvas: tPanel.content,
    w: WORLD_W,
    h: WORLD_H,
    x: 0,
    y: 0,
  });
  //Change Background Color of svg container tSvg.style.backgroundColor = clr_mustard
  tSvg.style.backgroundColor = clr_mustard;
  canvas['svg'] = tSvg;
}
//#endef Canvas

//#ef Staff Rects
const staffRects = [];
function mkStaffRects() {
  for (var i = 0; i < NUM_NOTATION_LINES; i++) {
    let tRect = mkSvgRect({
      svgContainer: canvas.svg,
      x: 0,
      y: VERT_DISTANCE_BETWEEN_LINES * i,
      w: WORLD_W,
      h: NOTATION_H,
      fill: 'black',
      stroke: 'yellow',
      strokeW: 0,
      roundR: 0
    });
    staffRects.push(tRect);
  }
}
//#endef Staff Rects









//
