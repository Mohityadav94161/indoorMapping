// // import React, { useEffect,useState } from 'react';
// // import { MapContainer, GeoJSON, useMap, TileLayer } from 'react-leaflet';
// // import 'leaflet/dist/leaflet.css';

// // import amenityPoints from './amenity_points.json';
// // import amenityPolygons from './amenity_polygons.json';
// // import bridges from './bridges.json';
// // import buildings from './buildings.json';
// // import landcover from './landcover.json';
// // import powerLineColumns from './power_line_columns.json';
// // import powerLines from './power_lines.json';
// // import roads from './roads.json';
// // import stations from './stations.json';
// // import tunnels from './tunnels.json';
// // import mall_map from './tunnels.json';

// // import L from 'leaflet';


// // // Layer component to manage zoom-dependent layers
// // const ZoomControlledLayers = ({ zoom }) => {
// //     return (
// //         <>
// //             {/* Buildings Layer */}
// //             {zoom >= 15 && (
// //                 <GeoJSON
// //                     data={buildings}
// //                     style={buildingStyle}
// //                     onEachFeature={(feature, layer) => {
// //                         if (feature.properties && feature.properties.name) {
// //                             layer.bindTooltip(feature.properties.name);
// //                         }
// //                     }}
// //                 />
// //             )}

// //             {/* Roads Layer */}
// //             <GeoJSON
// //                 data={roads}
// //                 style={roadStyle}
// //                 onEachFeature={(feature, layer) => {
// //                     if (feature.properties) {
// //                         const { name, highway } = feature.properties;
// //                         layer.bindPopup(`
// //                             <strong>Highway:</strong> ${highway}<br />
// //                             <strong>Name:</strong> ${name || 'N/A'}
// //                         `);
// //                     }
// //                 }}
// //             />

// //             {/* Stations Layer */}
// //             {zoom >= 14 && (
// //                 <GeoJSON
// //                     data={stations}
// //                     pointToLayer={(feature, latlng) =>
// //                         L.circleMarker(latlng, stationStyle)
// //                     }
// //                     onEachFeature={(feature, layer) => {
// //                         if (feature.properties) {
// //                             const { name, operator } = feature.properties;
// //                             layer.bindPopup(`
// //                                 <strong>Name:</strong> ${name || 'N/A'}<br />
// //                                 <strong>Operator:</strong> ${operator || 'N/A'}
// //                             `);
// //                         }
// //                     }}
// //                 />
// //             )}

// //             {/* Amenity Points Layer */}
// //             {zoom >= 15 && (
// //                 <GeoJSON
// //                     data={amenityPoints}
// //                     pointToLayer={(feature, latlng) =>
// //                         L.circleMarker(latlng, { radius: 5, color: 'green' })
// //                     }
// //                     onEachFeature={(feature, layer) => {
// //                         if (feature.properties) {
// //                             const { name, amenity, brand } = feature.properties;
// //                             layer.bindPopup(`
// //                                 <strong>Name:</strong> ${name || 'N/A'}<br />
// //                                 <strong>Amenity:</strong> ${amenity || 'N/A'}<br />
// //                                 <strong>Brand:</strong> ${brand || 'N/A'}
// //                             `);
// //                         }
// //                     }}
// //                 />
// //             )}
// //         </>
// //     );
// // };

// // // Main Map component
// // const MallMap = () => {
// //     return (
// //         <MapContainer
// //             center={[28.5665, 77.3182]}
// //             zoom={15}
// //             style={{ height: '100vh', width: '100%' }}
// //         >
// //             <ZoomMap /> {/* Component that manages zoom state */}
// //         </MapContainer>
// //     );
// // };

// // // Separate component to handle the zoom state
// // const ZoomMap = () => {
// //     const map = useMap(); // Now we are inside MapContainer context
// //     const [zoom, setZoom] = useState(map.getZoom()); // Initialize with current zoom level

// //     useEffect(() => {
// //         const handleZoom = () => {
// //             const currentZoom = map.getZoom();
// //             setZoom(currentZoom);
// //         };

// //         map.on('zoomend', handleZoom); // Update zoom on zoom end

// //         return () => {
// //             map.off('zoomend', handleZoom); // Clean up event listener
// //         };
// //     }, [map]);

// //     return <ZoomControlledLayers zoom={zoom} />; // Render the layers with zoom level
// // };





// // const roadStyle = {
// //     color: 'white',
// //     weight: 3,
// // };

// // const buildingStyle = {
// //     color: 'black',
// //     weight: 1,
// //     fillColor: 'grey',
// //     fillOpacity: 1,
// //     opacity: 1
// // };

// // const bridgeStyle = {
// //     color: 'red',
// //     weight: 2,
// // };

// // const stationStyle = {
// //     radius: 8,
// //     fillColor: 'blue',
// //     color: '#000',
// //     weight: 1,
// //     opacity: 1,
// //     fillOpacity: 0.8,
// // };

// // const tunnelStyle = {
// //     color: 'purple',
// //     dashArray: '5, 10',
// //     weight: 2,
// // };


// // export default MallMap;




// // // const CustomCanvasLayer = ({ data, zoom }) => {
// // //     const canvasRef = useRef(null);
// // //     const map = useMap();

// // //     const drawCanvas = (map) => {
// // //         const canvas = canvasRef.current;
// // //         const ctx = canvas.getContext('2d');
// // //         const size = map.getSize();

// // //         canvas.width = size.x;
// // //         canvas.height = size.y;

// // //         ctx.clearRect(0, 0, size.x, size.y); // Clear previous drawings

// // //         // Loop through the GeoJSON data to draw points and text
// // //         data.features.forEach(feature => {
// // //             if (feature.geometry.type === 'Point') {
// // //                 const coords = L.latLng(...feature.geometry.coordinates.reverse());
// // //                 const point = map.latLngToContainerPoint(coords);

// // //                 ctx.fillStyle = 'green'; // Color for the point
// // //                 ctx.beginPath();
// // //                 ctx.arc(point.x, point.y, 5, 0, Math.PI * 2, true); // Draw a circle
// // //                 ctx.fill();

// // //                 ctx.fillStyle = 'black'; // Color for the text
// // //                 ctx.font = '12px Arial';
// // //                 ctx.fillText(feature.properties.name || 'N/A', point.x + 7, point.y); // Display text next to the point
// // //             }
// // //         });
// // //     };

// // //     useEffect(() => {
// // //         const handleResize = () => drawCanvas(map);
// // //         const handleMove = () => drawCanvas(map);
// // //         const handleZoom = () => drawCanvas(map);

// // //         map.on('resize', handleResize);
// // //         map.on('move', handleMove);
// // //         map.on('zoomend', handleZoom);

// // //         drawCanvas(map); // Initial draw

// // //         return () => {
// // //             map.off('resize', handleResize);
// // //             map.off('move', handleMove);
// // //             map.off('zoomend', handleZoom);
// // //         };
// // //     }, [map, data]);

// // //     return (
// // //         <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
// // //     );
// // // };

// // // const MallMap = () => {
// // //     const [zoom, setZoom] = useState(15);

// // //     const mapRef = useRef();
// // //     console.log(amenityPoints)

// // //     return (
// // //         <MapContainer
// // //             center={[28.5665, 77.3182]}
// // //             zoom={zoom}
// // //             style={{ height: '100vh', width: '100%' }}
// // //             whenCreated={mapInstance => { mapRef.current = mapInstance; }} // Store map instance
// // //         >
// // //             {/* Roads Layer always visible */}
// // //             <GeoJSON data={roads} style={roadStyle} />

// // //             {/* Custom Canvas Layer for Buildings and Amenity Points */}
// // //             <CustomCanvasLayer data={{ features: [...buildings.features, ...amenityPoints.features] }} zoom={zoom} />
// // //         </MapContainer>
// // //     );
// // // };





// import React, { useEffect } from 'react';
// import { MapContainer, TileLayer, useMap } from 'react-leaflet';
// import * as L from 'leaflet';
// import 'leaflet-indoor'; // Indoor3D plugin

// import buildingData from '../data/buildingData.json'; // Your building data
// import roadsData from '../data/roads.json';
// import MovingPerson from './MovingPerson'; // Person following path

// const IndoorMap = () => {
//     const map = useMap();

//     useEffect(() => {
//         const indoorLayer = new L.Indoor(buildingData, {
//             getLevel: (feature) => feature.properties.level, // Handles levels of the building
//             onEachFeature: (feature, layer) => {
//                 const { name } = feature.properties;
//                 if (name) {
//                     layer.bindTooltip(name, { permanent: true }); // Show names as labels
//                 }
//             },
//         });

//         indoorLayer.addTo(map); // Add the indoor map to the Leaflet map
//         map.fitBounds(indoorLayer.getBounds()); // Adjust the map to fit the building

//         // Optional: Add event listeners to handle level switching
//         indoorLayer.on('levelschange', (e) => {
//             console.log(`Switched to level: ${e.level}`);
//         });

//         return () => {
//             map.removeLayer(indoorLayer); // Cleanup on unmount
//         };
//     }, [map]);

//     return null; // No direct render needed as it's handled by Leaflet
// };

// const MapWithMovingPerson = () => {
//     const shortestPath = [
//         [77.3182453, 28.5666774], // Example path from one shop to another
//         [77.3183699, 28.5659676],
//         [77.3187236, 28.5660155],
//         [77.3185991, 28.5667253],
//     ];

//     return (
//         <MapContainer
//             center={[28.5665, 77.3182]}
//             zoom={18}
//             style={{ height: '100vh', width: '100%' }}
//         >
//             <TileLayer
                
                
//             />

//             <IndoorMap /> {/* Load the indoor map */}
//             <MovingPerson path={shortestPath} /> {/* Animate the person along the path */}
//         </MapContainer>
//     );
// };

// export default MapWithMovingPerson;
