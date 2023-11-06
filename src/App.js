import React, { useState } from 'react';
import MapComponent from './MapComponent'
import { Container,Stepper,Step,StepLabel,Box } from '@mui/material';
import PartyList from './components/PartyList';
import FarmList from './components/FarmList'
import FieldList from './components/FieldList'
import axios from 'axios';
import { endPoint, headers, convertCoordinatesToLatLngArray,  resultArray} from './data/utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [polygonData, setPolygonData] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(null);

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
    axios.get(endPoint+ '/parties/'+ selectedParty.id +'/boundaries?api-version=2023-06-01-preview', { headers })
    .then((response) => {
       setLoading(false);
       const result = response.data.value;       
       const boundariesData = result.filter((boundary) => boundary.parentId === field.id).map((boundary) => boundary.id);
       // console.log('boundariesData', field.id ,boundariesData)
      
       if(boundariesData.length > 0) {
          // Create an array of Axios request promises
          const requestPromises = boundariesData.map((id) => {
            return axios.get(`${endPoint}/parties/${selectedParty.id}/boundaries/${id}?api-version=2023-06-01-preview`, { headers });
          });

          // Use axios.all() to make multiple requests in parallel
          axios.all(requestPromises)
          .then((responses) => {
            setLoading(false);
            // Handle the responses here
            let coordinatesData = responses.map((response) => {
              return response?.data?.geometry?.coordinates
            });
            coordinatesData = convertCoordinatesToLatLngArray(coordinatesData)
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

  const handlePolygonComplete = (data) => {
    setPolygonData(data);
  };
  
  const sendDataToAPI = async () => {
    try {
      const runtimeHeaders = { ...headers }; // Create a copy of your default headers
      runtimeHeaders['Content-Type'] = 'application/merge-patch+json';
      const filterData = resultArray(polygonData)  
      const body =  {
        "parentId": selectedField.id,
        "parentType": "Field",
        "type": "string",
        "geometry": {
          "type": "Polygon",
          "coordinates": [ filterData ]
        },
        "name": "Aasim Afridi's 3rd Boundary of field2",
        "description": "Some description"
      }
      
      axios.patch(`${endPoint}/parties/${selectedParty.id}/boundaries/${selectedParty.name}${Date.now()}?api-version=2023-06-01-preview`, body,  {headers: runtimeHeaders})
      .then((response) => {
        setLoading(false);
        // Show a success toast notification
        toast.success('Data successfully created!', {
          position: 'top-right',
          autoClose: 3000, // Auto-close the toast after 3 seconds
        });
      }).catch((error) => {
        setLoading(false);
        console.error('boundaries create failed:', error);
        // Show an error toast notification
        toast.error('Failed to create data!', {
          position: 'top-right',
          autoClose: 3000,
        });
      })

    } catch (error) {
      setLoading(false);
      console.error("Error sending data to the API:", error);
    }
  };

  return (
    <>
    <ToastContainer /> 
    <Container>
      <Box margin={3}>
      <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
      </Stepper>
      </Box>
      <PartyList onPartySelect={handlePartySelect} activeStep={activeStep} />
      {selectedParty && <FarmList selectedParty={selectedParty} farms={farms} onFarmSelect={handleFarmSelect} />}
      {selectedFarm && <FieldList selectedParty={selectedParty} selectedFarm={selectedFarm} onFieldSelect={handleFieldSelect} />}
    </Container>
    {selectedField && (
                    <Box marginTop={4} width={'100%'}>
                    
                      <MapComponent onPolygonComplete={handlePolygonComplete} boundariesData = {polygonData} clickedField={selectedField} />
                      <button onClick={sendDataToAPI}>Send Data to API</button>
                    </Box>
      )}
    </>
  );
}

export default App;
