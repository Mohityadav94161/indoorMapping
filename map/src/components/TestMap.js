// // import React, { useEffect, useRef, useState } from 'react';
// // import { MapContainer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
// // import L from 'leaflet';
// // import 'leaflet/dist/leaflet.css';

// // // Custom Person Marker Icon
// // const personIcon = new L.Icon({
// //     iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
// //     iconSize: [30, 30],
// //     iconAnchor: [15, 15],
// // });

// // // Graph Data - Places in the mall and distances between them
// // const graph = {
// //     A: { B: 2, C: 5 },
// //     B: { A: 2, D: 3, E: 1 },
// //     C: { A: 5, D: 2 },
// //     D: { B: 3, C: 2, F: 4 },
// //     E: { B: 1, F: 2 },
// //     F: { D: 4, E: 2, G: 6 },
// //     G: { F: 6 },
// // };

// // // Dijkstra's Algorithm to find the shortest path
// // const dijkstra = (graph, start, end) => {
// //     const distances = {};
// //     const previous = {};
// //     const queue = new Set(Object.keys(graph));

// //     for (const node of queue) {
// //         distances[node] = Infinity;
// //         previous[node] = null;
// //     }
// //     distances[start] = 0;

// //     while (queue.size) {
// //         const current = [...queue].reduce((minNode, node) =>
// //             distances[node] < distances[minNode] ? node : minNode
// //         );

// //         if (current === end) break;
// //         queue.delete(current);

// //         for (const neighbor in graph[current]) {
// //             const alt = distances[current] + graph[current][neighbor];
// //             if (alt < distances[neighbor]) {
// //                 distances[neighbor] = alt;
// //                 previous[neighbor] = current;
// //             }
// //         }
// //     }

// //     const path = [];
// //     let curr = end;
// //     while (curr) {
// //         path.unshift(curr);
// //         curr = previous[curr];
// //     }
// //     return path;
// // };

// // // Node coordinates with shop names for display
// // const nodeCoordinates = {
// //     A: { coords: [28.5665, 77.3182], name: 'Entrance' },
// //     B: { coords: [28.5668, 77.3185], name: 'Clothing Store' },
// //     C: { coords: [28.5671, 77.3178], name: 'Food Court' },
// //     D: { coords: [28.5674, 77.3180], name: 'Bookstore' },
// //     E: { coords: [28.5669, 77.3190], name: 'Electronics' },
// //     F: { coords: [28.5672, 77.3195], name: 'Cinema' },
// //     G: { coords: [28.5678, 77.3200], name: 'Exit' },
// // };

// // // Draw all paths on the map in white
// // const drawAllPaths = () => {
// //     const allPaths = [];
// //     for (const node in graph) {
// //         for (const neighbor in graph[node]) {
// //             const start = nodeCoordinates[node].coords;
// //             const end = nodeCoordinates[neighbor].coords;
// //             allPaths.push([start, end]);
// //         }
// //     }
// //     return allPaths;
// // };

// // // MovingPerson Component for animation
// // const MovingPerson = ({ path }) => {
// //     const map = useMap();
// //     const markerRef = useRef(null);
// //     const [currentPosition, setCurrentPosition] = useState(
// //         nodeCoordinates[path[0]].coords
// //     );

// //     useEffect(() => {
// //         let index = 0;
// //         const interval = setInterval(() => {
// //             if (index < path.length - 1) {
// //                 index++;
// //                 const nextPosition = nodeCoordinates[path[index]].coords;
// //                 setCurrentPosition(nextPosition);

// //                 if (markerRef.current) {
// //                     markerRef.current.setLatLng(nextPosition);
// //                 }
// //             } else {
// //                 clearInterval(interval); // Stop animation when done
// //             }
// //         }, 2000); // Update every 2 seconds

// //         return () => clearInterval(interval); // Cleanup
// //     }, [path]);

// //     return <Marker position={currentPosition} icon={personIcon} ref={markerRef} />;
// // };

// // const TestMap = ({ src, dest }) => {
// //     const path = dijkstra(graph, src, dest); // Find shortest path
// //     const polylinePositions = path.map(node => nodeCoordinates[node].coords); // Path coordinates

// //     return (
// //         <MapContainer
// //             center={nodeCoordinates[src].coords}
// //             zoom={16}
// //             style={{ height: '100vh', width: '100%' }}
// //         >
// //             {/* Show all paths in white */}
// //             {drawAllPaths().map((path, index) => (
// //                 <Polyline key={index} positions={path} color="white" />
// //             ))}

// //             {/* Moving person along the path */}
// //             <MovingPerson path={path} />

// //             {/* Display labels for nodes */}
// //             {Object.entries(nodeCoordinates).map(([key, { coords, name }]) => (
// //                 <Marker key={key} position={coords}>
// //                     <Tooltip permanent>{name}</Tooltip> {/* Label always visible */}
// //                 </Marker>
// //             ))}
// //         </MapContainer>
// //     );
// // };


// // export default TestMap;


// import React, { useEffect, useRef, useState } from 'react';
// import { MapContainer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Custom Person Marker Icon
// const personIcon = new L.Icon({
//     iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
//     iconSize: [30, 30],
//     iconAnchor: [15, 15],
// });

// // Graph Data - Places in the mall and distances between them
// const graph = {
//     A: { B: 2, C: 5 },
//     B: { A: 2, D: 3, E: 1 },
//     C: { A: 5, D: 2 },
//     D: { B: 3, C: 2, F: 4 },
//     E: { B: 1, F: 2 },
//     F: { D: 4, E: 2, G: 6 },
//     G: { F: 6 },
// };

// // Dijkstra's Algorithm to find the shortest path
// const dijkstra = (graph, start, end) => {
//     const distances = {};
//     const previous = {};
//     const queue = new Set(Object.keys(graph));

//     for (const node of queue) {
//         distances[node] = Infinity;
//         previous[node] = null;
//     }
//     distances[start] = 0;

//     while (queue.size) {
//         const current = [...queue].reduce((minNode, node) =>
//             distances[node] < distances[minNode] ? node : minNode
//         );

//         if (current === end) break;
//         queue.delete(current);

//         for (const neighbor in graph[current]) {
//             const alt = distances[current] + graph[current][neighbor];
//             if (alt < distances[neighbor]) {
//                 distances[neighbor] = alt;
//                 previous[neighbor] = current;
//             }
//         }
//     }

//     const path = [];
//     let curr = end;
//     while (curr) {
//         path.unshift(curr);
//         curr = previous[curr];
//     }
//     return path;
// };

// // Node coordinates with shop names for display
// const nodeCoordinates = {
//     A: { coords: [28.5665, 77.3182], name: 'Entrance' },
//     B: { coords: [28.5668, 77.3185], name: 'Clothing Store' },
//     C: { coords: [28.5671, 77.3178], name: 'Food Court' },
//     D: { coords: [28.5674, 77.3180], name: 'Bookstore' },
//     E: { coords: [28.5669, 77.3190], name: 'Electronics' },
//     F: { coords: [28.5672, 77.3195], name: 'Cinema' },
//     G: { coords: [28.5678, 77.3200], name: 'Exit' },
// };

// // Draw all paths on the map in white
// const drawAllPaths = () => {
//     const allPaths = [];
//     for (const node in graph) {
//         for (const neighbor in graph[node]) {
//             const start = nodeCoordinates[node].coords;
//             const end = nodeCoordinates[neighbor].coords;
//             allPaths.push([start, end]);
//         }
//     }
//     return allPaths;
// };

// // Generate intermediate points between two coordinates
// const generateIntermediatePoints = (start, end, numPoints) => {
//     const points = [];
//     const latStep = (end[0] - start[0]) / numPoints;
//     const lngStep = (end[1] - start[1]) / numPoints;

//     for (let i = 0; i <= numPoints; i++) {
//         const lat = start[0] + latStep * i;
//         const lng = start[1] + lngStep * i;
//         points.push([lat, lng]);
//     }
//     return points;
// };

// // Generate full path with intermediate points along the way
// const generateFullPath = (path) => {
//     let fullPath = [];
//     for (let i = 0; i < path.length - 1; i++) {
//         const start = nodeCoordinates[path[i]].coords;
//         const end = nodeCoordinates[path[i + 1]].coords;
//         const segment = generateIntermediatePoints(start, end, 50); // 50 points per segment
//         fullPath = fullPath.concat(segment);
//     }
//     return fullPath;
// };

// // MovingPerson Component for smooth animation
// const MovingPerson = ({ path }) => {
//     const map = useMap();
//     const markerRef = useRef(null);
//     const fullPath = generateFullPath(path); // Generate full path with intermediate points
//     const [currentPosition, setCurrentPosition] = useState(fullPath[0]);

//     useEffect(() => {
//         let index = 0;
//         const interval = setInterval(() => {
//             if (index < fullPath.length - 1) {
//                 index++;
//                 const nextPosition = fullPath[index];
//                 setCurrentPosition(nextPosition);

//                 if (markerRef.current) {
//                     markerRef.current.setLatLng(nextPosition);
//                 }
//             } else {
//                 clearInterval(interval); // Stop animation when done
//             }
//         }, 200); // Update every 200ms for smooth movement

//         return () => clearInterval(interval); // Cleanup
//     }, [fullPath]);

//     return <Marker position={currentPosition} icon={personIcon} ref={markerRef} />;
// };

// const TestMap = ({ src, dest }) => {
//     const path = dijkstra(graph, src, dest); // Find shortest path
//     const polylinePositions = path.map((node) => nodeCoordinates[node].coords); // Path coordinates

//     return (
//         <MapContainer
//             center={nodeCoordinates[src].coords}
//             zoom={16}
//             style={{ height: '100vh', width: '100%' }}
//         >
//             {/* Show all paths in white */}
//             {drawAllPaths().map((path, index) => (
//                 <Polyline key={index} positions={path} color="white" />
//             ))}

//             {/* Moving person along the path */}
//             <MovingPerson path={path} />

//             {/* Display labels for nodes */}
//             {Object.entries(nodeCoordinates).map(([key, { coords, name }]) => (
//                 <Marker key={key} position={coords}>
//                     <Tooltip permanent>{name}</Tooltip> {/* Label always visible */}
//                 </Marker>
//             ))}
//         </MapContainer>
//     );
// };

// // Example usage with source and destination
// // const App = () => {
// //     return <MallMap src="A" dest="G" />;
// // };

// export default TestMap;
