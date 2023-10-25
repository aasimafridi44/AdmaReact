// FarmList.js

import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

function FarmList({ selectedParty, farms, onFarmSelect }) {

    const filteredFarms = farms.filter((farm) => farm.partyId === selectedParty.id);
    return (
        <div>
        <Typography variant="h6" gutterBottom>
            List of Farms for {selectedParty.name}
        </Typography>
        <List>
            {filteredFarms.map((farm) => (
            <ListItem 
                key={farm.id}
                onClick={() => onFarmSelect(farm)}
                style={{ cursor: 'pointer' }}>
                <ListItemText primary={farm.name} secondary={farm.location} />
            </ListItem>
            ))}
        </List>
        </div>
    );
}

export default FarmList;
