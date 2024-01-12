//#ef NOTES
/*
Add 'A' or 'D' above accelerating or decelerating cursors
Work on ictus

which frame does a beat start on?


Write new timeline function, that calculates the number of pixels traveled for each frame
D = (initialVelocity * time) + ((acceleration * timeSquared )/2 )

Redo Calculate timelines and build frame Array; accel by alterating tempo
New tempi
New Loops
Accelerating Tempo/Loop Cursor
For accel increase pxPerFrame for each frame in tempoConsts.pxPerFrame have a accel factor
in func calcTimeline increase here:       let tCurPx = Math.round(frmIx * tempoObj.pxPerFrame);

*/
//#endef NOTES

//#ef General Variables
const TEMPO_COLORS = [clr_limeGreen, clr_mustard, clr_brightBlue, clr_brightOrange, clr_lavander, clr_darkRed2, clr_brightGreen, clr_lightGrey, clr_neonMagenta, clr_plum, clr_blueGrey];
//Timing
const FRAMERATE = 60;
const MS_PER_FRAME = 1000.0 / FRAMERATE;
let FRAMECOUNT = 0;
//Canvas Variables
let WORLD_W; // Calculated later in notation variables; 9 beats of notation @ 105 pixels per beat
let WORLD_H; //calculated later with notation variables
let canvas = {}; // canvas.panel(jspanel); canvas.div(jspanel div); canvas.svg(svg container on top of canvas.div)
let panelTitle = "Interactive Looping Line 20231227"
//Notation Variables
//File name LL20231212_SVG.svg; long single line svg notation with proportionate spacing
//just draw several times 1 for each line and move it over
//105 pixels per beat; 42 beats; 4410 x 109
//9 beats per line; 945 pixels per line
const NOTATION_FILE_NAME_PATH = '/pieces/ill20231227/notationSVGs/';
const NOTATION_FILE_NAME = 'ILL20231227_SVG.svg';
const PX_PER_BEAT = 105;
const BEATS_PER_LINE = 9;
const WHOLE_NOTATION_W = 4410;
const NOTATION_H = 109;
const GAP_BTWN_NOTATION_LINES = 10;
const VERT_DISTANCE_BETWEEN_LINES = NOTATION_H + GAP_BTWN_NOTATION_LINES;
const NOTATION_TOTAL_BEATS = 42; //cut off a few measures for long note but keep 42 for pixels per beat
const NUM_NOTATION_LINES = 4;
const NUM_BEATS_IN_PIECE = 36;
const NOTATION_LINE_LENGTH_PX = BEATS_PER_LINE * PX_PER_BEAT;
const TOTAL_NUM_PX_IN_SCORE = NOTATION_LINE_LENGTH_PX * NUM_NOTATION_LINES;
WORLD_W = NOTATION_LINE_LENGTH_PX;
WORLD_H = (NOTATION_H * NUM_NOTATION_LINES) + (GAP_BTWN_NOTATION_LINES * (NUM_NOTATION_LINES - 1));
//Tempo Timing
let tempos = [
  [60, 60, ''],
  [37.14, 37.14, ''],
  [96.92, 37.14, 'd'],
  [32.3, 86.67, 'a'],
  [86.67, 86.67, '']
];
let totalNumFramesPerTempo = [];
let tempoConsts = [];
tempos.forEach((tempoArr, i) => {
  let td = {};
  //convert initial and final tempi from bpm to pixelsPerFrame
  let iTempo = tempoArr[0]; //bpm
  let fTempo = tempoArr[1]; //bpm
  td['iTempoBPM'] = iTempo;
  td['fTempoBPM'] = fTempo;
  // convert bpm to pxPerFrame: pxPerMinute = iTempo * PX_PER_BEAT; pxPerSec = pxPerMinute/60; pxPerFrame = pxPerSec/FRAMERATE
  let iTempoPxPerFrame = ((iTempo * PX_PER_BEAT) / 60) / FRAMERATE;
  let fTempoPxPerFrame = ((fTempo * PX_PER_BEAT) / 60) / FRAMERATE;
  td['iTempoPxPerFrame'] = iTempoPxPerFrame;
  td['fTempoPxPerFrame'] = fTempoPxPerFrame;
  //calc acceleration from initial tempo and final tempo
  // a = (v2 - u2) / 2s ; v=finalVelocity, u=initialVelocity, s=totalDistance
  let tAccel = (Math.pow(fTempoPxPerFrame, 2) - Math.pow(iTempoPxPerFrame, 2)) / (2 * TOTAL_NUM_PX_IN_SCORE);
  // console.log('tempo ' + i + ' acceleration: ' + tAccel);
  td['accel'] = tAccel;
  // Calculate total number of frames from acceleration and distance
  // t = sqrRoot( (2L/a) ) ; L is total pixels
  let totalDurFrames;
  if (tAccel == 0) {
    totalDurFrames = Math.round(TOTAL_NUM_PX_IN_SCORE / iTempoPxPerFrame);
  } else {
    totalDurFrames = Math.round((fTempoPxPerFrame - iTempoPxPerFrame) / tAccel);
  }
  // console.log('Total Frames, tempo ' + i + ' : ' + totalDurFrames);
  td['totalDurFrames'] = totalDurFrames;
  tempoConsts.push(td);
});
//Beat Lines
let beatLines = [];
//Scrolling Cursors
let scrollingCursors = [];
let scrCsrText = [];
let scrollingCsrY1 = 30;
let scrollingCsrH = 65;
let scrollingCsrClrs = [];
let lineY = [];
for (var i = 0; i < NUM_NOTATION_LINES; i++) {
  let ty = scrollingCsrY1 + ((NOTATION_H + GAP_BTWN_NOTATION_LINES) * i);
  lineY.push(ty);
}
tempos.forEach((tempo, tix) => {
  scrollingCsrClrs.push(TEMPO_COLORS[tix % TEMPO_COLORS.length]);
});
//Loops
let totalNumFramesPerLoop = [];
let loops = [{
    beatA: 6,
    beatB: 12,
    tempoIx: 2,
    leftY: lineY[0],
    rightY: lineY[1]
  }, {
    beatA: 14,
    beatB: 23,
    tempoIx: 4,
    leftY: lineY[1],
    rightY: lineY[2]
  },
  {
    beatA: 28,
    beatB: 35.98,
    tempoIx: 3,
    leftY: lineY[3],
    rightY: lineY[3]
  }, {
    beatA: 24,
    beatB: 27,
    tempoIx: 3,
    leftY: lineY[2],
    rightY: lineY[2]
  }
];
loops.forEach((loopObj, loopIx) => {
  let tLenPx = (loopObj.beatB - loopObj.beatA) * PX_PER_BEAT;
  loops[loopIx]['lenPx'] = tLenPx;
  let tpixa = (loopObj.beatA % BEATS_PER_LINE) * PX_PER_BEAT;
  loops[loopIx]['beatApxX'] = tpixa;
});
let loopCursors = [];
let loopBbs = [];
let loopsFrameArray = [];
//BBs
let BB_RADIUS = 4;
let bbs = [];
//Timesync
const TS = timesync.create({
  server: '/timesync',
  interval: 1000
});
//#endef General Variables

//##ef Calculate Ascent and Descent for 1 BB
let bbOneBeat = [];
// let descentPct = 0.6;
let descentPct = 0.8;
let ascentPct = 1 - descentPct;
let ascentNumXpx = Math.ceil(ascentPct * PX_PER_BEAT);
let descentNumXpx = Math.floor(descentPct * PX_PER_BEAT);
// let ascentFactor = 0.45;
let ascentFactor = 0.15;
// let descentFactor = 2.9;
let descentFactor = 5;
let ascentPlot = plot(function(x) { //see Function library; exponential curve
  return Math.pow(x, ascentFactor);
}, [0, 1, 0, 1], ascentNumXpx, scrollingCsrH, scrollingCsrY1);
ascentPlot.forEach((y) => {
  bbOneBeat.push(y);
});
let descentPlot = plot(function(x) {
  return Math.pow(x, descentFactor);
}, [0, 1, 1, 0], descentNumXpx, scrollingCsrH, scrollingCsrY1);
descentPlot.forEach((y) => {
  bbOneBeat.push(y);
});
//##endef Calculate BBs

//#ef Calculate Timelines
function calcTimeline() {
  tempoConsts.forEach((tempoObj, tempoIx) => { //run for each tempo
    let frameArray = [];
    let tNumFrames = Math.round(tempoObj.totalDurFrames); //create an array with and index for each frame in the piece per tempo
    for (var frmIx = 0; frmIx < tNumFrames; frmIx++) { //loop for each frame in the piece
      let td = {}; //dictionary to hold position values
      //Calculate x
      let tCurPx = Math.round((tempoObj.iTempoPxPerFrame * frmIx) + ((tempoObj.accel * Math.pow(frmIx, 2)) / 2));
      td['absX'] = tCurPx;
      // console.log(tCurPx);
      let tx = tCurPx % NOTATION_LINE_LENGTH_PX; //calculate cursor x location at each frame for this tempo
      td['x'] = tx;
      //Calc BBy
      let tBbX = tCurPx % Math.round(PX_PER_BEAT);
      let tBbY = bbOneBeat[tBbX].y;
      //Calc Y pos
      let ty;
      if (tCurPx < NOTATION_LINE_LENGTH_PX) {
        ty = scrollingCsrY1;
      } else if (tCurPx >= NOTATION_LINE_LENGTH_PX && tCurPx < (NOTATION_LINE_LENGTH_PX * 2)) {
        ty = scrollingCsrY1 + NOTATION_H + GAP_BTWN_NOTATION_LINES;
        tBbY = tBbY + NOTATION_H + GAP_BTWN_NOTATION_LINES;
      } else if (tCurPx >= (NOTATION_LINE_LENGTH_PX * 2) && tCurPx < (NOTATION_LINE_LENGTH_PX * 3)) {
        ty = scrollingCsrY1 + ((NOTATION_H + GAP_BTWN_NOTATION_LINES) * 2);
        tBbY = tBbY + ((NOTATION_H + GAP_BTWN_NOTATION_LINES) * 2);
      } else {
        ty = scrollingCsrY1 + ((NOTATION_H + GAP_BTWN_NOTATION_LINES) * 3);
        tBbY = tBbY + ((NOTATION_H + GAP_BTWN_NOTATION_LINES) * 3);
      }
      td['y'] = ty;
      td['bby'] = tBbY;
      frameArray.push(td);
    }
    tempoConsts[tempoIx]['frameArray'] = frameArray;
    totalNumFramesPerTempo.push(frameArray.length);
  });
}
//#endef Calculate Timelines

//#ef Calculate Loops
function calcLoopsData() {
  for (let loopIx = 0; loopIx < loops.length; loopIx++) {
    let tLoopObj = loops[loopIx];
    //Which pixel does the first beat of loop occur on?
    let tBeatApx = tLoopObj.beatA * PX_PER_BEAT;
    let tBeatBpx = tLoopObj.beatB * PX_PER_BEAT;
    // find the frame this pixel is in for the assigned tempo
    let tB1Frame, tB2Frame;
    for (let frmIx = 1; frmIx < tempoConsts[tLoopObj.tempoIx].frameArray.length; frmIx++) {
      let tThisX = tempoConsts[tLoopObj.tempoIx].frameArray[frmIx].absX;
      let tLastX = tempoConsts[tLoopObj.tempoIx].frameArray[frmIx - 1].absX;
      if (tBeatApx >= tLastX && tBeatApx < tThisX) {
        tB1Frame = frmIx - 1;
        loops[loopIx]['frameA'] = tB1Frame;
      }
      if (tBeatBpx >= tLastX && tBeatBpx < tThisX) {
        tB2Frame = frmIx - 1;
        loops[loopIx]['frameB'] = tB2Frame;
      }
    }
    let tNumFramesInLoop = tB2Frame - tB1Frame;
    loops[loopIx]['numFrames'] = tNumFramesInLoop;
    totalNumFramesPerLoop.push(tNumFramesInLoop);
  }

}

function calcLoopsFrameArray() {
  loops.forEach((lpObj, lpIx) => {
    let tempoFrameArray = tempoConsts[lpObj.tempoIx].frameArray;
    let tNumFrames = lpObj.numFrames;
    let tfrmArray = [];
    for (var frmIx = 0; frmIx < tNumFrames; frmIx++) {
      let td = {};
      let tIx = frmIx + lpObj.frameA;
      td['x'] = tempoFrameArray[tIx].x;
      td['y'] = tempoFrameArray[tIx].y;
      td['bby'] = tempoFrameArray[tIx].bby;
      tfrmArray.push(td);
    }
    loopsFrameArray.push(tfrmArray);
  });
}
//#endef Calculate Loops

//#ef Animation Engine
//Animation Engine Variables
let cumulativeChangeBtwnFrames_MS = 0;
let epochTimeOfLastFrame_MS;

function animationEngine(timestamp) { //timestamp not used; timeSync server library used instead
  let ts_Date = new Date(TS.now()); //Date stamp object from TimeSync library
  let tsNowEpochTime_MS = ts_Date.getTime();
  cumulativeChangeBtwnFrames_MS += tsNowEpochTime_MS - epochTimeOfLastFrame_MS;
  epochTimeOfLastFrame_MS = tsNowEpochTime_MS; //update epochTimeOfLastFrame_MS for next frame
  while (cumulativeChangeBtwnFrames_MS >= MS_PER_FRAME) { //if too little change of clock time will wait until 1 animation frame's worth of MS before updating etc.; if too much change will update several times until caught up with clock time
    if (cumulativeChangeBtwnFrames_MS > (MS_PER_FRAME * FRAMERATE)) cumulativeChangeBtwnFrames_MS = MS_PER_FRAME; //escape hatch if more than 1 second of frames has passed then just skip to next update according to clock
    update();
    FRAMECOUNT++;
    cumulativeChangeBtwnFrames_MS -= MS_PER_FRAME; //subtract from cumulativeChangeBtwnFrames_MS 1 frame worth of MS until while cond is satisified
  }
  requestAnimationFrame(animationEngine);
}
// Update Functions
function update() {
  //Loops
  totalNumFramesPerLoop.forEach((numFrames, loopIx) => {
    let currFrame = FRAMECOUNT % numFrames;
    updateLoops(currFrame, loopIx);
  });
  //Scrolling Cursors
  totalNumFramesPerTempo.forEach((numFrames, tempoIx) => {
    let currFrame = FRAMECOUNT % numFrames;
    updateScrollingCsrs(currFrame, tempoIx);
    updateBbs(currFrame, tempoIx);
  });
}
//#endef Animation Engine END

//#ef INIT
function init() { //runs from html file: ill20231212.html <body onload='init();'></body>
  makeCanvas();
  drawNotation();
  makeLoopCursors();
  makeScrollingCursors();
  makeBbs();
  makeLoopBbs();
  calcTimeline();
  calcLoopsData();
  calcLoopsFrameArray();
  makeLoopBrackets();
  //Initialize clock and start animation engine
  let ts_Date = new Date(TS.now()); //Date stamp object from TimeSync library
  let tsNowEpochTime_MS = ts_Date.getTime(); //current time at init in Epoch Time MS
  epochTimeOfLastFrame_MS = tsNowEpochTime_MS;
  requestAnimationFrame(animationEngine); //kick off animation
}
//#endef INIT

//#ef Make Canvas
function makeCanvas() {
  //Make Panel with jsPanel
  let tPanel = mkPanel({
    w: WORLD_W,
    h: WORLD_H,
    title: panelTitle,
    onwindowresize: true,
    clr: 'none',
    ipos: 'center-top',
  });
  // Enable Click/Tap to go to full screen mode
  tPanel.content.addEventListener('click', function() {
    document.documentElement.webkitRequestFullScreen({
      navigationUI: 'hide'
    });
  });
  //tPanel.content is the jspanel's div container
  //Change Background Color of Panel: tPanel.content.style.backgroundColor = clr_plum;
  canvas['panel'] = tPanel;
  canvas['div'] = tPanel.content;
  // SVG Container on top of jsPanel's div
  let tSvg = mkSVGcontainer({
    canvas: tPanel.content,
    w: WORLD_W,
    h: WORLD_H,
    x: 0,
    y: 0,
  });
  //Change Background Color of svg container tSvg.style.backgroundColor = clr_mustard
  canvas['svg'] = tSvg;
}
//#endef Make Canvas

//#ef Draw Notation
function drawNotation() {
  for (var i = 0; i < NUM_NOTATION_LINES; i++) {
    //Notation
    let tSvgImage = document.createElementNS(SVG_NS, "image");
    tSvgImage.setAttributeNS(XLINK_NS, 'xlink:href', NOTATION_FILE_NAME_PATH + NOTATION_FILE_NAME);
    tSvgImage.setAttributeNS(null, "y", i * (NOTATION_H + GAP_BTWN_NOTATION_LINES));
    tSvgImage.setAttributeNS(null, "x", i * -NOTATION_LINE_LENGTH_PX);
    tSvgImage.setAttributeNS(null, "visibility", 'visible');
    tSvgImage.setAttributeNS(null, "display", 'yes');
    canvas.svg.appendChild(tSvgImage);
    //Beat Lines
    for (var j = 0; j < BEATS_PER_LINE; j++) {
      let tx2 = j * PX_PER_BEAT;
      let y1 = (i * VERT_DISTANCE_BETWEEN_LINES);
      let tBl = mkSvgLine({
        svgContainer: canvas.svg,
        x1: tx2,
        y1: y1,
        x2: tx2,
        y2: y1 + NOTATION_H,
        stroke: 'magenta',
        strokeW: 0.5
      });
      beatLines.push(tBl);
    }
  }
}
//#endef Draw Notation

//#ef Scrolling Cursor with BB
function makeScrollingCursors() {
  for (var i = 0; i < tempos.length; i++) {
    let tCsr = mkSvgLine({
      svgContainer: canvas.svg,
      x1: 0,
      y1: scrollingCsrY1,
      x2: 0,
      y2: scrollingCsrY1 + scrollingCsrH,
      stroke: scrollingCsrClrs[i],
      strokeW: 2
    });
    tCsr.setAttributeNS(null, 'stroke-linecap', 'round');
    tCsr.setAttributeNS(null, 'display', 'yes');
    scrollingCursors.push(tCsr);
    //Cursor Text
    let tTxt = mkSvgText({
      svgContainer: canvas.svg,
      x: 0,
      y: scrollingCsrY1,
      fill: scrollingCsrClrs[i],
      stroke: scrollingCsrClrs[i],
      strokeW: 1,
      justifyH: 'start',
      justifyV: 'auto',
      fontSz: 18,
      fontFamily: 'lato',
      txt: tempos[i][2]
    });
    scrCsrText.push(tTxt);
  }
}

function makeBbs() {
  for (var i = 0; i < tempos.length; i++) {
    let tBb = mkSvgCircle({
      svgContainer: canvas.svg,
      cx: 0,
      cy: 0,
      r: BB_RADIUS,
      fill: scrollingCsrClrs[i],
      stroke: 'white',
      strokeW: 0
    });
    bbs.push(tBb);
  }
}

function updateScrollingCsrs(frame, tempoIx) {
  let tx = tempoConsts[tempoIx].frameArray[frame].x;
  let ty = tempoConsts[tempoIx].frameArray[frame].y;
  scrollingCursors[tempoIx].setAttributeNS(null, 'x1', tx);
  scrollingCursors[tempoIx].setAttributeNS(null, 'x2', tx);
  scrollingCursors[tempoIx].setAttributeNS(null, 'y1', ty);
  scrollingCursors[tempoIx].setAttributeNS(null, 'y2', ty + scrollingCsrH);
  scrCsrText[tempoIx].setAttributeNS(null, 'x', tx-5);
  scrCsrText[tempoIx].setAttributeNS(null, 'y', ty-2);
}

function updateBbs(frame, tempoIx) {
  let tx = tempoConsts[tempoIx].frameArray[frame].x;
  let ty = tempoConsts[tempoIx].frameArray[frame].bby;
  bbs[tempoIx].setAttributeNS(null, 'cx', tx);
  bbs[tempoIx].setAttributeNS(null, 'cy', ty);
}
//#endef Scrolling Cursor with BB

//#ef Loops
function makeLoopCursors() {
  for (var i = 0; i < loops.length; i++) {
    let tCsr = mkSvgLine({
      svgContainer: canvas.svg,
      x1: 0,
      y1: scrollingCsrY1,
      x2: 0,
      y2: scrollingCsrY1 + scrollingCsrH,
      stroke: clr_neonMagenta,
      strokeW: 3
    });
    tCsr.setAttributeNS(null, 'stroke-linecap', 'round');
    tCsr.setAttributeNS(null, 'display', 'yes');
    loopCursors.push(tCsr);
  }
}

function makeLoopBbs() {
  for (var i = 0; i < loops.length; i++) {
    let tBb = mkSvgCircle({
      svgContainer: canvas.svg,
      cx: 0,
      cy: 0,
      r: BB_RADIUS,
      fill: clr_neonMagenta,
      stroke: 'white',
      strokeW: 0
    });
    loopBbs.push(tBb);
  }
}

function makeLoopBrackets() {
  loopsFrameArray.forEach((loopObj, loopIx) => {
    let ty1 = loopObj[0].y;
    let tx1 = loopObj[0].x;
    let tSvgImage = document.createElementNS(SVG_NS, "image");
    tSvgImage.setAttributeNS(XLINK_NS, 'xlink:href', NOTATION_FILE_NAME_PATH + 'leftBracket.svg');
    tSvgImage.setAttributeNS(null, "y", ty1 - 15);
    tSvgImage.setAttributeNS(null, "x", tx1 - 2);
    tSvgImage.setAttributeNS(null, "visibility", 'visible');
    tSvgImage.setAttributeNS(null, "display", 'yes');
    canvas.svg.appendChild(tSvgImage);
    let ty2 = loopObj[loopObj.length - 1].y;
    let tx2 = loopObj[loopObj.length - 1].x;
    let tSvgImageR = document.createElementNS(SVG_NS, "image");
    tSvgImageR.setAttributeNS(XLINK_NS, 'xlink:href', NOTATION_FILE_NAME_PATH + 'rightBracket.svg');
    tSvgImageR.setAttributeNS(null, "y", ty2 - 15);
    tSvgImageR.setAttributeNS(null, "x", tx2 - 16);
    tSvgImageR.setAttributeNS(null, "visibility", 'visible');
    tSvgImageR.setAttributeNS(null, "display", 'yes');
    canvas.svg.appendChild(tSvgImageR);
  });
}

function updateLoops(frame, loopIx) {
  let tx = loopsFrameArray[loopIx][frame].x;
  let ty = loopsFrameArray[loopIx][frame].y;
  loopCursors[loopIx].setAttributeNS(null, 'x1', tx);
  loopCursors[loopIx].setAttributeNS(null, 'x2', tx);
  loopCursors[loopIx].setAttributeNS(null, 'y1', ty);
  loopCursors[loopIx].setAttributeNS(null, 'y2', ty + scrollingCsrH);
  //bbs
  let tbx = loopsFrameArray[loopIx][frame].x;
  let tby = loopsFrameArray[loopIx][frame].bby;
  loopBbs[loopIx].setAttributeNS(null, 'cx', tbx);
  loopBbs[loopIx].setAttributeNS(null, 'cy', tby);
}
//#endef Loops


//
