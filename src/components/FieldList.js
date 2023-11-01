// FieldList.js

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { endPoint, headers } from '../data/utils';

function FieldList({ selectedParty, selectedFarm, onFieldSelect }) {
  const [fieldsData, setfieldsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState(null);
  const [expanded, setExpanded] = useState(true);


  useEffect(() => {  
    axios.get(`${endPoint}/parties/${selectedParty.id}/fields/?api-version=2022-11-01-preview`, { headers })
    .then((response) => {
      // console.log('rs', response)
      const result = response.data.value; 
      const selectedFieldId = result.filter((field) => field.farmId === selectedFarm.id)
      setfieldsData(selectedFieldId);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching field data:', error);
      setLoading(false); // Set loading to false once data is fetched
    });        
  }, [selectedFarm]);

  const handleFieldClick = (field, selectedFarm) => {
    setSelectedField(field);
    onFieldSelect(field);
    setExpanded(!expanded);
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  //const filteredFields = fieldsData.filter((field) => field.partyId === selectedParty.id);

  return (
    <Accordion expanded={expanded} onChange={handleToggleExpand}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          List of Fields for {selectedFarm.name}
        </Typography>
      </AccordionSummary>
      { loading ? (
        <CircularProgress /> // Display a loader while loading data
      ) : 
        fieldsData.map((field) => (
          <Box 
                key={field.id}
                padding={1}
                border={0}
                onClick={() => handleFieldClick(field, selectedFarm)}
                style={{background: selectedField === field ? 'lightblue' : 'white' ,  cursor: 'pointer' }}
            >
            <Typography style={{ cursor: 'pointer',  background: selectedField === field  ? 'lightblue' : 'white' }}>{field.name}</Typography>
          </Box>
        ))
      
      }
    </Accordion>
  );
}

export default FieldList;
