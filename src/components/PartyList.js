import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  CircularProgress, 
  Box,
  Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { endPoint, headers } from '../data/utils';


function PartyList({ onPartySelect, activeStep }) {
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
    //setActiveStep(0);
    setExpanded(false);
  };
  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleStepperReset = () => {
    onPartySelect(null);
    setSelectedParty(null);
    setExpanded(true); // Show the party list
  };
  // const steps = ['Party', 'Farm', 'Field']; 
  return (
    <>
    { activeStep === null &&
     <Accordion expanded={expanded} onChange={handleToggleExpand}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">List of Parties</Typography>
        </AccordionSummary>
        <AccordionDetails>
        {loading ? (
        <CircularProgress /> // Display a loader while loading data
        ) : (
          parties &&
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
      }
      {selectedParty && (
        <>
        <Box component={"span"} boxShadow={4} borderRadius={2} margin={2} padding={2}>
          Party({selectedParty.name})
          <Button onClick={handleStepperReset}>X</Button>
        </Box>
        </>
      )}
    </>
  );
}

export default PartyList;
