

export function findDistance(myCoords, yourCoords) { /* 111139 converts lat and long in degrees to meters */
    const x = 111139*Math.abs(Math.abs(myCoords.latitude) - Math.abs(yourCoords.latitude));
    const y = 111139*Math.abs(Math.abs(myCoords.longitude) - Math.abs(yourCoords.longitude));
    const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    return dist;
}

export function distAll(myCoords, allCoords) {
    let myMap = [];
    let myDist = 0;
    /* allCoords is a Map of all entities on the map not including yourself */
    for (let [key, value] of allCoords.entries()) {
        myDist = findDistance(myCoords, value);
        if (myDist <= 5) {
            myMap.push(key, myDist);
        }
    }
    return myMap;
}