import React, { useState } from 'react';
import MapComponent from './MapComponent'
import { Container } from '@mui/material';
import PartyList from './components/PartyList';
import FarmList from './components/FarmList'
import FieldList from './components/FieldList'
import axios from 'axios';
import fieldsData from './data/fields.json';
import { endPoint, headers, convertCoordinatesToLatLngArray,  resultArray} from './data/token';




function App() {
  const [polygonData, setPolygonData] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  
  const handlePartySelect = (party) => {
    setSelectedParty(party);
    setSelectedFarm(null); // Clear selected farm when a new party is selected
    setSelectedField(null);
    // Fetch and set the farms for the selected party here
    // You may use Axios to fetch farm data for the selected party
  };

  const handleFarmSelect = (farm) => {
    setSelectedFarm(farm);
    setSelectedField(null);
  };

  const handleFieldSelect = (field, selectedFarm) => {
    setSelectedField(field);
    setPolygonData([]);

    axios.get(endPoint+ '/parties/'+ selectedParty.id +'/boundaries?api-version=2023-06-01-preview', { headers })
    .then((response) => {
       // setPolygonData(response);
       const result = response.data.value;       
       const boundariesData = result.filter((boundary) => boundary.parentId === field.id).map((boundary) => boundary.id);
       console.log('boundariesData', field.id ,boundariesData)
      
       if(boundariesData.length > 0) {
          // Create an array of Axios request promises
          const requestPromises = boundariesData.map((id) => {
            return axios.get(`${endPoint}/parties/${selectedParty.id}/boundaries/${id}?api-version=2023-06-01-preview`, { headers });
          });

          // Use axios.all() to make multiple requests in parallel
          axios.all(requestPromises)
          .then((responses) => {
            // Handle the responses here
            let coordinatesData = responses.map((response) => {
              return response?.data?.geometry?.coordinates
            });
            coordinatesData = convertCoordinatesToLatLngArray(coordinatesData)
            setPolygonData(coordinatesData);
          })
          .catch((error) => {
            // Handle any errors that occurred during the requests
            console.error('One or more requests failed:', error);
          });
       }        
    })
    .catch((error) => {
      console.error('Error fetching party data:', error);
    });
  };

  const handlePolygonComplete = (data) => {
    setPolygonData(data);
  };
  
  const googleMapsApiKey = "AIzaSyADpUeiQiPTYYvsqwbVLiJWoSv0tf3fEVs";

  const sendDataToAPI = async (selectedPartyid) => {
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
      }).catch((error) => {
        console.error('boundaries create failed:', error);
      })

    } catch (error) {
      console.error("Error sending data to the API:", error);
    }
  };

  return (
    <>
    <Container>
      <PartyList onPartySelect={handlePartySelect} />
      {selectedParty && <FarmList selectedParty={selectedParty} farms={farms} onFarmSelect={handleFarmSelect} />}
      {selectedFarm && <FieldList selectedParty={selectedParty} selectedFarm={selectedFarm} fields={fieldsData} onFieldSelect={handleFieldSelect} />}
      {selectedField && (
                    <div>
                      <h1>Google Map Polygon Drawing</h1>
                        <MapComponent onPolygonComplete={handlePolygonComplete} apiKey={googleMapsApiKey} boundariesData = {polygonData} />
                      <button onClick={sendDataToAPI}>Send Data to API</button>
                    </div>
      )}
    </Container>
    </>
  );
}

export default App;
