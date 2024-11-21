import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, useMapEvents,Popup, TileLayer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import { dijkstra } from './Dijkstra';
import mapImg from './mapPlan.svg';
import { CustomAttribution } from './utility';

const IndoorMap = () => {
    const [points, setPoints] = useState([]);
    const [paths, setPaths] = useState([]);
    const [selectedPoints, setSelectedPoints] = useState([]);
    const [mode, setMode] = useState('createPoint'); // Modes: 'createPoint' or 'createPath'
    const [graph, setGraph] = useState({}); // Adjacency list representation
    const [src, setSrc] = useState(""); // Source point input
    const [dest, setDest] = useState(""); // Destination point input
    const [srcSuggestions, setSrcSuggestions] = useState([]); // Source dropdown suggestions
    const [destSuggestions, setDestSuggestions] = useState([]); // Destination dropdown suggestions
    const [generatedGraph, setGeneratedGraph] = useState(false); // Controls visibility
    const [highlightedPath, setHighlightedPath] = useState([]); // Stores the path to highlight
    const [currentFloor, setCurrentFloor] = useState(1);


    

    const handleSrcChange = (e) => {
        const value = e.target.value;
        setSrc(value);
        setSrcSuggestions(
            points.filter((point) => point.name.toLowerCase().includes(value.toLowerCase()))
        );
    };

    const handleDestChange = (e) => {
        const value = e.target.value;
        setDest(value);
        setDestSuggestions(
            points.filter((point) => point.name.toLowerCase().includes(value.toLowerCase()))
        );
    };

    const handleFindPath = () => {
        if (!src || !dest) {
            alert("Please select both source and destination!");
            return;
        }

        const startPoint = points.find((point) => point.name === src);
        const endPoint = points.find((point) => point.name === dest);

        if (!startPoint || !endPoint) {
            alert("Invalid source or destination!");
            return;
        }

        const path = dijkstra(graph, points, src, dest); // Call the Dijkstra algorithm
        if (path.length <= 1) {
            alert("No valid path found!");
        }
        setHighlightedPath(path); // Set the calculated path to be highlighted
    };


    const addPoint = (coordinates) => {
        const pointName = prompt("Enter a name for this point:");
        if (pointName) {
            const newPoint = {
                id: `point-${Date.now()}`,
                name: pointName,
                coordinates,
            };
            setPoints((prev) => [...prev, newPoint]);
        }
    };

    const addPath = (point1, point2) => {
        const distance = L.latLng(point1.coordinates).distanceTo(point2.coordinates);
        const newPath = {
            id: `path-${Date.now()}`,
            points: [point1, point2],
            weight: distance.toFixed(2),
        };
        setPaths((prev) => [...prev, newPath]);
    };

    const generateGraph = () => {
        const graphObj = {};

        points.forEach((point) => {
            graphObj[point.name] = [];
            console.log("point ",point)
        });

        paths.forEach((path) => {
            const [point1, point2] = path.points;
            const weight = parseFloat(path.weight);

            graphObj[point1.name].push({ to: point2.name, weight });
            graphObj[point2.name].push({ to: point1.name, weight });
        });

        setGraph(graphObj);
        saveToFile()
        console.log("Generated Graph:", graphObj);
        alert("Graph has been generated! Check the console for details.");
        setGeneratedGraph(true); // Show inputs and button
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;

                if (mode === 'createPoint') {
                    addPoint([lat, lng]);
                } else if (mode === 'createPath' && selectedPoints.length < 2) {
                    const nearestPoint = points.find(
                        (point) => L.latLng(point.coordinates).distanceTo([lat, lng]) < 10
                    );
                    if (nearestPoint) {
                        setSelectedPoints((prev) => [...prev, nearestPoint]);
                        if (selectedPoints.length === 1) {
                            addPath(selectedPoints[0], nearestPoint);
                            setSelectedPoints([]);
                        }
                    }
                }
            },
        });

        return null;
    };
    const svgBounds = [
        [49.4185603, 8.660043], // Southwest corner (lat, lng)
        [49.4285603, 8.687043], // Northeast corner (lat, lng)
    ];

    const saveToFile = () => {
        const data = { points, paths };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        // Create a temporary link element
        const link = document.createElement("a");
        link.href = url;
        link.download = "graph-data.json";
        link.click();

        // Clean up the object URL
        URL.revokeObjectURL(url);
    };
    const importFromFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = JSON.parse(e.target.result);
                setPoints(data.points || []);
                setPaths(data.paths || []);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div>
            <button style={{ margin: '2px' }} onClick={() => setMode('createPoint')}>Create Point</button>
            <button style={{margin:'20px'}} onClick={() => setMode('createPath')}>Create Path</button>
            <button style={{ margin: '2px' }} onClick={generateGraph}>Generate Graph</button>

            <label htmlFor="file-input" style={{ marginLeft: "10px",borderRadius:'4px', cursor: "pointer",border:'1.2px solid black',borderStyle:'dashed',padding:'10px',marginBottom:'15px' }}>
                Import Map from file: 
            </label>
            <input
                type="file"
                accept=".json"
                onChange={importFromFile}
                style={{ display: "none" }}
                id="file-input"
                name='Impprt last file'
                
            />
            
            {generatedGraph && (
                <div style={{ marginBottom: "10px" }}>
                    <div style={{ marginBottom: "10px" }}>
                        <label>Source: </label>
                        <input
                            type="text"
                            value={src}
                            onChange={handleSrcChange}
                            placeholder="Enter source point"
                        />
                        {srcSuggestions.length > 0 && (
                            <ul style={{ border: '1px solid black', borderRadius: '4px', marginTop: '10px', marginLeft: '95px', color: 'grey', position: 'fixed', zIndex: "10000", background: 'grey', minWidth: '100px', listStyleType: 'none', alignItems: 'center', padding: '0' }}>
                                {srcSuggestions.map((point) => (
                                    <li
                                        key={point.id}
                                        onClick={() => {
                                            setSrc(point.name);
                                            setSrcSuggestions([]); // Clear dropdown
                                        }}
                                        style={{ border: '1px solid black', display: 'flex', margin: '6px', borderRadius: '3px', background: 'white', alignContent: 'center', alignItems: 'center', justifyContent: 'center',cursor:'pointer' }}
                                    >
                                        {point.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <label>Destination: </label>
                        <input
                            type="text"
                            value={dest}
                            onChange={handleDestChange}
                            placeholder="Enter destination point"
                        />
                        {destSuggestions.length > 0 && (
                            <ul style={{ border: '1px solid black', borderRadius: '4px',marginTop: '10px',marginLeft:'95px', color: 'grey', position: 'fixed', zIndex: "10000", background: 'grey', minWidth: '100px', listStyleType: 'none',alignItems:'center',padding:'0' }}>
                                {destSuggestions.map((point) => (
                                    <li
                                        key={point.id}
                                        onClick={() => {
                                            setDest(point.name);
                                            setDestSuggestions([]); // Clear dropdown
                                        }}
                                        style={{border:'1px solid black',display:'flex',margin:'6px',borderRadius:'3px',background:'white',alignContent:'center',alignItems:'center',justifyContent:'center',cursor:'pointer'}}
                                    >
                                        {point.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button onClick={handleFindPath}>Find Path</button>
                </div>
            )}
           

            <MapContainer
                center={[49.4185603, 8.677043]}
                zoom={18}
                opacity={0}
                style={{ height: "80vh", width: "100%",cursor: "pointer" }}
            >
                <ImageOverlay
                    url={""}
                    bounds={svgBounds}
                    opacity={1.0} // Adjust opacity if needed
                />
                <MapClickHandler />
                <CustomAttribution />
                {points.map((point) => (
                    <Marker
                        key={point.id}
                        position={point.coordinates}
                        icon={L.divIcon({
                            className: 'custom-icon',
                            html: `<div style="background-color:blue; width:8px; height:8px; border-radius:50%;">${point.name}</div>`,
                        })}
                    >
                         
                    </Marker>
                ))}
                {paths.map((path) => (
                    <Polyline
                        key={path.id}
                        positions={path.points.map((p) => p.coordinates)}
                        color="red"
                    />
                ))} 
                {/* Render highlighted path*/}
                {highlightedPath.length > 1 && (
                    <Polyline
                        positions={highlightedPath}
                        color="black"
                        weight={5}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default IndoorMap;
