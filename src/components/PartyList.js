import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText } from '@mui/material';
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
          parties.map((party, index) => (
            <List  sx={{
                bgcolor: 'background.paper', 
                cursor: 'pointer',
                paddingTop: '8px',
                paddingBottom: '0px',
                '&:hover': {
                    backgroundColor: '#f0f0f0', // Change this to your desired hover color
                },
                background: selectedParty?.Id === party?.Id ? 'lightblue' : 'white'
                }}  key={party.Id}  onClick={() => handlePartyClick(party)}>
              <ListItem alignItems="flex-start">
                <ListItemText className="MuiListItemText-multiline" primary={party.Name}
                  sx={{
                      '&.MuiListItemText-multiline': {
                        '& .MuiTypography-root': {
                          lineHeight: '15px',
                        },
                      },
                    }}
                />
              </ListItem>
              {index !== parties.length - 1 &&<Divider component="li" /> }
            </List>
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
