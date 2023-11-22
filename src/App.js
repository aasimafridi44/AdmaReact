import React, { useState } from 'react';
import PartyList from './components/PartyList';
import FarmList from './components/FarmList'
import FieldList from './components/FieldList'
import { ToastContainer } from 'react-toastify';
import MapLeaflet from './components/MapLeaflet';
import { Box,Container, Grid, Stepper,Step,StepLabel } from '@mui/material';
import { GetSatelliteImageByBid } from './components/GetBoundaryImage'
import { GetBoundaryDetails } from './components/GetBoundary'
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
    GetBoundaryDetails(selectedParty,field)
    .then((response) => {
      setLoading(false);
      // Handle the responses here
      let coordinatesData = response.map((response) => {
        return {
          'boundaryId': response?.data?.Data?.Id,
          'geometry': response?.data?.Data?.Geometry?.Coordinates,
          'partyId': response?.data?.Data?.PartyId,
          'parentId': response?.data?.Data?.ParentId,
          'type': response?.data?.Data?.Geometry?.Type
        }
      });
      setPolygonData(coordinatesData);
      if(coordinatesData.length > 0) {
        let sImage = GetSatelliteImageByBid(selectedParty, coordinatesData[0]?.boundaryId).then((res) =>{
          sImage = res;
          if(sImage !== ''){
            SetSatelliteImage(sImage)
          }
        })
      }
                   
    })
    .catch((error) => {
      setLoading(false);
      console.error('Error fetching boundary cords data:', error);
    });
  }
  };

  return (
    <>
      <ToastContainer />
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
        <Grid item xs={12} style={{border:'2px'}}>
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
        </Grid>
      </Grid>
      <Container>
        
      </Container>
      
    </>
  );
}

export default App;
