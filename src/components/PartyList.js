import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  CircularProgress, 
  Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { headers, apiEndPoint } from '../data/utils';


function PartyList({ onPartySelect, activeStep, isExpanded }) {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParty, setSelectedParty] = useState(null);
  const [expanded, setExpanded] = useState(isExpanded);

  useEffect(() => {
    setExpanded(isExpanded)
    axios.get(`${apiEndPoint}/Party/GetAllParty`, {headers: headers})
    .then((response) => {
      setParties(response.data.Data);
      setLoading(false); // Set loading to false once data is fetched
    })
    .catch((error) => {
      console.error('Error fetching party data:', error);
      setLoading(false); // Set loading to false in case of an error
    });        
  },[activeStep, isExpanded]);

  const handlePartyClick = (party) => {
    onPartySelect(party);
    setSelectedParty(party);
    //setActiveStep(0);
    setExpanded(false);
  };
  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

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
               key={party.Id}
               onClick={() => handlePartyClick(party)}
               padding={1}
               border={0}
               borderRadius={4}
              >
                <Typography style={{ cursor: 'pointer',  background: selectedParty === party ? 'lightblue' : 'white' }}>{party.Name}</Typography>
              </Box>
        ))
        )
        }
        </AccordionDetails>
     </Accordion>
      }
    </>
  );
}

export default PartyList;
