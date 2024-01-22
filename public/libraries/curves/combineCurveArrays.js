/*
add all curves to html
combine curves
multiply by width and depth
Find/make smoothing filter
*/
let curveArraysInOrder = [curve20240120_001,curve20240120_002, curve20240120_003, curve20240120_004, curve20240120_005 ];
let combinedCurve = deepCopy(curve20240120_001);
for (var i = 1; i < curveArraysInOrder.length; i++) {
  curveArraysInOrder[i].forEach((ptObj, ptIx) => {
    let td = {};
    let tx = ptObj.x + i;
    td['x'] = tx;
    td['y'] = ptObj.y;
    combinedCurve.push(td);
  });
}
console.log(combinedCurve);

  function deepCopy(arr){
  let copy = [];
  arr.forEach(elem => {
    if(Array.isArray(elem)){
      copy.push(deepCopy(elem))
    }else{
      if (typeof elem === 'object') {
        copy.push(deepCopyObject(elem))
    } else {
        copy.push(elem)
      }
    }
  })
  return copy;
}

// Helper function to deal with Objects

// const deepCopyObject = (obj) => {
function deepCopyObject(obj){
  let tempObj = {};
  for (let [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      tempObj[key] = deepCopy(value);
    } else {
      if (typeof value === 'object') {
        tempObj[key] = deepCopyObject(value);
      } else {
        tempObj[key] = value
      }
    }
  }
  return tempObj;
}

//const array2 = deepCopy(array1);
