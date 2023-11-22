import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css'
import '../App.css';
import axios from 'axios';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { ToastContainer, toast } from 'react-toastify';
import { CircularProgress, Typography } from '@mui/material'
import EditControlFC from './EditControlFC';
import { convertToGeoJSON, headers, endPoint } from '../data/utils'
import { fetchDataWithRetries } from './GetJobStatus'
import { GetBoundaryDetails, CreateBoundary } from './GetBoundary'
import { DeleteSatelliteImageByJob } from './GetBoundaryImage'


function MapLeaflet({boundariesData, selectedParty, selectedField, getBoundaryHandler, satelliteImage}) {
  const geoCollection = convertToGeoJSON(boundariesData)
  const [geojson, setGeojson] = React.useState(geoCollection);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const createGeoJSON = () => {
      const geoCollectionData = convertToGeoJSON(boundariesData);
      setGeojson(geoCollectionData);
      setLoading(false);
    };

    createGeoJSON();
  }, [boundariesData]);

  const createBoundaries = (coords, actionType, isNewBoundary = undefined) => {
    try {
      setLoading(true);
      //const runtimeHeaders = { ...headers }; // Create a copy of your default headers
      //runtimeHeaders['Content-Type'] = 'application/merge-patch+json';
      //Generate boundary id - PartyName + DateTime
      const boundariesId = selectedParty.Name.replace(/\s/g, '') + Date.now()
      const featureCoords = coords.features;
      if(featureCoords) {
        featureCoords.map((items) => {
          
          //Validation - Do not allow more than one boundary.
          if(featureCoords.length > 1) {
            toast.error(`You can't create more than one boundary. Kindly refresh your browser or delete new one boundary.`, {
              position: 'top-right',
              autoClose: 3000, // Auto-close the toast after 3 seconds
            });
            setLoading(false);
            return {}
          }

          //If action type: edit
          if(actionType === 'draw:edited'){
            //Get Boundary id
            GetBoundaryDetails(selectedParty, selectedField).then((boundaryDetails)=> {
              const cascadeDelJobParams = {}
              if(boundaryDetails.length > 0) {
                boundaryDetails.map((res) => {
                  
                  if(res.data.Data.Id !== '') {
                    const bid = res.data.Data.Id
                    DeleteSatelliteImageByJob(selectedParty, bid)
                    .then((response) => {
                        //fetchDataWithRetries(`${endPoint}/boundaries/cascade-delete/${response.Id}?api-version=2023-06-01-preview`, 0, headers)
                        //  .then((jobResponse) => {
                            
                          //  if(jobResponse.toLowerCase() === 'Succeeded'.toLowerCase()) {
                              CreateBoundary(selectedParty, boundariesId, selectedField, items.geometry.type, items.geometry.coordinates)
                              .then((response) => {
                                // Show a success toast notification
                                if(response.status === 200 || response.status === 201) {
                                  
                                  const setProperties = {
                                    'boundaryId': response.data.id,
                                    'partyId': selectedParty.Id,
                                    'parentId': selectedField.id,
                                    'type': '',
                                    'mode': ''
                                  }
                                  let geoCords = coords;
                                  setGeojson(geoCords);
                                  geoCords.features[0].properties = {...setProperties}
                                  //setGeojson(geoCords);
                                  toast.success(`Data successfully created! for ${response?.data?.id}`, {
                                  position: 'top-right',
                                  autoClose: 3000, // Auto-close the toast after 3 seconds
                                });
                                getBoundaryHandler(selectedField)
                              }
                              })
                              .catch(error => {
                                console.error('There was an error!', error);
                              })
                          //}
                         // })
                          
                        })
                        .catch(error => {
                          console.error('There was an error!', error);
                        });
                      }
                })
              }
              
            });
              } else {
                CreateBoundary(selectedParty, boundariesId, selectedField, items.geometry.type, items.geometry.coordinates)
                .then((response) => {
                  
                  setLoading(false);
                  // Show a success toast notification
                  if(response.status === 200 || response.status === 201) {
                  
                    const setProperties = {
                      'boundaryId': response.data.id,
                      'partyId': selectedParty.Id,
                      'parentId': selectedField.id,
                      'type': '',
                      'mode': ''
                    }
                    let geoCords = coords;
                    geoCords.features[0].properties = {...setProperties}

                    setGeojson(geoCords);
                    
                    toast.success(`Data successfully created! for ${response?.data?.id}`, {
                    position: 'top-right',
                    autoClose: 3000, // Auto-close the toast after 3 seconds
                  });
                    getBoundaryHandler(selectedField)
                    setLoading(false);
                  }
                })
                .catch(error => {
                  console.error('There was an error!', error);
                })
              }
        });
      }      
    } catch(error) {

    }
  }

  return (
    <>
    {loading ? (
      <>
        <div style={{ display: 'flex', height: '30vh',justifyContent: "center",alignItems: "center", }}>
            <CircularProgress />  
        </div>
        <Typography display='block' align='center' ><br/>{`Please wait while the boundary is updated ...`}</Typography>
      </>
        ) : (
     geojson && (
    <div style={{ display: 'flex', height: '100vh', marginTop: '20px' }}>
      <ToastContainer />
      <div style={{ width: '100%' }}>
        <MapContainer
          center={[-3.909050573693678, -39.13905835799129]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <EditControlFC geojson={geojson} setGeojson={setGeojson} onBoundarySave={createBoundaries} satelliteImage={satelliteImage} />
        </MapContainer>
      </div>
    </div>
    )
        )}
    </>
  );
}

export default MapLeaflet;