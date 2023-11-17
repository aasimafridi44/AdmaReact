import React, {useState} from 'react';
import * as L from 'leaflet';
import { FeatureGroup } from 'react-leaflet';
import  EditControl  from './EditControl';


export default function EditControlFC({ geojson, setGeojson, onBoundarySave }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current?.getLayers().length === 0 && geojson) {
      L.geoJSON(geojson).eachLayer((layer) => {
        if (
          layer instanceof L.Polyline ||
          layer instanceof L.Polygon ||
          layer instanceof L.Marker
        ) {
          if (layer?.feature?.properties.radius && ref.current) {
            new L.Circle(layer.feature.geometry.coordinates.slice().reverse(), {
              radius: layer.feature?.properties.radius,
            }).addTo(ref.current);
          } else {
            ref.current?.addLayer(layer);
          }
        }
      });
    }
  }, [geojson]);

  const handleChange = (e) => {
    const geo = ref.current?.toGeoJSON();
    onBoundarySave(geo, e.type, e.layerType)
    if (geo?.type === 'FeatureCollection') {
      //setGeojson(geo);
    }
  };

  return (
    <FeatureGroup ref={ref}>
      <EditControl
        position="topright"
        onEdited={handleChange}
        onCreated={handleChange}
        onDeleted={handleChange}
        draw={{
          rectangle: false,
          circle: true,
          polyline: true,
          polygon: true,
          marker: false,
          circlemarker: false,
        }}
      />
    </FeatureGroup>
  );
}
