// FieldList.js

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, CircularProgress } from '@mui/material';
import { endPoint, headers } from '../data/token';

function FieldList({ selectedParty, selectedFarm, onFieldSelect }) {
  const [fieldsData, setfieldsData] = useState([]);
  const [loading, setLoading] = useState(true);
 const [selectedField, setSelectedField] = useState(null);


  useEffect(() => {  
    axios.get(`${endPoint}/parties/${selectedParty.id}/fields/?api-version=2022-11-01-preview`, { headers })
    .then((response) => {
      // console.log('rs', response)
      const result = response.data.value; 
      const selectedFieldId = result.filter((field) => field.farmId === selectedFarm.id)
      setfieldsData(selectedFieldId);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching field data:', error);
      setLoading(false); // Set loading to false once data is fetched
    });        
  }, [selectedFarm]);

  const handleFieldClick = (field, selectedFarm) => {
    setSelectedField(field);
    onFieldSelect(field);
  };

  //const filteredFields = fieldsData.filter((field) => field.partyId === selectedParty.id);

  return (
    <div>
      <Typography variant="h6">
        List of Fields for {selectedFarm.name}
      </Typography>
      { loading ? (
        <CircularProgress /> // Display a loader while loading data
      ) : <List>
        {fieldsData.map((field) => (
          <ListItem 
                key={field.id}
                onClick={() => handleFieldClick(field, selectedFarm)}
                style={{background: selectedField === field ? 'lightblue' : 'white' ,  cursor: 'pointer' }}
            >
            <ListItemText primary={field.name} secondary={field.area} />
          </ListItem>
        ))}
      </List>
      }
    </div>
  );
}

export default FieldList;
