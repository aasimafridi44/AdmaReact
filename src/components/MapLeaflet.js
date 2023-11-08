// src/components/Map.js
import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CircularProgress, Button} from '@mui/material';
import { endPoint, headers } from '../data/utils'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';

const MapLeaflet = ({boundariesData, selectedField, selectedParty}) => {
  const [polygons, setPolygons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingCoords, setDrawingCoords] = useState([]);
  const [tempDrawingCoords, setTempDrawingCoords] = useState([]);

  // Initialize the state with boundariesData when it's available
  useEffect(() => {
    if (boundariesData) {
      setPolygons(boundariesData);
      setLoading(false); // Hide the loader when data is available
    }
  }, [boundariesData]);

  const toggleDrawing = () => {
    if (!isDrawing) {
      // Start drawing
      setIsDrawing(true);
      setDrawingCoords([]);
    } else {
      // Finish drawing
      setIsDrawing(false);
      drawingCoords.push(drawingCoords[0])
      setPolygons([...polygons, drawingCoords]);
      createBoundaries(drawingCoords, selectedField, selectedParty)
      setDrawingCoords([]);
    }
  };

  const createBoundaries = (coords, selectedField, selectedParty) => {
    try {
      const runtimeHeaders = { ...headers }; // Create a copy of your default headers
      runtimeHeaders['Content-Type'] = 'application/merge-patch+json';
      const body =  {
        "parentId": selectedField.id,
        "parentType": "Field",
        "type": "string",
        "geometry": {
          "type": "Polygon",
          "coordinates": [ coords ]
        },
        "name": `${selectedField.name} of boundary`,
        "description": "field boundary"
      }
      axios.patch(`${endPoint}/parties/${selectedParty.id}/boundaries/${selectedParty.name.replace(/\s/g, '')}${Date.now()}?api-version=2023-06-01-preview`, body,  {headers: runtimeHeaders})
      .then((response) => {
        setLoading(false);
        // Show a success toast notification
        toast.success('Data successfully created!', {
          position: 'top-right',
          autoClose: 3000, // Auto-close the toast after 3 seconds
        });
      }).catch((error) => {
        setLoading(false);
        console.error('boundaries create failed:', error);
        // Show an error toast notification
        toast.error('Failed to create data!', {
          position: 'top-right',
          autoClose: 3000,
        });
      })
      
    } catch(error) {

    }
  }

  const handleMapClick = (e) => {
    if (isDrawing) {
      const newCoords = [e.latlng.lat, e.latlng.lng];
      setDrawingCoords([...drawingCoords, [e.latlng.lat, e.latlng.lng]]);
      setTempDrawingCoords([...tempDrawingCoords, newCoords]);
    }
  };


  return (
    <div>
    <ToastContainer /> 
    <div style={{ position: 'relative' }}>
    {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CircularProgress />
        </div>
      )}
    <MapContainer
      center={[-3.909050573693678, -39.13905835799129]}
      zoom={14}
      style={{ width: '100%', height: '500px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      {//console.log('polygons.length ', polygons.length, polygons )
      }
      {polygons.length > 0 && polygons.map((cords, index) => (
          <Polygon 
            key={index} 
            positions={cords}
            pathOptions={{ color: '#cc9900' }} // customize the styling
            />    
      ))}
      
      {drawingCoords.length > 0 && (
            <Polygon
              positions={drawingCoords}
              pathOptions={{ color: 'green' }} // customize the styling
            />
      )}
      <DrawingHandler
            isActive={isDrawing}
            onMapClick={handleMapClick}
            drawingCoords={drawingCoords}
      />
    </MapContainer>
    </div>
    <Button variant="contained" onClick={toggleDrawing}>
        {isDrawing ? 'Finish Drawing' : 'Start Drawing'}
    </Button>
      {isDrawing && (
        <p>Click on the map to start drawing the polygon.</p>
      )}
     </div> 
  );
  
};
const DrawingHandler = ({ isActive, onMapClick, drawingCoords }) => {
  useMapEvents({
    click: (e) => {
      if (isActive) {
        onMapClick(e);
      }
    },
  });

  return null;
};

export default MapLeaflet;
