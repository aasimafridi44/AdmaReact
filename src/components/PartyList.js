import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Box, CircularProgress } from '@mui/material';
import { endPoint, headers } from '../data/utils';


function PartyList({ onPartySelect }) {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParty, setSelectedParty] = useState(null);

  useEffect(() => {
    axios.get(endPoint+'/parties?api-version=2022-11-01-preview', { headers })
    .then((response) => {
      setParties(response.data.value);
      setLoading(false); // Set loading to false once data is fetched
    })
    .catch((error) => {
      console.error('Error fetching party data:', error);
      setLoading(false); // Set loading to false in case of an error
    });        
  }, []);

  const handlePartyClick = (party) => {
    setSelectedParty(party);
    onPartySelect(party);
  };

  return (
    <>
      <Typography variant="h5">
        List of Parties
      </Typography>
      {loading ? (
        <CircularProgress /> // Display a loader while loading data
      ) : (
        <List>
          {parties.map((party) => (
              <Box
                  key={party.id}
                  borderRadius={4}
                  p={0}
                  m={0}
                  onClick = {() =>  handlePartyClick(party)}
                  style = {{ background: selectedParty === party ? 'lightblue' : 'white' }}
              >
              <ListItem>
                <ListItemText primary={party.name} secondary={party.date} style={{ cursor: 'pointer' }} />
              </ListItem>
            </Box>
          ))}
        </List>
      )}
    </>
  );
}

export default PartyList;
