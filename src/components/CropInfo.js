import React, {useEffect, useState} from 'react';
import { Box,Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, TableSortLabel } from '@mui/material';
import axios from 'axios';
import { apiEndPoint } from '../data/utils'
import { CircularProgress } from '@mui/material'

const CropInfo = ({ selectedParty, selectedField }) => {
  const [orderBy, setOrderBy] = React.useState('year');
  const [order, setOrder] = React.useState('asc');
  const [crops, SetCrops] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {   
    axios.get(`${apiEndPoint}/SeasonalFields/GetSeasonalFields/${selectedParty.Id}/seasonalfield/${selectedField.Id}`, {})
    .then((response) => {
        SetCrops(response.data.Data);
        setLoading(false); // Set loading to false once data is fetched
    })
    .catch((error) => {
      console.error('Error fetching seasonal fields data:', error);
      setLoading(false); // Set loading to false once data is fetched
    });        
  }, [selectedField.Id, selectedParty]);


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
      <Box 
          padding={2}
          margin={0.5}
          sx={{ lineHeight: 2, fontSize: 'h5.fontSize', fontWeight: 'bold' }}
          >
          {'Seasonal field details:'}
          </Box>
    
    {loading ? (
      <CircularProgress /> // Display a loader while loading data
    ) : 
    (
      <>

          <Paper style={{margin: 1,padding: 0, border: 1}}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#8c8c8c', '& .MuiTableCell-head': { color: 'white' } }}>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'Year'}
                        direction={order}
                        onClick={() => handleSort('Year')}
                      >
                        Year
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'Crop'}
                        direction={order}
                        onClick={() => handleSort('Crop')}
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
                        Bundary size
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {sortedCrops.length < 1 ? (
                  <TableRow key={'no-records'}>
                    <TableCell align="center" colSpan={4}>{'No records found. '}</TableCell>
                  </TableRow>
                ) :(
                sortedCrops.map((crop, index) => (
                    <TableRow key={index} sx={{ backgroundColor: index%2 === 0 ?'#e6e6e6' : '#f2f2f2'}}>
                      <TableCell>{crop.Year}</TableCell>
                      <TableCell>{crop.crop}</TableCell>
                      <TableCell>{crop.plantingDate}</TableCell>
                      <TableCell>{crop.boundary}</TableCell>
                    </TableRow>
                  ))
                )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
      </>
    )
    }
    </>
  )
};

export default CropInfo




