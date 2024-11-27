import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, useMapEvents, Popup, TileLayer, ImageOverlay, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { dijkstra } from './Dijkstra';
import mapImg from './mapPlan.svg';
import { CustomAttribution } from './utility';

const IndoorMap = () => {
    const [points, setPoints] = useState([]);
    const [paths, setPaths] = useState([]);
    const [selectedPoints, setSelectedPoints] = useState([]);
    const [mode, setMode] = useState('nothing'); // Modes: 'createPoint' or 'createPath'
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
    const [display, setDisplay] = useState(true)


    const srcLocationIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/9101/9101314.png',  // Use the default location marker
        iconSize: [41, 41],  // Size of the icon
        iconAnchor: [22, 46], // Position the anchor to the bottom of the marker

    });
    const destLocationIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',  // Use the default location marker
        iconSize: [41, 41],  // Size of the icon
        iconAnchor: [22, 46], // Position the anchor to the bottom of the marker

    });

    const displaySetting = () => {
        setDisplay(!display)
    }


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
        console.log("src is ", value)
        setSrcSuggestions(
            points.filter((point) => point.name.toLowerCase().includes(value.toLowerCase()))
        );
    };

    const handleDestChange = (e) => {
        const value = e.target.value;
        setDest(value);
        console.log("dest is ", value)
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

        console.log("values passed to dij ", graph, " points  ", points, " src ", startPoint, " dest ", endPoint, "relation", relations)

        const path = dijkstra(graph, points, startPoint.id, endPoint.id, relations); // Call the Dijkstra algorithm
        console.log("path passed to dij ", path)
        if (!path || path.length <= 1) {
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

        // Initialize graph structure for each level
        points.forEach((point) => {
            if (!graphObj[point.level]) graphObj[point.level] = {};
            if (!graphObj[point.level][point.id]) graphObj[point.level][point.id] = [];
        });

        // Add intra-level connections
        paths.forEach((path) => {
            const [point1, point2] = path.points;
            const weight = parseFloat(path.weight);

            if (!graphObj[point1.level]) graphObj[point1.level] = {};
            if (!graphObj[point2.level]) graphObj[point2.level] = {};

            graphObj[point1.level][point1.id].push({ to: point2.id, weight });
            graphObj[point2.level][point2.id].push({ to: point1.id, weight });
        });

        // Add inter-level connections for stairs and lifts
        relations.forEach((relation) => {
            const point1 = points.find((p) => p.id === relation.point1);
            const point2 = points.find((p) => p.id === relation.point2);

            if (point1 && point2) {
                if (!graphObj[point1.level]) graphObj[point1.level] = {};
                if (!graphObj[point2.level]) graphObj[point2.level] = {};

                // Add fixed weight for inter-level connection
                graphObj[point1.level][point1.id].push({ to: point2.id, weight: 1 });
                graphObj[point2.level][point2.id].push({ to: point1.id, weight: 1 });
            }
        });

        setGraph(graphObj);
        console.log("Generated Graph with Inter-Level Connections:", graphObj);
        alert("Graph has been generated with inter-level connections! Check the console for details.");


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
            <div onClick={displaySetting} style={{cursor:'pointer',display:'flex',justifyContent:'end',borderBottom:'2px solid black',padding:'2px',margin:'10px'}}  >{display?'Hide dev mode':'Show dev mode'}</div>
            {display && (<>
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
                    name='Import last file'

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

            </>)}





            {generatedGraph && (
                <div style={{ display: 'flex', marginBottom: "10px", flexDirection: 'row', gap: '10px' }}>
                    <div style={{ marginBottom: "10px" }}>
                        <label style={{ fontWeight: '600' }}>Source: </label>
                        <input
                            type="text"
                            value={src}
                            onChange={handleSrcChange}
                            placeholder="Enter source point"
                            style={{ padding: '5px' }}
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
                        <label style={{ fontWeight: '600' }}>Destination: </label>
                        <input
                            type="text"
                            value={dest}
                            onChange={handleDestChange}
                            placeholder="Enter destination point"
                            style={{ padding: '5px' }}
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
                    <button style={{ marginBottom: "6px", padding: "4px 10px", borderRadius: "4px", height: '30px' }} onClick={handleFindPath}>Find Path</button>
                </div>
            )}
            {/* <div style={{ marginBottom: "10px", textAlign: "center" }}>
                <span style={{ margin: "0 10px", color: isStairShortest ? "green" : "red" }}>
                    {isStairShortest
                        ? "Green Path (Stair) -> Shortest"
                        : "Red Path (Lift) -> Shortest"}
                </span>
                <span style={{ margin: "0 10px", color: "green" }}>Green Path: Stair</span>
                <span style={{ margin: "0 10px", color: "red" }}>Red Path: Lift</span>
            </div> */}

            <div style={{ display: 'flex', flexDirection: 'row', flexFlow: 'wrap', justifyContent: 'center', margin: '2px' }} >
                {highlightedPath.map((point, index) => {
                    const currentPoint = points.find((p) => p.coordinates === point);
                    const nextPoint =
                        index < highlightedPath.length - 1
                            ? points.find((p) => p.coordinates === highlightedPath[index + 1])
                            : null;

                    // Check if there's a level change
                    if (
                        currentPoint &&
                        nextPoint &&
                        currentPoint.level !== nextPoint.level
                    ) {
                        return (
                            <div>
                                <div key={index} style={{ margin: '2px', padding: '3px', border: '2px solid black', borderRadius: '4px', borderStyle: 'dotted' }}>
                                    Use {currentPoint.type} to move to level {nextPoint.level}
                                </div>

                            </div>
                        );
                    }
                    return null;
                })}
            </div>



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

                {/* Render points for the current level, excluding "temp" points */}
                {points
                    .filter((point) => point.level === currentLevel && point.name !== "temp")
                    .map((point) => (
                        <Marker
                            key={point.id}
                            position={point.coordinates}
                            icon={L.divIcon({
                                className: "custom-icon",
                                html: `<div style="display: flex;  gap: 4px;">
                                            <div style="background-color: blue; width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;"></div>
                                            <div style="background-color: white; border-radius: 3px; padding: 2px; white-space: nowrap; color: black;">
                                            ${point.name}
                                             </div>
                                        </div>
`,
                            })}
                        >

                        </Marker>
                    ))}

                {/* Render paths only for the current level */}
                {paths
                    .filter(
                        (path) =>
                            path.points[0].level === currentLevel && path.points[1].level === currentLevel
                    )
                    .map((path) => (
                        <Polyline
                            key={path.id}
                            positions={path.points.map((p) => p.coordinates)}
                            color="red"
                        />
                    ))}



                {/* Render Stair Path (Green) */}
                {/* {pathThroughStairs.length > 1 && (
                    <Polyline
                        positions={pathThroughStairs}
                        color="green"
                        weight={5}
                    />
                )} */}

                {/* Render Lift Path (Red) */}
                {/* {pathThroughLifts.length > 1 && (
                    <Polyline
                        positions={pathThroughLifts}
                        color="red"
                        weight={5}
                    />
                )}     */}

                {/* Render the highlighted path */}
                {highlightedPath.length > 1 && (
                    <>
                        {highlightedPath.slice(1).map((point, index) => {
                            const prevPoint = highlightedPath[index];
                            const currentPoint = point;

                            // Ensure both points exist and are on the current level
                            const prev = points.find(
                                (p) => p.coordinates === prevPoint && p.level === currentLevel
                            );
                            const curr = points.find(
                                (p) => p.coordinates === currentPoint && p.level === currentLevel
                            );

                            if (prev && curr) {
                                return (
                                    <Polyline
                                        key={`highlighted-${index}`}
                                        positions={[prev.coordinates, curr.coordinates]}
                                        color="black"
                                        weight={5}
                                    />
                                );
                            }
                            return null;
                        })}

                        {/* Render tooltips for level transitions */}
                        {highlightedPath.map((point, index) => {
                            const currentPoint = points.find((p) => p.coordinates === point);
                            const nextPoint =
                                index < highlightedPath.length - 1
                                    ? points.find((p) => p.coordinates === highlightedPath[index + 1])
                                    : null;

                            // Check if there's a level change
                            if (
                                currentPoint &&
                                nextPoint &&
                                currentPoint.level !== nextPoint.level &&
                                currentPoint.level === currentLevel
                            ) {
                                return (
                                    <Marker
                                        key={`transition-${index}`}
                                        position={currentPoint.coordinates}
                                        icon={L.divIcon({
                                            className: "",
                                            html: ``,
                                        })}
                                    >
                                        <Tooltip
                                            permanent
                                        >
                                            <div style={{ backgroundColor: 'black', color: 'white', borderRadius: '4px', padding: '3px' }}>
                                                Use {currentPoint.type} to move to level {nextPoint.level}
                                            </div>
                                        </Tooltip>

                                    </Marker>
                                );
                            }
                            return null;
                        })}
                    </>
                )}

                {src && points.find((point) => point.name === src)?.level === currentLevel && (
                    <Marker
                        position={points.find((point) => point.name === src)?.coordinates}
                        icon={srcLocationIcon}
                    >
                        <Tooltip
                            permanent
                        >
                            <div style={{ color: 'green' }}  >Source</div>
                        </Tooltip>
                    </Marker>
                )}

                {dest && points.find((point) => point.name === dest)?.level === currentLevel && (
                    <Marker
                        position={points.find((point) => point.name === dest)?.coordinates}
                        icon={destLocationIcon}
                    >
                        <Tooltip
                            permanent

                        >
                            <div style={{ color: 'red' }}  >Destination</div>
                        </Tooltip>
                    </Marker>
                )}

            </MapContainer>



        </div>
    );
};

export default IndoorMap;
