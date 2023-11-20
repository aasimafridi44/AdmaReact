import React, { useState } from 'react';
import PartyList from './components/PartyList';
import FarmList from './components/FarmList'
import FieldList from './components/FieldList'
import axios from 'axios';
import { endPoint, headers} from './data/utils';
import { ToastContainer } from 'react-toastify';
import MapLeaflet from './components/MapLeaflet';
import { Box,Container, Grid, Stepper,Step,StepLabel } from '@mui/material';
import { GetSatelliteImageByBid } from './components/GetBoundaryImage'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [polygonData, setPolygonData] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(null);
  const [satelliteImage, SetSatelliteImage] = useState('')

  const steps = ['Party', 'Farm', 'Field'];

  const handlePartySelect = (party) => {
    setSelectedParty(party);
    setSelectedFarm(null); // Clear selected farm when a new party is selected
    setSelectedField(null);
    setActiveStep(party == null ? null : 0);
  };

  const handleFarmSelect = (farm) => {
    setSelectedFarm(farm);
    setSelectedField(null);
    setActiveStep(1);
  };

  const handleFieldSelect = (field) => {
    setSelectedField(field);
    setPolygonData([]);
    setActiveStep(field == null ? 1 : 2);
  
    if(field) {
    axios.get(endPoint+ '/parties/'+ selectedParty.Id +'/boundaries?api-version=2023-06-01-preview', { headers })
    .then((response) => {
       setLoading(false);
       const result = response.data.value;
       const boundariesData = result.filter((boundary) => boundary.parentId === field.Id).map((boundary) => boundary.id);
       if(boundariesData.length > 0) {
          // Create an array of Axios request promises
          const requestPromises = boundariesData.map((id) => {
            return axios.get(`${endPoint}/parties/${selectedParty.Id}/boundaries/${id}?api-version=2023-06-01-preview`, { headers });
          });

          // Use axios.all() to make multiple requests in parallel
          axios.all(requestPromises)
          .then((responses) => {
            setLoading(false);
            // Handle the responses here
            let coordinatesData = responses.map((response) => {
              return {
                'boundaryId': response?.data?.id,
                'geometry': response?.data?.geometry?.coordinates,
                'partyId': response?.data?.partyId,
                'parentId': response?.data?.parentId,
                'type': response?.data?.geometry?.type
              }
            });
            
           
            if(coordinatesData.length > 0) {
              let sImage = GetSatelliteImageByBid(selectedParty, coordinatesData[0]?.boundaryId).then((res) =>{
                sImage = res;
                console.log('bid=', sImage, 'res', res)
                if(sImage !== ''){
                  console.log('comggg=', sImage)
                  SetSatelliteImage(sImage)
                }
            })
              
            }
            setPolygonData(coordinatesData);
          })
          .catch((error) => {
            setLoading(false);
            // Handle any errors that occurred during the requests
            console.error('One or more requests failed:', error);
          });
       }        
    })
    .catch((error) => {
      setLoading(false);
      console.error('Error fetching party data:', error);
    });
  }
  };

  return (
    <>
      <ToastContainer />
      <Grid container spacing={2}>
        <Grid item xs={4}>
        <Box margin={3}>
          <Stepper activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
          </Stepper>
        </Box>
        {<PartyList onPartySelect={handlePartySelect} activeStep={activeStep} />}
        {selectedParty && <FarmList selectedParty={selectedParty} farms={farms} onFarmSelect={handleFarmSelect} />}
        {selectedFarm && <FieldList selectedParty={selectedParty} selectedFarm={selectedFarm} onFieldSelect={handleFieldSelect} />}
        
        </Grid>
        <Grid item xs={8}>
          {selectedField && polygonData && (
            <>
            <MapLeaflet 
              boundariesData={polygonData} 
              selectedParty={selectedParty} 
              selectedField={selectedField} 
              getBoundaryHandler={handleFieldSelect} 
              satelliteImage={satelliteImage}  
              />
            </>
          )}
          {!selectedField &&  (
            <>
            <MapLeaflet boundariesData={[]} selectedParty={{}} selectedField={{}} getBoundaryHandler={{}} />
            </>
          )}
        </Grid>
      </Grid>
      <Container>
        
      </Container>
      
    </>
  );
}

export default App;
