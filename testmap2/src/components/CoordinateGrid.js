import React from 'react';
import { useMap } from 'react-leaflet';

const CoordinateGrid = () => {
    const map = useMap();
    const bounds = map.getBounds();

    return (
        <div style={{ position: 'absolute', top: 0, left: 0 }}>
            <p>Top-Left: {bounds.getNorthWest().toString()}</p>
            <p>Bottom-Right: {bounds.getSouthEast().toString()}</p>
        </div>
    );
};

export default CoordinateGrid;
