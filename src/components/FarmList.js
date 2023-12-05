import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Divider,
  List,
  ListItem,
  ListItemText, 
  Typography, 
  CircularProgress } from '@mui/material';
import { apiEndPoint, headers } from '../data/utils';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


function FarmList({ selectedParty, farms, onFarmSelect, isExpanded, activeStep }) {

 const [farmsData, setFarmsData] = useState([]);
 const [loading, setLoading] = useState(true);
 const [selectedFarm, setSelectedFarm] = useState(null);
 const [expanded, setExpanded] = useState(isExpanded);


  useEffect(() => { 
   
    axios.get(`${apiEndPoint}/Farm/GetFarmByPartyId/${selectedParty.Id}`, { headers })
    .then((response) => {
        setFarmsData(response.data.Data);
        setLoading(false); // Set loading to false once data is fetched
        setExpanded(isExpanded)
    })
    .catch((error) => {
      console.error('Error fetching party data:', error);
      setLoading(false); // Set loading to false once data is fetched
    });
    return ()=> {
      setExpanded(!expanded)
    }
  }, [selectedParty, isExpanded, activeStep, expanded]);

    const handleFarmClick = (farm) => {
      setExpanded(false);
      setSelectedFarm(farm);
      onFarmSelect(farm);  
    };

    const handleToggleExpand = () => {
      setExpanded(!expanded);
    };
    
    return (
      <>
      {activeStep === 0 &&
       <Accordion expanded={expanded} onChange={handleToggleExpand}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
            List of Farms for {selectedParty.Name}
        </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {loading ? (
          <CircularProgress /> // Display a loader while loading data
        ) : 
        farmsData.map((farm, index) => (
          <List  sx={{ 
                bgcolor: 'background.paper', 
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: '#f0f0f0', // Change this to your desired hover color
                  },
                  background: selectedFarm?.id === farm?.id ? 'lightblue' : 'white'
                }} key={farm.id} onClick={() => handleFarmClick(farm)}>
              <ListItem alignItems="flex-start">
                <ListItemText className="MuiListItemText-multiline" primary={farm.name}
                  sx={{
                      '&.MuiListItemText-multiline': {
                        '& .MuiTypography-root': {
                          lineHeight: '15px',
                        },
                      },
                    }}
                />
              </ListItem>
              {index !== farm.length - 1 &&<Divider /> }
            </List>
          ))
          }
        </AccordionDetails>
      </Accordion>
      }
      
      </>
    );
}

export default FarmList;
