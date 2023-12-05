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
          {'Seasonal Field Details:'}
          </Box>
    
    {loading ? (
      <CircularProgress /> // Display a loader while loading data
    ) : 
    (
      <>
        {sortedCrops.length < 1 ? (
          <Box padding={2} textAlign={'center'} fontWeight={540}>
            {'No records found. '}
          </Box>

        ) : (
          <Paper style={{margin: 2,padding: 2, border: 1}}>
            <TableContainer>
              <Table>
                <TableHead>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedCrops.map((crop, index) => (
                    <TableRow key={index}>
                      <TableCell>{crop.Year}</TableCell>
                      <TableCell>{crop.crop}</TableCell>
                      <TableCell>{crop.plantingDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )

        }
      </>
    )
    }
    </>
  )
};

export default CropInfo




