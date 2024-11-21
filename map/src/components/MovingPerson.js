// // MovingPerson.js
// import React, { useEffect, useRef, useState } from 'react';
// import { Marker, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import  interpolatePoints  from './interpolatePoints'; // Interpolate points for smooth path

// const personIcon = new L.Icon({
//     iconUrl: 'https://cdn-icons-png.flaticon.com/512/194/194931.png',
//     iconSize: [32, 32],
//     iconAnchor: [16, 32],
// });

// const MovingPerson = ({ path }) => {
//     const map = useMap();
//     const [currentPosition, setCurrentPosition] = useState(path[0]);
//     const positionIndex = useRef(0);
//     const interpolatedPath = interpolatePoints(path, 50); // 50 points for smoother path

//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (positionIndex.current < interpolatedPath.length - 1) {
//                 positionIndex.current++;
//                 setCurrentPosition(interpolatedPath[positionIndex.current]);
//                 map.setView(interpolatedPath[positionIndex.current]); // Keep map centered
//             } else {
//                 clearInterval(interval);
//             }
//         }, 200);

//         return () => clearInterval(interval);
//     }, [interpolatedPath, map]);

//     return <Marker position={currentPosition} icon={personIcon} />;
// };

// export default MovingPerson;
