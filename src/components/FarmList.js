// FarmList.js

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { endPoint, headers } from '../data/token';


function FarmList({ selectedParty, farms, onFarmSelect }) {

 const [farmsData, setFarmsData] = useState([]);


  useEffect(() => {   
    axios.get(endPoint+ '/parties/'+ selectedParty.id +'/farms?api-version=2022-11-01-preview', { headers })
    .then((response) => {
        setFarmsData(response.data.value);
    })
    .catch((error) => {
      console.error('Error fetching party data:', error);
    });        
  }, []);

    const filteredFarms = farmsData.filter((farm) => farm.partyId === selectedParty.id);

    return (
        <div>
        <Typography variant="h6">
            List of Farms for {selectedParty.name}
        </Typography>
        <List>
            {filteredFarms.map((farm) => (
            <ListItem 
                key={farm.id}
                onClick={() => onFarmSelect(farm)}
                style={{ cursor: 'pointer' }}>
                <ListItemText primary={farm.name} secondary={farm.location} />
            </ListItem>
            ))}
        </List>
        </div>
    );
}

export default FarmList;
