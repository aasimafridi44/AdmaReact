// FarmList.js

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, CircularProgress } from '@mui/material';
import { endPoint, headers } from '../data/utils';


function FarmList({ selectedParty, farms, onFarmSelect }) {

 const [farmsData, setFarmsData] = useState([]);
 const [loading, setLoading] = useState(true);
 const [selectedFarm, setSelectedFarm] = useState(null);


  useEffect(() => {   
    axios.get(endPoint+ '/parties/'+ selectedParty.id +'/farms?api-version=2022-11-01-preview', { headers })
    .then((response) => {
        setFarmsData(response.data.value);
        setLoading(false); // Set loading to false once data is fetched
    })
    .catch((error) => {
      console.error('Error fetching party data:', error);
      setLoading(false); // Set loading to false once data is fetched
    });        
  }, [selectedParty]);

    const handleFarmClick = (farm) => {
        setSelectedFarm(farm);
        onFarmSelect(farm);
    };

    const filteredFarms = farmsData.filter((farm) => farm.partyId === selectedParty.id);

    return (
        <div>
        <Typography variant="h6">
            List of Farms for {selectedParty.name}
        </Typography>
        {loading ? (
        <CircularProgress /> // Display a loader while loading data
      ) : <List>
            {filteredFarms.map((farm) => (
            <ListItem 
                key={farm.id}
                onClick={() => handleFarmClick(farm)}
                style={{ background: selectedFarm?.id === farm.id ? 'lightblue' : 'white' , cursor: 'pointer' }}>
                <ListItemText primary={farm.name} secondary={farm.location} />
            </ListItem>
            ))}
        </List>
        }
        </div>
    );
}

export default FarmList;
