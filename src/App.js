import React, { useState, useEffect } from 'react';
import PartyList from './components/PartyList';
import FarmList from './components/FarmList'
import FieldList from './components/FieldList'
import { ToastContainer } from 'react-toastify';
import MapLeaflet from './components/MapLeaflet';
import { Box, Button, Container, Chip, Grid, Stepper,Step,StepLabel } from '@mui/material';
import { GetSatelliteImageByBid } from './components/GetBoundaryImage'
import { GetBoundaryDetails } from './components/GetBoundary'
import  CropInfo from './components/CropInfo'
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [polygonData, setPolygonData] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(null);
  const [satelliteImage, setSatelliteImage] = useState('')
  const [showImageOverlay, setShowImageOverlay] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [progressDots, setProgressDots] = useState('');

  const steps = ['Party', 'Farm', 'Field'];

  useEffect(() => {
    // Function to update progress dots
    const updateProgressDots = () => {
      setProgressDots((prevDots) => (prevDots.length === 3 ? '' : prevDots + '.'));
    };

    // Start updating progress dots every 500 milliseconds
    const intervalId = setInterval(updateProgressDots, 500);

    // Simulate a long-running task (Replace this with your actual callback)
    const simulatedCallback = () => {
      // Simulate a delay (you can replace this with your actual callback logic)
      setTimeout(() => {
        // Stop showing progress and clear the interval
        setShowProgress(false);
        clearInterval(intervalId);
      }, 3000); // Simulating a 5-second delay
    };

    // Trigger the simulated callback
    simulatedCallback();

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only once on mount


  const handlePartySelect = (party) => {
    setShowImageOverlay(false)
    setSelectedParty(party);
    setSelectedFarm(null); // Clear selected farm when a new party is selected
    setSelectedField(null);
    setActiveStep(party == null ? null : 0);
  };

  const handleFarmSelect = (farm) => {
    setShowImageOverlay(false)
    setSelectedFarm(farm);
    setSelectedField(null);
    setActiveStep(farm === null ? null: 1);
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
      if(coordinatesData.length > 0 && coordinatesData[0]?.boundaryId !== '') {
        let sImage = GetSatelliteImageByBid(selectedParty, coordinatesData[0]?.boundaryId).then((res) =>{
          sImage = res;
          if(sImage !== ''){
            setSatelliteImage(sImage)
          }
        })
      }
                   
    })
    .catch((error) => {
      setLoading(false);
      console.error('Error fetching boundary cords data:', error);
    });
  } else {
    setPolygonData([]);
    setShowImageOverlay(false)
  }
  };

  const handleLoadImage = (selectedParty, bid) => {

    let sImage = GetSatelliteImageByBid(selectedParty, bid).then((res) =>{
      sImage = res;
      if(sImage !== ''){
        setSatelliteImage(sImage)
      } else {
        setSatelliteImage('')
      }
    })
  }

  const handleShowImage = (val) => {
    setShowImageOverlay(val)
    setShowProgress(true)
  }
  const handleShowProgressImage = (val) => {
    setShowProgress(val)
  }

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
        </Grid>
        <Grid item xs={12}>
        {selectedParty && (
          <>
            <Chip label={`Party(${selectedParty.Name})`} variant="outlined" onDelete={() => handlePartySelect(null)}  />
          </>
        )}
        
        {selectedFarm && (
        <>
        <Chip label={`Farm(${selectedFarm.name})`} variant="outlined" onDelete={() => handleFarmSelect(null)} style={{margin: '0 10px'}} />
        </>
       )}
       {selectedField && (
          <>
          <Chip label={`Field(${selectedField.Name})`} variant="outlined" onDelete={() => handleFieldSelect(null)} />
          </>
        )}
      </Grid>
        <Grid item xs={3}>
        {<PartyList onPartySelect={handlePartySelect} activeStep={activeStep} isExpanded={true} />}
        {selectedParty && <FarmList selectedParty={selectedParty} farms={farms} onFarmSelect={handleFarmSelect} isExpanded={true} activeStep={activeStep}  />}
        {selectedFarm && <FieldList selectedParty={selectedParty} selectedFarm={selectedFarm} onFieldSelect={handleFieldSelect} isExpanded={true} activeStep={activeStep} />}
        {selectedField &&
            <CropInfo selectedParty={selectedParty} selectedField={selectedField} />
        }
        {selectedField && satelliteImage && 
          <>
           <Box component={"div"}  margin={2}>
            <Button variant="outlined" color="success" margin={2} onClick={() => handleShowImage(true)}>
              Click here to see Overlay on map
            </Button>
           </Box>
          {showProgress && 
          <Box component={"div"}  margin={2}>
            Please wait while satellite image getting load on map{progressDots}
          </Box>
          }
          </>
          
        }
        </Grid>
        <Grid item xs={9}>
        <>
        {selectedField && polygonData && (
            
            <MapLeaflet 
              boundariesData={polygonData} 
              selectedParty={selectedParty} 
              selectedField={selectedField} 
              getBoundaryHandler={handleFieldSelect} 
              satelliteImage={satelliteImage}
              handleLoadImage={handleLoadImage}
              control={true}
              imageOverlay={showImageOverlay}
              handleShowProgressImage={handleShowProgressImage}
              />
           
          )}
          {!selectedField  && (
            
            <MapLeaflet 
              boundariesData={[]}
              control={false}
              />
           
          )}
          </>
        </Grid>
      </Grid>
      <Container>
        
      </Container>
      
    </>
  );
}

export default App;
