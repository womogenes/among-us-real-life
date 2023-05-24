export function findDistance(myCoords, yourCoords) {
  /* 111139 converts lat and long in rad to meters */
  const x =
    111139 *
    Math.abs(Math.abs(myCoords.latitude) - Math.abs(yourCoords.latitude));
  const y =
    111139 *
    Math.abs(Math.abs(myCoords.longitude) - Math.abs(yourCoords.longitude));
  const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return dist;
}

export function findDirection(myCoords, yourCoords) {
  const x = myCoords.latitude - yourCoords.latitude;
  const y = myCoords.longitude - yourCoords.longitude;
  const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  let rad = 0;
  if(x == 0 || y == 0) {
    if(x == 0) {
      if (y > 0) { // Pointing Up
        rad = Math.PI/2;
      }
      else if(y < 0) { // Pointing Down
        rad = 3*Math.PI/2;
      }
      else { // Right On
        rad = 0;
      }
    }
    else if (y == 0) {
      if (x > 0) { // Pointing Right
        rad = 0;
      }
      else if(x < 0) { // Pointing Left
        rad = Math.PI;
      }
    }
  }
  else if(x > 0 && y > 0) { // Quadrant 1
    rad = Math.asin(Math.abs(y/dist));
  }
  else if(x < 0 && y > 0) { // Quadrant 2
    rad = Math.asin(Math.abs(x/dist)) + Math.PI/2;
  }
  else if(x < 0 && y < 0) { // Quadrant 3
    rad = Math.asin(Math.abs(y/dist)) + Math.PI;
  }
  else if(x < 0 && y < 0) { // Quadrant 4
    rad = Math.asin(Math.abs(x/dist)) + 3*Math.PI/2;
  }
  return rad;
}

export function distAll(type, myCoords, allCoords, distance) {
  if (!myCoords) return [];

  let myArr = [];
  let myDist = 0;
  let myDir = 0;
  let myObject = {};
  /* allCoords is a Array of all entities on the map not including yourself */

  allCoords.forEach((item) => {
    myDist = findDistance(myCoords, item.location);
    if (myDist <= distance) {
      if (type == 'player') {
        if (item.isAlive) {
          myObject = { ...item, distance: myDist};
          myArr.push(myObject);
        }
      }
      if (type == 'task') {
        if (!item.complete) {
          myDir = findDirection(myCoords, item.location);
          myObject = { ...item, distance: myDist, direction: myDir };
          myArr.push(myObject);
        }
      } else {
        myObject = { ...item, distance: myDist };
        myArr.push(myObject);
      }
    }
  });
  return myArr;
}

export function findClosest(distArr) {
  if (distArr.length == 0) {
    return [];
  }
  let min = distArr[0].distance;
  let minItem = distArr[0];
  distArr.forEach((item) => {
    if (item.distance < min) {
      min = item.distance;
      minItem = item;
    }
  });
  console.log(minItem.direction*57.2958);
  return minItem;
}
