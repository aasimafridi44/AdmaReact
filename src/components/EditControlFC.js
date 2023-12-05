import React, {useEffect} from 'react';
import * as L from 'leaflet';
import { FeatureGroup,  useMap } from 'react-leaflet';
import  EditControl  from './EditControl';
import GeoTiffLayer from './GeotiffLayer'


const EditControlFC = React.memo(({ geojson, setGeojson, onBoundarySave, satelliteImage, onBoundaryDelete , control, imageOverlay, handleShowProgressImage }) => {
  const ref = React.useRef(null);
  const map = useMap();
  const [isEdit, SetIsEdit] = React.useState(false)


  useEffect(() => {
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
    return() => {
      //ref.current?.removeLayer()
    }
  }, [geojson, satelliteImage]);

  useEffect(() => {
    // Set map view based on coordinates from geojson
    if (geojson?.features && geojson.features.length > 0) {
      const coordinates = geojson.features[0]?.geometry?.coordinates;
      if (coordinates) {
        const bounds = calculateCentroid(coordinates);
        map.flyTo(bounds);
        //map.flyTo([-3.9328991666666666, -38.77533916666666], 16);
      }
    }
  }, [geojson, map]);

  const calculateBounds = (coordinates) => {
    // Extract latitudes and longitudes
    const latitudes = coordinates[0].map(([lng, lat]) => lat);
    const longitudes = coordinates[0].map(([lng, lat]) => lng);

    // Calculate the bounds
    const bounds = [
      [Math.min(...latitudes), Math.min(...longitudes)],
      [Math.max(...latitudes), Math.max(...longitudes)],
    ];

    return bounds;
  };

  const calculateCentroid  = (coordinates) => {
    let [sumLat, sumLng] = [0, 0];
  
    // Calculate the sum of latitudes and longitudes
    coordinates[0].forEach(([lng, lat]) => {
      sumLat += lat;
      sumLng += lng;
    });
  
    // Calculate the centroid
    const centroid = [sumLat / coordinates[0].length, sumLng / coordinates[0].length];
  
    return centroid;
  }

  const handleChange = (e) => {
    const geo = ref.current?.toGeoJSON();
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

  const handleBoundaryDelete = (e) => {
    let cordsValue = ''
    let boundaryId, partyId
    for (const [key, value] of Object.entries(e.layers._layers)) {
      boundaryId = value.feature.properties.boundaryId;
      partyId = value.feature.properties.partyId;
    }
    onBoundaryDelete(e.type, partyId, boundaryId)
    return cordsValue
  }
  const handleBoundaryDeleteCancel = (e) => {
    SetIsEdit(false)
  }
  const handleBoundaryDeleteStart = (e) => {
    SetIsEdit(true)
  }
 // const bounds = new L.LatLngBounds([40.712216, -74.22655], [40.773941, -74.12544])
  //[[geojson?.features[0]?.geometry?.coordinates]]
  // [ [ -3.93012, -39.198528 ], [ -3.880602, -39.093907 ] ]
  //""https://tavant-my.sharepoint.com/personal/aasim_khan_tavant_com/Documents/aasim-field-8.png"
  //console.log('cords bound--',geojson, geojson?.features.length)
  
  return (
    <>

    <FeatureGroup ref={ref}>
    { control && <EditControl
        position="topright"
        onEdited={handleChange}
        onCreated={handleChange}
        onDeleted={handleBoundaryDelete}
        onEditStart={handleModifyStart}
        onEditStop={handleModifyStop}
        onDeleteStop={handleBoundaryDeleteCancel}
        onDeleteStart={handleBoundaryDeleteStart}
        draw={{
          rectangle: false,
          circle: control ? true : false,
          polyline: control ? true : false,
          polygon: control ? true : false,
          marker: false,
          circlemarker: false
        }}
      />
      }
    </FeatureGroup>
    {imageOverlay && !isEdit && satelliteImage &&  
      <>
        <GeoTiffLayer url={satelliteImage} imageOverlay={imageOverlay} handleShowProgressImage={handleShowProgressImage} />
      </> }
    </>
  );
});

export default EditControlFC
