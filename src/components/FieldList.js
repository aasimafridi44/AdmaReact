import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Accordion, AccordionSummary,  Box, Typography, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { apiEndPoint, headers } from '../data/utils';

function FieldList({ selectedParty, selectedFarm, onFieldSelect, isExpanded, activeStep}) {
  const [fieldsData, setFieldsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState(null);
  const [expanded, setExpanded] = useState(isExpanded);


  useEffect(() => {  
    axios.get(`${apiEndPoint}/Field/GetFieldByPartyAndFarmId/${selectedParty.Id}/${selectedFarm.id}`, { headers })
    .then((response) => {
      const fieldData = response.data.Data; 
      //const selectedFieldId = result.filter((field) => field.FarmId === selectedFarm.id)
      setFieldsData(fieldData);
      setExpanded(isExpanded)
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching field data:', error);
      setLoading(false); // Set loading to false once data is fetched
    });
    return ()=> {
      setExpanded(!expanded)
    }       
  }, [expanded, isExpanded, selectedFarm, selectedParty.Id]);

  const handleFieldClick = (field, selectedFarm) => {
    setSelectedField(field);
    onFieldSelect(field);
    setExpanded(false);
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <>
    {activeStep === 1  && 
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
                key={field.Id}
                padding={1}
                border={0}
                onClick={() => handleFieldClick(field, selectedFarm)}
                style={{background: selectedField === field ? 'lightblue' : 'white' ,  cursor: 'pointer' }}
            >
            <Typography style={{ cursor: 'pointer',  background: selectedField === field  ? 'lightblue' : 'white' }}>{field.Name}</Typography>
          </Box>
        ))
      
      }
    </Accordion>
    }
    </>
  );
}

export default FieldList;
