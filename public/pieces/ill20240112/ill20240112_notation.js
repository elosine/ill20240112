//#ef NOTES
/*
Use tempoConsts[tempoNum].frameArray to look into curve points array, find closest x and then get y value

Curve Follower see short
Multiple curves into single frame array
Multiple tempi
*/
//#endef NOTES

//#ef General Variables
const TEMPO_COLORS = [clr_limeGreen, clr_mustard, clr_brightBlue, clr_brightOrange, clr_lavander, clr_darkRed2, clr_brightGreen, clr_lightGrey, clr_neonMagenta, clr_plum, clr_blueGrey, clr_lightGrey, clr_lightGreen];
//Dimensions
const NOTATION_H = 100;
const GAP_BTWN_NOTATION_LINES = 3;
const VERT_DISTANCE_BETWEEN_LINES = NOTATION_H + GAP_BTWN_NOTATION_LINES;
const NUM_NOTATION_LINES = 5;
let WORLD_W = 945;
let WORLD_H = (NOTATION_H * NUM_NOTATION_LINES) + (GAP_BTWN_NOTATION_LINES * (NUM_NOTATION_LINES - 1));
const NOTATION_LINE_LENGTH_PX = WORLD_W;
//Timing
let FRAMECOUNT = 0;
const FRAMERATE = 60;
const MS_PER_FRAME = 1000.0 / FRAMERATE;
const PX_PER_BEAT = 30;
const TOTAL_NUM_PX_IN_SCORE = NOTATION_LINE_LENGTH_PX * NUM_NOTATION_LINES;
//Timesync
const TS = timesync.create({
  server: '/timesync',
  interval: 1000
});
//#endef General Variables

//#ef Animation Engine
let cumulativeChangeBtwnFrames_MS = 0;
let epochTimeOfLastFrame_MS;

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
  updateScrollingCsrs();
  updateCrvFollow();
}
//#endef Animation Engine

//#ef INIT
function init() {
  calcScrollingCsrs();
  calcCurves();
  console.log(curveCoordsByFramePerTempo);
  makeCanvas();
  mkStaffRects();
  drawCrvs();
  makeScrollingCursors();
  mkCrvFollower();
  let ts_Date = new Date(TS.now());
  let tsNowEpochTime_MS = ts_Date.getTime();
  epochTimeOfLastFrame_MS = tsNowEpochTime_MS;
  requestAnimationFrame(animationEngine);
}
//#endef INIT

//#ef Canvas
let canvas = {};
let panelTitle = "Interactive Looping Line 20240112";
const staffRects = [];

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
//#endef Canvas

//#ef Scrolling Cursors
let scrollingCursors = [];
let scrCsrText = [];
let scrollingCsrY1 = 15;
let scrollingCsrH = 83;
let scrollingCsrClrs = [];
let lineY = [];
for (var i = 0; i < NUM_NOTATION_LINES; i++) {
  let ty = scrollingCsrY1 + ((NOTATION_H + GAP_BTWN_NOTATION_LINES) * i);
  lineY.push(ty);
}
let tempos = [
  [60, 60, ''],
  [37.14, 37.14, ''],
  [96.92, 37.14, 'd'],
  [32.3, 86.67, 'a'],
  [86.67, 86.67, '']
];
let totalNumFramesPerTempo = [];
let tempoConsts = [];
tempos.forEach((tempo, tix) => {
  scrollingCsrClrs.push(TEMPO_COLORS[tix % TEMPO_COLORS.length]);
});
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

function calcScrollingCsrs() {
  tempoConsts.forEach((tempoObj, tempoIx) => { //run for each tempo
    let frameArray = [];
    let tNumFrames = Math.round(tempoObj.totalDurFrames); //create an array with and index for each frame in the piece per tempo
    for (var frmIx = 0; frmIx < tNumFrames; frmIx++) { //loop for each frame in the piece
      let td = {}; //dictionary to hold position values
      //Calculate x
      let tCurPx = Math.round((tempoObj.iTempoPxPerFrame * frmIx) + ((tempoObj.accel * Math.pow(frmIx, 2)) / 2));
      td['absX'] = tCurPx;
      let tx = tCurPx % NOTATION_LINE_LENGTH_PX; //calculate cursor x location at each frame for this tempo
      td['x'] = tx;
      //Calc Y pos
      let tLineNum = Math.floor(tCurPx / NOTATION_LINE_LENGTH_PX)
      let ty = scrollingCsrY1 + ((NOTATION_H + GAP_BTWN_NOTATION_LINES) * tLineNum);
      td['y'] = ty;
      frameArray.push(td);
    }
    tempoConsts[tempoIx]['frameArray'] = frameArray;
    totalNumFramesPerTempo.push(frameArray.length);
  });
}

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

function updateScrollingCsrs() {
  totalNumFramesPerTempo.forEach((numFrames, tempoIx) => {
    let currFrame = FRAMECOUNT % numFrames;
    let tx = tempoConsts[tempoIx].frameArray[currFrame].x;
    let ty = tempoConsts[tempoIx].frameArray[currFrame].y;
    scrollingCursors[tempoIx].setAttributeNS(null, 'x1', tx);
    scrollingCursors[tempoIx].setAttributeNS(null, 'x2', tx);
    scrollingCursors[tempoIx].setAttributeNS(null, 'y1', ty);
    scrollingCursors[tempoIx].setAttributeNS(null, 'y2', ty + scrollingCsrH);
    scrCsrText[tempoIx].setAttributeNS(null, 'x', tx - 5);
    scrCsrText[tempoIx].setAttributeNS(null, 'y', ty - 2);
  });
}
//#endef Scrolling Cursors

//#ef Curves
let normalizedCurveArray = [];
let curveCoordsByFramePerTempo = [];
const CRVFOLLOW_R = 4;
let crvFollowers = [];

function drawCrvs() {
  let gg = mkSvgCrv({
    svgContainer: canvas.svg,
    w: WORLD_W,
    h: NOTATION_H,
    x: 0,
    y: 0,
    pointsArray: curve20240114a,
    fill: 'none',
    stroke: 'yellow',
    strokeW: 3,
    strokeCap: 'round' //square;round;butt
  })
}

function calcCurves() {
  curve20240114a.forEach((ptObj, ptIx) => {
    td = {};
    td['x'] = ptObj.x * WORLD_W;
    td['y'] = ptObj.y * NOTATION_H;
    normalizedCurveArray.push(td)
  });
  tempoConsts.forEach((tempoObj, tempoIx) => {
    let tFrmAr = tempoObj.frameArray;
    let tCrvPtsThisTempo = [];
    tFrmAr.forEach((frmObj, frmIx) => {
      let td = {};
      td['x'] = frmObj.x;
      let tx0 = frmObj.absX;
      let tLineNum = Math.floor(tx0 / NOTATION_LINE_LENGTH_PX);
      let ty2 = (NOTATION_H / 2) + ((NOTATION_H + GAP_BTWN_NOTATION_LINES) * tLineNum);
      for (var i = 1; i < normalizedCurveArray.length; i++) {
        let tx1 = normalizedCurveArray[i - 1].x;
        let tx2 = normalizedCurveArray[i].x;
        if (tx0 <= tx2 && tx0 > tx1) {
          ty2 = normalizedCurveArray[i].y + ((NOTATION_H + GAP_BTWN_NOTATION_LINES) * tLineNum);
        }
      }
      td['y'] = ty2
      tCrvPtsThisTempo.push(td);
    });
    curveCoordsByFramePerTempo.push(tCrvPtsThisTempo);
  });
}

function mkCrvFollower() {
  for (var i = 0; i < tempos.length; i++) {
    let tCrvF = mkSvgCircle({
      svgContainer: canvas.svg,
      cx: 0,
      cy: 0,
      r: CRVFOLLOW_R,
      fill: scrollingCsrClrs[i],
      stroke: 'none',
      strokeW: 0
    });
    tCrvF.setAttributeNS(null, 'display', 'yes');
    crvFollowers.push(tCrvF);
  }
}

function updateCrvFollow() {
  totalNumFramesPerTempo.forEach((numFrames, tempoIx) => {
    let currFrame = FRAMECOUNT % numFrames;
    let tx = curveCoordsByFramePerTempo[tempoIx][currFrame].x;
    let ty = curveCoordsByFramePerTempo[tempoIx][currFrame].y;
    crvFollowers[tempoIx].setAttributeNS(null, 'cx', tx);
    crvFollowers[tempoIx].setAttributeNS(null, 'cy', ty);
  });
}
//#endef Curves








//
