import React, { useState } from 'react';
import MapComponent from './MapComponent'
import { Container } from '@mui/material';
import PartyList from './components/PartyList';
import FarmList from './components/FarmList'
import FieldList from './components/FieldList'
import partyFarmData from './data/farms.json'
import fieldsData from './data/fields.json';




function App() {
  const [polygonData, setPolygonData] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [farms, setFarms] = useState(partyFarmData);
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

  const handleFieldSelect = (field) => {
    setSelectedField(field);
  };

  const handlePolygonComplete = (data) => {
    setPolygonData(data);
  };
  
  const googleMapsApiKey = "AIzaSyADpUeiQiPTYYvsqwbVLiJWoSv0tf3fEVs";

  const sendDataToAPI = async () => {
    try {
      // Replace with your API endpoint
      console.log("Polygon data sent to the API:", polygonData);
    } catch (error) {
      console.error("Error sending data to the API:", error);
    }
  };

  return (
    <>
    <Container>
      <PartyList onPartySelect={handlePartySelect} />
      {selectedParty && <FarmList selectedParty={selectedParty} farms={farms} onFarmSelect={handleFarmSelect} />}
      {selectedFarm && <FieldList selectedFarm={selectedFarm} fields={fieldsData} onFieldSelect={handleFieldSelect} />}
      {selectedField && (
                    <div>
                      <h1>Google Map Polygon Drawing</h1>
                        <MapComponent onPolygonComplete={handlePolygonComplete} apiKey={googleMapsApiKey}  />
                      <button onClick={sendDataToAPI}>Send Data to API</button>
                    </div>
      )}
    </Container>
    </>
  );
}

export default App;
