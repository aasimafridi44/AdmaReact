import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { endPoint, headers } from '../data/token';


function PartyList({ onPartySelect }) {
  const [parties, setParties] = useState([]);

  useEffect(() => {
    axios.get(endPoint+'/parties?api-version=2022-11-01-preview', { headers })
    .then((response) => {
      setParties(response.data.value);
    })
    .catch((error) => {
      console.error('Error fetching party data:', error);
    });        
  }, []);

  return (
    <>
      <Typography variant="h5">
        List of Parties
      </Typography>
      <List>
        {parties.map((party) => (
            <Box
                key={party.id}
                borderRadius={4}
                p={0}
                m={0}
                onClick={() => onPartySelect(party)
                }
            >
            <ListItem>
              <ListItemText primary={party.name} secondary={party.date} style={{ cursor: 'pointer' }} />
            </ListItem>
          </Box>
        ))}
      </List>
    </>
  );
}

export default PartyList;
