import React, { useState } from 'react';

const UploadMap = ({ onMapLoad }) => {
    const [error, setError] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const json = JSON.parse(event.target.result);
                    console.log(JSON.stringify(json));
                    onMapLoad(JSON.stringify(json)); // Pass map data to the parent component
                } catch (err) {
                    setError('Invalid JSON file.');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div>
            <input type="file" accept=".json" onChange={handleFileUpload} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default UploadMap;
