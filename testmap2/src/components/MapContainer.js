import React, { useEffect, useState } from 'react';
import { MapContainer, Polyline, Marker, Tooltip } from 'react-leaflet';
import UploadMap from './UploadMap';
import MovingPerson from './MovingPerson';
import { dijkstra } from '../utils/graphUtils';

const MallMap = () => {
    const [mapData, setMapData] = useState({
        "nodes": [
            { "id": "A", "name": "Entrance", "coordinates": [0, 0] },
            { "id": "B", "name": "Clothing Store", "coordinates": [0, 10] }
        ],
        "paths": [
            { "coordinates": [[0, 0], [0, 10]] }
        ],
        "graph": {
            "A": { "B": 1 },
            "B": { "A": 1 }
        }
    }
); // Store the uploaded map data

    const handleMapLoad = (data) => {
        // setMapData(JSON.parse(data)); // Load uploaded map JSON
        console.log(JSON.parse(data))
    };
    useEffect(()=>{

    },[mapData])

    return (
        <div>
            <UploadMap onMapLoad={handleMapLoad} />
            {mapData && (
                <MapContainer
                    center={[0, 0]} // Adjust based on your non-geographical coordinates
                    zoom={15}
                    style={{ height: '100vh', width: '100%' }}
                >
                    {/* Render paths */}
                    {mapData.paths.map((path, index) => (
                        <Polyline key={index} positions={path.coordinates} color="white" />
                    ))}

                    {/* Render nodes with labels */}
                    {mapData.nodes.map((node) => (
                        <Marker key={node.id} position={node.coordinates}>
                            <Tooltip permanent>{node.name}</Tooltip>
                        </Marker>
                    ))}

                    {/* Example: Moving person */}
                    <MovingPerson path={dijkstra(mapData.graph, 'A', 'B')} />
                </MapContainer>
            )}
        </div>
    );
};

export default MallMap;
