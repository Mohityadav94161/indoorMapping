import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, useMapEvents, Popup, TileLayer, ImageOverlay } from 'react-leaflet';
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
    const [currentLevel, setCurrentLevel] = useState(1);
    const [relations, setRelations] = useState([]);
    const [displayRelations, setDisplayRelations] = useState(true);





    const levelBackgrounds = {
        1: "https://data.wovn.io/ImageValue/production/5d6e1b6ab882674e3abe4710/en/9ab825e4dde6ef97a6d6ce2814822ad4/floor__img_floor_map_t1_1f_en.png",
        2: "https://data.wovn.io/ImageValue/production/5d6e1b6ab882674e3abe4710/en/72c79c46cea7fbdc876c90f57c86b1ce/floor__img_floor_map_t1_2f_en.png",
        3: "https://data.wovn.io/ImageValue/production/5d6e1b6ab882674e3abe4710/en/a16239e05d525e1b14aca4a71668b4bf/floor__img_floor_map_t1_3f_en.png",
    };
    const createRelation = () => {
        const point1 = prompt("Select the first point by its name (e.g., s1):");
        const point2 = prompt("Select the second point by its name (e.g., s2):");

        if (point1 && point2) {
            const newRelation = { point1, point2 };
            setRelations((prev) => [...prev, newRelation]);
            alert(`Relation added between ${point1} and ${point2}`);
        }
    };
    const getFilteredPoints = () =>
        points
            .filter((point) => point.id.startsWith('s') || point.id.startsWith('l'))
            .sort((a, b) => {
                // First sort by level
                if (a.level !== b.level) {
                    return a.level - b.level;
                }
                // If levels are the same, sort by name
                return a.name.localeCompare(b.name);
            });




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
        // const pointName = 'temp'
        if (!pointName) return
        const pointType = prompt("Enter the type (regular, stair, lift):").toLowerCase();
        // const pointType = 'z'
        if (!pointType) return
        if (pointName && pointType) {
            const prefix = pointType === "stair" ? "s" : pointType === "lift" ? "l" : "p";
            const level = prompt("Enter the level for this point (e.g., 1, 2, 3):");
            // const level = 1
            const newPoint = {
                id: `${prefix}-${Date.now()}`,
                name: pointName,
                coordinates,
                type: pointType,
                level: parseInt(level, 10),
            };
            setPoints((prev) => [...prev, newPoint]);
        }
    };


    const addPath = (point1, point2) => {
        if (point1.level !== point2.level) {
            alert("Creating inter-level connections for stairs or lifts!", point1, " --- ", point2);
            console.log("point1 ", point1, " point2 ", point2)
        }
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
            if (!graphObj[point.level]) graphObj[point.level] = {};
            graphObj[point.level][point.name] = [];
        });

        paths.forEach((path) => {
            const [point1, point2] = path.points;
            const weight = parseFloat(path.weight);

            if (!graphObj[point1.level]) graphObj[point1.level] = {};
            if (!graphObj[point2.level]) graphObj[point2.level] = {};

            graphObj[point1.level][point1.name].push({ to: point2.name, weight });
            graphObj[point2.level][point2.name].push({ to: point1.name, weight });
        });

        setGraph(graphObj);
        console.log("Generated Graph:", graphObj);
        alert("Graph has been generated! Check the console for details.");
        saveToFile()
        setGeneratedGraph(true); // Show inputs and button
    };


    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;

                if (mode === 'createPoint') {
                    addPoint([lat, lng]);
                } else if (mode === 'createPath' && selectedPoints.length < 2) {
                    // Find the nearest point on the same level
                    const nearestPoint = points
                        .filter((point) => point.level === currentLevel) // Filter points by current level
                        .reduce((nearest, point) => {
                            const distance = L.latLng(point.coordinates).distanceTo([lat, lng]);
                            if (distance < 10 && (!nearest || distance < nearest.distance)) {
                                return { ...point, distance };
                            }
                            return nearest;
                        }, null);

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
        [49.4285603, 8.697043], // Northeast corner (lat, lng)
    ];

    const saveToFile = () => {
        const data = { points, paths, relations };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        // Create a temporary link element
        let date = new Date()
        const link = document.createElement("a");
        link.href = url;
        link.download = `wN-graph-data-${date.toString().split('GMT')[0]}.json`;
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
                setRelations(data.relations || []);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div>
            <button style={{ margin: '2px' }} onClick={() => setMode('createPoint')}>Create Point</button>
            <button style={{ margin: '20px' }} onClick={() => setMode('createPath')}>Create Path</button>
            <button style={{ margin: '2px' }} onClick={generateGraph}>Generate Graph</button>

            <label htmlFor="file-input" style={{ marginLeft: "10px", borderRadius: '4px', cursor: "pointer", border: '1.2px solid black', borderStyle: 'dashed', padding: '10px', marginBottom: '15px' }}>
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
            <div style={{ marginBottom: "10px" }}>
                {Object.keys(levelBackgrounds).map((level) => (
                    <button
                        key={level}
                        style={{
                            margin: "5px",
                            padding: "5px 10px",
                            background: currentLevel === parseInt(level, 10) ? "blue" : "gray",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                        }}
                        onClick={() => setCurrentLevel(parseInt(level, 10))}
                    >
                        Level {level}
                    </button>
                ))}
            </div>
            <div style={{ margin: "10px 0" }}>
                <label>Select Point 1 (Stair or Lift):</label>
                <select id="point1Dropdown" style={{ minWidth: '120px', margin: '4px', padding: '4px' }}>
                    {getFilteredPoints().map((point) => (
                        <option key={point.id} value={point.name} style={{ minWidth: '120px', margin: '4px', padding: '4px' }}>
                            {point.name} (Level {point.level})
                        </option>
                    ))}
                </select>

                <label>Select Point 2 (Stair or Lift):</label>
                <select id="point2Dropdown" style={{ minWidth: '120px', margin: '4px', padding: '4px' }}>
                    {getFilteredPoints().map((point) => (
                        <option key={point.id} value={point.name} style={{ minWidth: '120px', margin: '4px', padding: '4px' }}>
                            {point.name} (Level {point.level})
                        </option>
                    ))}
                </select>

                <button
                    style={{ margin: "10px", padding: "5px 10px", borderRadius: "4px" }}
                    onClick={() => {
                        const point1 = document.getElementById("point1Dropdown").value;
                        const point2 = document.getElementById("point2Dropdown").value;
                        if (point1 && point2) {
                            const newRelation = { point1, point2 };
                            setRelations((prev) => [...prev, newRelation]);

                        }
                    }}
                >
                    Add Relation
                </button>
            </div>
            <button onClick={() => setDisplayRelations(!displayRelations)}> {displayRelations ? "Hide relation" : "Show relation"}</button>
            {displayRelations && (<div style={{ marginTop: "20px" }}>
                <h3>Stairs and Lift Relations</h3>
                {relations.length > 0 ? (
                    <ul style={{ display: 'flex', flexDirection: 'row', flexFlow: 'wrap' }}>
                        {relations.map((rel, index) => (
                            <div key={index} style={{ margin: '2px', padding: '3px', border: '1px solid grey', borderRadius: '2px', borderStyle: 'dotted' }}>
                                {rel.point1} ↔ {rel.point2}
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p>No relations added yet.</p>
                )}
            </div>
            )}




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
                                        style={{ border: '1px solid black', display: 'flex', margin: '6px', borderRadius: '3px', background: 'white', alignContent: 'center', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
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
                            <ul style={{ border: '1px solid black', borderRadius: '4px', marginTop: '10px', marginLeft: '95px', color: 'grey', position: 'fixed', zIndex: "10000", background: 'grey', minWidth: '100px', listStyleType: 'none', alignItems: 'center', padding: '0' }}>
                                {destSuggestions.map((point) => (
                                    <li
                                        key={point.id}
                                        onClick={() => {
                                            setDest(point.name);
                                            setDestSuggestions([]); // Clear dropdown
                                        }}
                                        style={{ border: '1px solid black', display: 'flex', margin: '6px', borderRadius: '3px', background: 'white', alignContent: 'center', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
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
                zoom={15.4}
                style={{ height: "80vh", width: "100%", cursor: "pointer" }}
            >
                <ImageOverlay
                    url={levelBackgrounds[currentLevel]} // Change based on the current level
                    bounds={svgBounds}
                    opacity={1.0}
                />
                <MapClickHandler />
                <CustomAttribution />
                {points
                    .filter((point) => point.level === currentLevel) // Show points only for the current level
                    .map((point) => (
                        <Marker
                            key={point.id}
                            position={point.coordinates}
                            icon={L.divIcon({
                                className: "custom-icon",
                                html: `<div style="background-color:blue; width:8px; height:8px; border-radius:50%;">${point.name},${point.level},${point.id}</div>`,
                            })}
                        />
                    ))}
                {paths
                    .filter(
                        (path) =>
                            path.points[0].level === currentLevel && path.points[1].level === currentLevel
                    ) // Show paths for the current level
                    .map((path) => (
                        <Polyline
                            key={path.id}
                            positions={path.points.map((p) => p.coordinates)}
                            color="red"
                        />
                    ))}
                {highlightedPath.length > 1 && (
                    <Polyline positions={highlightedPath} color="black" weight={5} />
                )}
            </MapContainer>
        </div>
    );
};

export default IndoorMap;
