import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography, 
  } from '@mui/material';
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
      <AccordionDetails>
      { loading ? (
        <CircularProgress /> // Display a loader while loading data
      ) : 
        fieldsData.map((field, index) => (
          <List  sx={{ 
                bgcolor: 'background.paper', 
                cursor: 'pointer',
                paddingTop: '8px',
                paddingBottom: '0px',
                '&:hover': {
                    backgroundColor: '#f0f0f0', // Change this to your desired hover color
                  },
                background: selectedField?.Id === field?.Id ? 'lightblue' : 'white'
                }}  key={field.Id} onClick={() => handleFieldClick(field, selectedFarm)}>
              <ListItem alignItems="flex-start">
                <ListItemText className="MuiListItemText-multiline" primary={field.Name}
                  sx={{
                      '&.MuiListItemText-multiline': {
                        '& .MuiTypography-root': {
                          lineHeight: '15px',
                        },
                      },
                    }}
                />
              </ListItem>
              {index !== field.length - 1 &&<Divider /> }
            </List>
        ))
      
      }
      </AccordionDetails>
    </Accordion>
    }
    </>
  );
}

export default FieldList;
