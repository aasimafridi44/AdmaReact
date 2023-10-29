// FieldList.js

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { endPoint, headers } from '../data/token';

function FieldList({ selectedParty, selectedFarm, fields, onFieldSelect }) {
  const [fieldsData, setfieldsData] = useState([]);


  useEffect(() => {
        
    axios.get(endPoint+ '/parties/'+ selectedParty.id +'/fields?api-version=2022-11-01-preview', { headers })
    .then((response) => {
      setfieldsData(response.data.value);
    })
    .catch((error) => {
      console.error('Error fetching party data:', error);
    });        
  }, []);
  const filteredFields = fieldsData.filter((field) => field.partyId === selectedParty.id);

  return (
    <div>
      <Typography variant="h6">
        List of Fields for {selectedFarm.name}
      </Typography>
      <List>
        {filteredFields.map((field) => (
          <ListItem 
                key={field.id}
                onClick={() => onFieldSelect(field, selectedFarm)}
                style={{ cursor: 'pointer' }}
            >
            <ListItemText primary={field.name} secondary={field.area} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default FieldList;
