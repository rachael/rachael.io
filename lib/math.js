/**
 * lib/math: Math functions global to the application
 */

/**
 * Returns distance between the edge of a given circle and a given point (x, y)
 */
function distanceFromCircle(x, y, circleX, circleY, r) {
  return Math.abs(
    Math.sqrt(
      Math.pow(x - circleX, 2) + Math.pow(y - circleY, 2)
    ) - r
  )
}

/**
 * Inclusive random integer
 * @param  {number} min the min
 * @param  {number} max the max
 * @return {number}     a random number between min and max, inclusive
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Normalize a vector (x, y) so that x and y are between 0 and 1
 * @param  {number} x the vector's x coordinate
 * @param  {number} y the vector's y coordinate
 * @return {number[]} a vector [x, y] normalized to be between 0 and 1
 */
function normalizeVector(x, y) {
  let vectorX = x;
  let vectorY = y;
  const absX = Math.abs(x);
  const absY = Math.abs(y);

  if(absX > absY) {
    vectorX /= absX;
    vectorY /= absX;
  } else {
    vectorX /= absY;
    vectorY /= absY;
  }

  return [vectorX, vectorY];
}

export {
  distanceFromCircle,
  getRandomInt,
  normalizeVector,
}
