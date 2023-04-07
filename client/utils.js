export function findDistance(myCoords, yourCoords) {
  /* 111139 converts lat and long in degrees to meters */
  const x =
    111139 *
    Math.abs(Math.abs(myCoords.latitude) - Math.abs(yourCoords.latitude));
  const y =
    111139 *
    Math.abs(Math.abs(myCoords.longitude) - Math.abs(yourCoords.longitude));
  const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return dist;
}

export function distAll(type, myCoords, allCoords, distance) {
  let myArr = [];
  let myDist = 0;
  let myObject = {};
  /* allCoords is a Array of all entities on the map not including yourself */

  allCoords.forEach((item) => {
    myDist = findDistance(myCoords, item.location);
    if (myDist <= distance) {
      // console.log(
      //   '_______________________________________________________________'
      // );
      // console.log('Distance: ' + myDist);
      // console.log('My loc: ' + myCoords.latitude + ', ' + myCoords.longitude);
      // console.log(
      //   'Other loc: ' + item.location.latitude + ', ' + item.location.longitude
      // );
      // console.log(
      //   '_______________________________________________________________'
      // );
      if (type == 'player') {
        if (item.isAlive) {
          myObject = { ...item, distance: myDist };
          myArr.push(myObject);
        }
      }
      if (type == 'task') {
        if (!item.complete) {
          myObject = { ...item, distance: myDist };
          myArr.push(myObject);
        }
      }
      else {
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
  return minItem;
}
