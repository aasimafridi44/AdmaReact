import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, Polygon, LoadScript } from "@react-google-maps/api";

const MapComponent = ({ onPolygonComplete, apiKey }) => {
  const [path, setPath] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawingInProgress, setDrawingInProgress] = useState(false);
  const hasLoaded = useRef(false);

  const startDrawing = () => {
    setDrawingInProgress(true);
    setPath([]);
  };

  const finishDrawing = () => {
    if (drawingInProgress) {
      setDrawingInProgress(false);
      setPolygons([...polygons, path]);
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
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        zoom={10}
        center={{ lat: -3.745, lng: -38.523 }}
        onClick={handleMapClick}
        onDblClick={handleDoubleClick}
      >
        {polygons.map((polygon, index) => (
          <Polygon key={index} path={polygon} />
        ))}
        {drawingInProgress && path.length > 0 && (
          <Polygon path={path} />
        )}
      </GoogleMap>

      <button onClick={toggleDrawingMode}>
        {drawingMode ? "Finish Drawing" : "Start Drawing"}
      </button>
    </LoadScript>
  );
};

export default MapComponent;
