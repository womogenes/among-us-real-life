

export function findDistance(myCoords, yourCoords) {
    const x = Math.abs(Math.abs(myCoords.latitude) - Math.abs(yourCoords.latitude));
    const y = Math.abs(Math.abs(myCoords.longitude) - Math.abs(yourCoords.longitude));
    const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    return dist;
}

export function distAll(myCoords, allCoords) {
    const myMap = new Map();
    const myDist = 0;
    /* allCoords is a Map of all entities on the map not including yourself */
    for (let [key, value] of allCoords.entries()) {
        myDist = findDistance(myCoords, value);
        if (myDist <= 5) {
            allCoords.set(key, myDist);
        }
    }
    return myMap;
}