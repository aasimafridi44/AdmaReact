import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails, Typography, CircularProgress, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { endPoint, headers } from '../data/utils';


function PartyList({ onPartySelect }) {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParty, setSelectedParty] = useState(null);
  const [expanded, setExpanded] = useState(true);

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
    onPartySelect(party);
    setSelectedParty(party);
    setExpanded(!expanded);
  };
  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <>
     <Accordion expanded={expanded} onChange={handleToggleExpand}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">List of Parties</Typography>
        </AccordionSummary>
        <AccordionDetails>
        {loading ? (
        <CircularProgress /> // Display a loader while loading data
        ) : (
          parties.map((party) => (
              
            <Box 
               key={party.id}
               onClick={() => handlePartyClick(party)}
               padding={1}
               border={0}
               borderRadius={4}
              >
                <Typography style={{ cursor: 'pointer',  background: selectedParty === party ? 'lightblue' : 'white' }}>{party.name}</Typography>
              </Box>
        ))
        )
        }
        </AccordionDetails>
     </Accordion>
    </>
  );
}

export default PartyList;
