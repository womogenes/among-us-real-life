

export function findDistance(myCoords, yourCoords) {
    const x = Math.abs(Math.abs(myCoords.latitude) - Math.abs(yourCoords.latitude));
    const y = Math.abs(Math.abs(myCoords.longitude) - Math.abs(yourCoords.longitude));
    const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    return dist;
}