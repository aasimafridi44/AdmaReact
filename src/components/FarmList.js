import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography, CircularProgress, Button } from '@mui/material';
import { apiEndPoint, headers } from '../data/utils';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


function FarmList({ selectedParty, farms, onFarmSelect }) {

 const [farmsData, setFarmsData] = useState([]);
 const [loading, setLoading] = useState(true);
 const [selectedFarm, setSelectedFarm] = useState(null);
 const [expanded, setExpanded] = useState(true);


  useEffect(() => {   
    axios.get(`${apiEndPoint}/Farm/GetFarmByPartyId/${selectedParty.Id}`, { headers })
    .then((response) => {
        setFarmsData(response.data.Data);
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
        setExpanded(false);
    };

    const handleToggleExpand = () => {
      setExpanded(!expanded);
    };
    const handleStepperReset = () => {
      onFarmSelect(null);
      setSelectedFarm(null);
      setExpanded(true);
    };

    return (
      <>
      {!selectedFarm &&
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
        farmsData.map((farm) => (
              <Box 
                key={farm.id}
                onClick={() => handleFarmClick(farm)}
                padding={1}
                border={0}
                borderRadius={4}
              >
                <Typography style={{ cursor: 'pointer',  background: selectedFarm?.id === farm.id ? 'lightblue' : 'white' }}>{farm.name}</Typography>
              </Box> 
              ))
          
          }
        </AccordionDetails>
      </Accordion>
      }
      {selectedFarm && (
        <>
        <Box component={"span"} boxShadow={4} borderRadius={2} margin={2} padding={2}>
          Farm ({selectedFarm.name})
          <Button onClick={handleStepperReset}>X</Button>
        </Box>
        </>
      )}
      </>
    );
}

export default FarmList;
