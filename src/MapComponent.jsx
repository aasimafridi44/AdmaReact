import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, Polygon } from "@react-google-maps/api";
import { polygonOptions } from './data/utils'


const MapComponent = ({ onPolygonComplete, boundariesData, clickedField }) => {
  const [path, setPath] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawingInProgress, setDrawingInProgress] = useState(false);
  const hasLoaded = useRef(false);
  const currentPath = useRef([]);

 
  // Initialize the state with boundariesData when it's available
  useEffect(() => {
    if (boundariesData) {
      setPolygons(boundariesData);
    }
  }, [boundariesData, polygons]);


  const startDrawing = () => {
    setDrawingInProgress(true);
    setPath([]);
  };

  const finishDrawing = () => {
    if (drawingInProgress) {
      setDrawingInProgress(false);
      path.push(path[0])
      setPolygons([...polygons, path]);
      currentPath.current.push(path)
      onPolygonComplete(path);
    }
  };

  // Set hasLoaded to true when the component first loads
  useEffect(() => {
    hasLoaded.current = true;
  }, []);

  const toggleDrawingMode = () => {
    if (hasLoaded.current) {
      setDrawingMode(!drawingMode);
      if (!drawingMode) {
        // Start drawing when switching to drawing mode
        startDrawing();
      } else {
        // Finish drawing when switching out of drawing mode
        finishDrawing();
      }
    }
  };

  const handleMapClick = (e) => {
    if (drawingMode) {
      // When in drawing mode, add the clicked point to the path
      const clickedLat = e.latLng.lat();
      const clickedLng = e.latLng.lng();
      const newPath = [...path];
      newPath.push({ lat: clickedLat, lng: clickedLng });
      setPath(newPath);
    }
  };

  const handleDoubleClick = () => {
    if (drawingInProgress && path.length > 2) {
      finishDrawing();
      setDrawingMode(!drawingMode);
    }
  };

  return (
    <>
      <GoogleMap
        key={clickedField.id}
        mapContainerStyle={{ width: "100%", height: "600px" }}
        zoom={14}
        center={{ lat: -3.909050573693678, lng: -39.13905835799129 }}
        onClick={handleMapClick}
        onDblClick={handleDoubleClick}
        options={{
                  mapTypeId: 'hybrid' // Set map type to 'satellite','roadmap', 'terrain', and 'hybrid'
                }}
      >
      
      
      {!drawingInProgress && polygons.length > 0 && polygons.map((requestData, index) => (
          <Polygon key={clickedField.id + index} path={requestData} options={polygonOptions} />
      ))}
        
        {drawingInProgress && path.length > 0 && (
          <Polygon path={path} />
        )}
      </GoogleMap>

      <button onClick={toggleDrawingMode}>
        {drawingMode ? "Finish Drawing" : "Start Drawing"}
      </button>
    </>
  );
};

export default MapComponent;
