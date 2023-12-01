import React, {useEffect, useState} from 'react';
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, TableSortLabel } from '@mui/material';
import axios from 'axios';
import { apiEndPoint } from '../data/utils'
import { CircularProgress } from '@mui/material'

const CropInfo = ({ selectedParty }) => {
  const [orderBy, setOrderBy] = React.useState('year');
  const [order, setOrder] = React.useState('asc');
  const [crops, SetCrops] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {   
    axios.get(`${apiEndPoint}/SeasonalFields/GetSeasonalFields/${selectedParty.Id}`, {})
    .then((response) => {
        SetCrops(response.data.Data);
        setLoading(false); // Set loading to false once data is fetched
    })
    .catch((error) => {
      console.error('Error fetching seasonal fields data:', error);
      setLoading(false); // Set loading to false once data is fetched
    });        
  }, [selectedParty]);


  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedCrops = React.useMemo(() => {
    return [...crops].sort((a, b) => {
      if (order === 'asc') {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      } else {
        return a[orderBy] < b[orderBy] ? 1 : -1;
      }
    });
  }, [crops, orderBy, order]);

  return (
    <>
    {loading ? (
        <CircularProgress /> // Display a loader while loading data
      ) : 
      (
    <Paper style={{ marginTop: '30px'}}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'year'}
                  direction={order}
                  onClick={() => handleSort('year')}
                >
                  Year
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'crop'}
                  direction={order}
                  onClick={() => handleSort('crop')}
                >
                  Crop
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'plantingDate'}
                  direction={order}
                  onClick={() => handleSort('plantingDate')}
                >
                  Planting Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'boundary'}
                  direction={order}
                  onClick={() => handleSort('boundary')}
                >
                  Boundary
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCrops.map((crop, index) => (
              <TableRow key={index}>
                <TableCell>{crop.Year}</TableCell>
                <TableCell>{crop.crop}</TableCell>
                <TableCell>{crop.plantingDate}</TableCell>
                <TableCell>{crop.boundary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
      )}
      </>
  );
};

export default CropInfo




