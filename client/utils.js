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

export function distAll(myCoords, allCoords, distance) {
  let myArr = [];
  let myDist = 0;
  let myObject = {};
  /* allCoords is a Array of all entities on the map not including yourself */
  allCoords.forEach((item) =>  {
    myDist = findDistance(myCoords, item.location);
    if (myDist <= distance) {
        console.log('_______________________________________________________________');
        console.log('Distance: ' + myDist);
        console.log('My loc: ' + myCoords.latitude + ", " + myCoords.longitude);
        console.log('Other loc: ' + item.location.latitude + ", " + item.location.longitude);
        console.log('_______________________________________________________________');
        myObject = {name: item.name, distance: myDist}
        myArr.push(myObject);
    }
    else {
        console.log('_______________________________________________________________');
        console.log('Distance: ' + myDist);
        console.log('My loc: ' + myCoords.latitude + ", " + myCoords.longitude);
        console.log('Other loc: ' + item.location.latitude + ", " + item.location.longitude);
        console.log('_______________________________________________________________');
    }
  })
  return myArr;
}

export function findClosestTask(distArr) {
  if(distArr.length == 0){
    return []
  }
  let min = distArr[0].distance;
  let minTask = distArr[0];
  distArr.forEach((item) => {
    if(item.distance < min){
      min = item.distance;
      minTask = item;
    }
  })
  return minTask;
}