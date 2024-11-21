// /**
//  * Linearly interpolates points along a path.
//  * @param {Array} path - Array of coordinate pairs, e.g., [[x1, y1], [x2, y2], ...]
//  * @param {number} numPoints - Number of points to interpolate between each segment.
//  * @returns {Array} - An array of interpolated points along the path.
//  */
// function interpolatePoints(path, numPoints = 10) {
//     const interpolatedPath = [];

//     for (let i = 0; i < path.length - 1; i++) {
//         const [x1, y1] = path[i];
//         const [x2, y2] = path[i + 1];

//         // Calculate the step increments for each segment
//         const xStep = (x2 - x1) / (numPoints + 1);
//         const yStep = (y2 - y1) / (numPoints + 1);

//         interpolatedPath.push([x1, y1]); // Start point of the segment

//         // Add interpolated points
//         for (let j = 1; j <= numPoints; j++) {
//             interpolatedPath.push([x1 + j * xStep, y1 + j * yStep]);
//         }
//     }

//     // Add the final point
//     interpolatedPath.push(path[path.length - 1]);

//     return interpolatedPath;
// }

// export default interpolatePoints;
