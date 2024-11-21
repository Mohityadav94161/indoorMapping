// import logo from './logo.svg';
// import './App.css';
// import MallMap from './components/MapContainer';
// import TestMap from './components/TestMap'
// import { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, GeoJSON, Polyline } from 'react-leaflet';
// import MovingPerson from './components/MovingPerson';
// import interpolatePoints from './components/interpolatePoints';
// import buildingsData from './data/buildingData.json';
// import roadsData from './data/roads.json';
// import pathsData from './data/paths.json';

// const App = () => {
//   // State to handle user-selected source and destination locations
//   const [src, setSrc] = useState(null);
//   const [dest, setDest] = useState(null);
//   const [personPath, setPersonPath] = useState([]);

//   // Coordinates of selected points on map
//   const coordinates = {
//     src: [77.3183699, 28.5659676],  // Example source coordinates
//     dest: [77.3221565, 28.5662285], // Example destination coordinates
//   };

//   // Set up map bounds, initial center, and zoom
//   const mapCenter = [28.5665, 77.3182];
//   const mapZoom = 15;

//   useEffect(() => {
//     if (src && dest) {
//       const path = pathsData[src][dest] || pathsData[dest][src];
//       const interpolatedPath = interpolatePoints(path, 50);  // Smoothen path for a realistic look
//       setPersonPath(interpolatedPath);
//     }
//   }, [src, dest]);

//   return (
//     <div>
//       <h1>Interactive Indoor Navigation Map</h1>

//       <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100vh', width: '100%' }}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="&copy; OpenStreetMap contributors"
//         />

//         {/* Buildings Layer */}
//         <GeoJSON
//           data={buildingsData}
//           style={() => ({
//             color: '#555555',
//             weight: 2,
//             fillOpacity: 0.7,
//           })}
//           onEachFeature={(feature, layer) => {
//             const { name } = feature.properties;
//             if (name) {
//               layer.bindTooltip(name, { permanent: true, direction: 'center', className: 'building-label' });
//             }
//           }}
//         />

//         {/* Roads Layer */}
//         <GeoJSON data={roadsData} style={{ color: '#999999', weight: 1.5 }} />

//         {/* Person Moving Along Path */}
//         {personPath.length > 0 && <Polyline positions={personPath} color="blue" />}
//         {personPath.length > 0 && <MovingPerson path={personPath} interval={200} />}
//       </MapContainer>

//       <div className="controls">
//         <label>Source:</label>
//         <select onChange={(e) => setSrc(e.target.value)}>
//           <option value="">Select Source</option>
//           {/* Populate with available points */}
//           {Object.keys(coordinates).map((key) => (
//             <option key={key} value={key}>
//               {key}
//             </option>
//           ))}
//         </select>

//         <label>Destination:</label>
//         <select onChange={(e) => setDest(e.target.value)}>
//           <option value="">Select Destination</option>
//           {/* Populate with available points */}
//           {Object.keys(coordinates).map((key) => (
//             <option key={key} value={key}>
//               {key}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

// export default App;


import React from 'react';
import IndoorMap from './testComponent/IndoorMap';
import jsonData from './data/data.json'; // Assume your JSON data is in a file
import IndoorMap2 from './testComponent/IndoorMap2';
const App = () => {
  return (
    <div>
      <IndoorMap2 data={jsonData} />
    </div>
  );
};

export default App;


