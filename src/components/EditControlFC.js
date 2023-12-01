import React from 'react';
import * as L from 'leaflet';
import { FeatureGroup } from 'react-leaflet';
import  EditControl  from './EditControl';
import GeoTiffLayer from './GeotiffLayer'


const EditControlFC = React.memo(({ geojson, setGeojson, onBoundarySave, satelliteImage, onBoundaryDelete }) => {
  const ref = React.useRef(null);
  const [isEdit, SetIsEdit] = React.useState(false)

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
  console.log('cords bound--',geojson, geojson?.features.length)
  
  return (
    <>
    {
    <>
    
    <FeatureGroup ref={ref}>
      <EditControl
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
          circle: true,
          polyline: true,
          polygon: true,
          marker: false,
          circlemarker: false,
        }}
      />
    </FeatureGroup>
    {!isEdit && satelliteImage &&  
      <>
        <GeoTiffLayer url={satelliteImage} />
      </>  
    }
    </>
    }    
    </>
  );
});

export default EditControlFC
