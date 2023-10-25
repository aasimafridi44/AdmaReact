// FieldList.js

import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

function FieldList({ selectedFarm, fields, onFieldSelect }) {
  const filteredFields = fields.filter((field) => field.farmId === selectedFarm.id);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        List of Fields for {selectedFarm.name}
      </Typography>
      <List>
        {filteredFields.map((field) => (
          <ListItem 
                key={field.id}
                onClick={() => onFieldSelect(field)}
                style={{ cursor: 'pointer' }}
            >
            <ListItemText primary={field.name} secondary={field.area} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default FieldList;
