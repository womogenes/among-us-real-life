export const findDist = (locA, locB) => {
  /*
    Takes in two objects with keys "latitude" and "longitude",
      returns distance between them on Earth's surface in meters
  */
  /* 111139 converts lat and long in degrees to meters */
  const x =
    111139 * Math.abs(Math.abs(locA.latitude) - Math.abs(locB.latitude));
  const y =
    111139 * Math.abs(Math.abs(locA.longitude) - Math.abs(locB.longitude));
  const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return dist;
};
