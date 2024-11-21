import React, { useState, useEffect } from 'react';
import { MapContainer, Polygon, Polyline, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
export const findCorridorMiddleLine = (corridor) => {
    // Assuming the corridor has coordinates that form a rectangular shape (4 points in Polygon)
    console.log(corridor);
};

export const renderCorridorMiddleLines = (data, selectedFloor) => {
    const mapData = extractCorridorCoordinates(data.features, selectedFloor)
    console.log("extractCorridorCoordinates ", mapData)
    return mapData
        .map((corridor, index) => {
            // const middleLine = findCorridorMiddleLine(corridor);
            console.log("middle", corridor)
            return (
                <>
                    <Polyline
                        key={`middle-line-${index}`}
                        positions={corridor}
                        color="red" // Use a distinct color for the middle line
                        weight={2}
                    />
                    <Marker
                        position={[8.6, 49.4]}
                        icon={L.divIcon({
                            className: 'custom-icon',
                            html: `<div style="background-color:red; width:8px; height:4px;"></div>`
                        })}
                    />


                </>

            );

            return null;
        });
};

export const extractCorridorCoordinates = (data, selectedFloor) => {
    console.log("Extracting", data)
    return data
        .filter(feature => feature.properties.tags.buildingpart === "corridor" && feature.properties.relations[0].reltags.level === selectedFloor)
        .map(corridor => corridor.geometry.coordinates); // Extract coordinates for each corridor
};


// import { Polyline } from 'react-leaflet';

// Helper function to calculate points for an arc
export const calculateArcPoints = (center, radius, startAngle, endAngle, numPoints = 50) => {
    const points = [];
    const angleIncrement = (endAngle - startAngle) / numPoints;

    for (let i = 0; i <= numPoints; i++) {
        const angle = startAngle + i * angleIncrement;
        const x = center[0] + radius * Math.cos(angle);
        const y = center[1] + radius * Math.sin(angle);
        points.push([x, y]);
    }

    return points;
};
export const CustomAttribution = () => {
    const map = useMap();

    useEffect(() => {
        // Set a custom attribution or remove it
        map.attributionControl.setPrefix('<a href="">...wrongN</a>');
    }, [map]);

    return null; // This component just modifies the map, no UI rendered
};




