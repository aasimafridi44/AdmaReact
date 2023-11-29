import React from 'react';
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, TableSortLabel } from '@mui/material';

const CropInfo = ({ crops }) => {
  const [orderBy, setOrderBy] = React.useState('year');
  const [order, setOrder] = React.useState('asc');

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
    <Paper>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCrops.map((crop, index) => (
              <TableRow key={index}>
                <TableCell>{crop.year}</TableCell>
                <TableCell>{crop.crop}</TableCell>
                <TableCell>{crop.plantingDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CropInfo




