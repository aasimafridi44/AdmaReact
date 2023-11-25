import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css'
import '../App.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { ToastContainer, toast } from 'react-toastify';
import { CircularProgress, Typography } from '@mui/material'
import EditControlFC from './EditControlFC';
import { convertToGeoJSON, compareTwoArray } from '../data/utils'
import { GetBoundaryDetails, CreateBoundary } from './GetBoundary'
import { DeleteSatelliteImageByJob } from './GetBoundaryImage'


function MapLeaflet({boundariesData, selectedParty, selectedField, getBoundaryHandler, satelliteImage, handleLoadImage}) {
  console.log('boundariesData pre', boundariesData)
  const geoCollection = convertToGeoJSON(boundariesData)
  console.log('boundariesData after', geoCollection)
  const [geojson, setGeojson] = React.useState(geoCollection);
  const [loading, setLoading] = React.useState(true);
  const [previousCords, setPreviousCords] = React.useState(geoCollection)

  useEffect(() => {
    const createGeoJSON = () => {
      const geoCollectionData = convertToGeoJSON(boundariesData);
      
      setGeojson(geoCollectionData);
      setPreviousCords(geoCollectionData);
      setLoading(false);
      console.log('use effect coming', geojson)
      console.log('use effect coming previousCords', previousCords)
    };

    createGeoJSON();
  }, [boundariesData]);

  const handleBoundaryDelete = (actionType, selectedParty, boundaryId) => {
    if(actionType === 'draw:deleted'){
      setLoading(true);
      DeleteSatelliteImageByJob(selectedParty, boundaryId)
      .then((res => {
        
      }))
      setGeojson(convertToGeoJSON([]))
      setLoading(false);
    }
  }

  const createBoundaries = React.useCallback((coords, actionType, isNewBoundary = undefined) => {
    try {
      console.log(' coming', geojson)
      console.log(' coming previousCords', previousCords)
      console.log('two array', coords.features, previousCords)
      //setLoading(true);
      
      //compareTwoArray()
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
           
            return {}
            //Get Boundary id
            GetBoundaryDetails(selectedParty, selectedField).then((boundaryDetails)=> {
              const cascadeDelJobParams = {}
              if(boundaryDetails.length > 0) {
                boundaryDetails.map((res) => {
                  
                  if(res.data.Data.Id !== '') {
                    const bid = res.data.Data.Id
                    DeleteSatelliteImageByJob(selectedParty.Id, bid)
                    .then((response) => {
                        //fetchDataWithRetries(`${endPoint}/boundaries/cascade-delete/${response.Id}?api-version=2023-06-01-preview`, 0, headers)
                        //  .then((jobResponse) => {
                            
                          //  if(jobResponse.toLowerCase() === 'Succeeded'.toLowerCase()) {
                              
                          //}
                         // })
                          
                        })
                        .catch(error => {
                          console.error('There was an error!', error);
                    });
                    CreateBoundary(selectedParty, boundariesId, selectedField, items.geometry.type, items.geometry.coordinates)
                      .then((response) => {
                        console.log('create api res out', response)
                        // Show a success toast notification
                        if(response.status === 200) {
                          console.log('create api res', response)
                          const setProperties = {
                            'boundaryId': response.data.Data.Id,
                            'partyId': selectedParty.Id,
                            'parentId': selectedField.Id,
                            'type': response.data.Data.Geometry.Type,
                            'mode': ''
                          }
                          let geoCords = []
                          geoCords.push(response.data.Data);
                          console.log('response of create', geoCords)
                          geoCords = convertToGeoJSON(geoCords, 'create')
                          console.log('converted of res-', geoCords)
                          geoCords.features[0].properties = {...setProperties}
                          console.log('properties of res-', geoCords)

                          setGeojson(geoCords);
                          
                          toast.success(`Data successfully updated! for ${response.data.Data.Id}`, {
                          position: 'top-right',
                          autoClose: 3000, // Auto-close the toast after 3 seconds
                        });
                        setLoading(false);
                        handleLoadImage(selectedParty, response.data.Data.Id);
                      }
                      })
                      .catch(error => {
                        console.error('There was an error!', error);
                      })
                  }
                })
              }
              
            });
              } else {
                CreateBoundary(selectedParty, boundariesId, selectedField, items.geometry.type, items.geometry.coordinates)
                .then((response) => {
                  console.log('create api res out', response)
                  setLoading(true);
                  // Show a success toast notification
                  if(response.status === 200) {
                  
                    const setProperties = {
                      'boundaryId': response.data.Data.Id,
                      'partyId': selectedParty.Id,
                      'parentId': selectedField.Id,
                      'type': response.data.Data.Geometry.Type,
                      'mode': ''
                    }
                    let geoCords = []
                    geoCords.push(response.data.Data);
                    console.log('response of create', geoCords)
                    geoCords = convertToGeoJSON(geoCords, 'create')
                    console.log('converted of res-', geoCords)
                    geoCords.features[0].properties = {...setProperties}
                    console.log('properties of res-', geoCords)

                    setGeojson(geoCords);
                    
                    toast.success(`Data successfully created! for ${response.data.Data.Id}`, {
                    position: 'top-right',
                    autoClose: 3000, // Auto-close the toast after 3 seconds
                  });
                  setLoading(false);
                  handleLoadImage(selectedParty, response.data.Data.Id);
                    
                  }
                })
                .catch(error => {
                  setLoading(false);
                  console.error('There was an error!', error);
                })
              }
        });
      }      
    } catch(error) {

    }
  },[geojson])

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
        {
          console.log(' coming render', geojson, previousCords)
          
        }
        <MapContainer
          center={[-3.909050573693678, -39.13905835799129]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <EditControlFC 
            geojson={geojson} 
            setGeojson={setGeojson} 
            onBoundarySave={createBoundaries}
            satelliteImage={satelliteImage}
            onBoundaryDelete={handleBoundaryDelete} 
            handleLoadImage={handleLoadImage}  
            />
        </MapContainer>
      </div>
    </div>
    )
        )}
    </>
  );
}

export default MapLeaflet;