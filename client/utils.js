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

export function distAll(myCoords, allCoords) {
  let myArr = [];
  let myDist = 0;
  let myObject = {};
  /* allCoords is a Array of all entities on the map not including yourself */
  allCoords.forEach((item) =>  {
    myDist = findDistance(myCoords, item.location);
    if (myDist <= 10) {
        console.log(myDist);
        console.log(myCoords.latitude);
        console.log(myCoords.longitude);
        myObject = {name: item.name, distance: myDist}
        myArr.push(myObject);
    }
  })
  return myArr;
}
