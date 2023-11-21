import React from 'react';
import * as L from 'leaflet';
import { FeatureGroup, ImageOverlay } from 'react-leaflet';
import  EditControl  from './EditControl';
import { getBoundsCords } from '../data/utils'
//import axios from 'axios';


export default function EditControlFC({ geojson, setGeojson, onBoundarySave, satelliteImage }) {
  const ref = React.useRef(null);
  const [isEdit, SetIsEdit] = React.useState(false)
  //const [settelieImage, SetSettelieImage] = React.useState('')

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
    
    SetIsEdit(false)
  }, [geojson, satelliteImage]);

  const handleChange = (e) => {
    const geo = ref.current?.toGeoJSON();   
    console.log('GeoJson', geo)
    onBoundarySave(geo, e.type, e.layerType)
    if (geo?.type === 'FeatureCollection') {
      setGeojson(geo);
    }
  };

  const handleModifyStart = () => {
    SetIsEdit(true)
  }

  const handleModifyStop = () => {
    SetIsEdit(false)
  }
 // const bounds = new L.LatLngBounds([40.712216, -74.22655], [40.773941, -74.12544])
  //[[geojson?.features[0]?.geometry?.coordinates]]
  // [ [ -3.93012, -39.198528 ], [ -3.880602, -39.093907 ] ]
  //""https://tavant-my.sharepoint.com/personal/aasim_khan_tavant_com/Documents/aasim-field-8.png"
  //console.log('cords bound', getBoundsCords(geojson?.features[0]?.geometry?.coordinates))
  const boundCords = getBoundsCords(geojson?.features[0]?.geometry?.coordinates)
  //console.log('length of boundCords ', boundCords)
  return (
    <>
    {
    <>
    
    <FeatureGroup ref={ref}>
      <EditControl
        position="topright"
        onEdited={handleChange}
        onCreated={handleChange}
        onDeleted={handleChange}
        onEditStart={handleModifyStart}
        onEditStop={handleModifyStop}
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
    {!isEdit && satelliteImage && boundCords.length>0 && 
      <>
      {console.log('satelliteImage', satelliteImage)}
      <ImageOverlay
        url={satelliteImage}
        bounds={getBoundsCords(geojson?.features[0]?.geometry?.coordinates)}
        opacity={0.7}
        zIndex={999}
    />
    </>  
    }
    </>
    }    
    </>
  );
}
