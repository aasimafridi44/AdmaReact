const legends = [];
const rasterColorArray = ['#1B8819', '#2ADE08', '#9BFF0C', '#FCE51C', '#F8850C', '#F80711', '#930A0C'];

export const calculateValuesForLegend = (avgValue, georasterArr) => {
  if (georasterArr.length === 0) {
    legends[legends.length - 1] = 0;
    return [{'range': 'N/A', 'color': rasterColorArray[legends.length - 1]}];
  }

  let minVal = georasterArr[0];
  let maxVal = georasterArr[0];

  for (let i = 1; i < georasterArr.length; i++) {
    const currentValue = georasterArr[i];

    if (currentValue < minVal) {
      minVal = currentValue;
    }

    if (currentValue > maxVal) {
      maxVal = currentValue;
    }
  }

  // Adjust the legends based on the length of legends array
  const quintiles = calculateQuintiles(georasterArr, legends.length);
  for (let i = 1; i < legends.length; i++) {
    legends[i] = quintiles[i - 1];
  }

  return getLegends(avgValue, minVal, maxVal, georasterArr);
};

export const calculateQuintiles = (arr, numQuintiles) => {
  const sortedArr = arr.slice().sort((a, b) => a - b);
  const quintileValues = [];

  for (let i = 1; i < numQuintiles; i++) {
    const index = Math.floor((i / numQuintiles) * (sortedArr.length - 1));
    quintileValues.push(sortedArr[index]);
  }

  return quintileValues;
};

export const calculatePercentile = (arr, percentile) => {
  const sortedArr = arr.slice().sort((a, b) => a - b);
  const index = Math.floor((percentile / 100) * (sortedArr.length - 1));
  return sortedArr[index];
};

export const getLegends = (avgValue, minVal, maxVal, georasterArr) => {
  const middleBandNumber = 3;
  const legendArray = [];
  let stopLower = false;

  legends[middleBandNumber - 1] = calculatePercentile(georasterArr, 80); // Set the highest legend to the 80th percentile

  if (minVal <= legends[1]) {
    stopLower = true;
    legendArray[middleBandNumber] = {
      'range': `< ${legends[2]}`,
      'color': rasterColorArray[middleBandNumber]
    };
  } else {
    legends[middleBandNumber] = calculatePercentile(georasterArr, 20); // Set the lowest legend to the 20th percentile
    legendArray[middleBandNumber] = {
      'range': `${legends[1]} - ${legends[2]}`,
      'color': rasterColorArray[middleBandNumber]
    };
  }

  return calculateUpperLowerLegends(avgValue, calculatePercentile(georasterArr, 80), calculatePercentile(georasterArr, 20), legendArray, middleBandNumber, stopLower);
};

export const calculateUpperLowerLegends = (avgValue, percentile80, percentile20, legendArray, middleBandNumber, stopLower) => {
  for (let i = 1; i <= 3; i++) {
    const legendHigher = Math.ceil(percentile80 + (percentile80 - percentile20) * i);
    legendArray[middleBandNumber - i] = {
      'range': (i === 3) ? `> ${percentile80}` : `${percentile80} - ${legendHigher}`,
      'color': rasterColorArray[middleBandNumber - i]
    };

    if (i !== 3) {
      legends[middleBandNumber - i - 1] = legendHigher;
    }

    if (!stopLower) {
      const legendLower = Math.ceil(percentile20 - (percentile80 - percentile20) * i);
      legendArray[middleBandNumber + i] = {
        'range': ((legendLower <= 0 || (i === 3)) ? `< ${percentile20}` : `${legendLower} - ${percentile20}`),
        'color': rasterColorArray[middleBandNumber + i]
      };

      if (legendLower > 0) {
        percentile20 = legendLower;
        callIfNotEqualToThree(percentile20, middleBandNumber, i);
      } else {
        stopLower = true;
      }
    }
  }

  // Add an extra legend for values above maxVal
  legendArray.push({
    'range': `> ${legends[2]}`,
    'color': rasterColorArray[rasterColorArray.length - 1] // Use the last color in the array
  });

  return legendArray;
};

export const callIfNotEqualToThree = (percentile20, middleBandNumber, i) => {
  if (i !== 3) {
    legends[middleBandNumber + i] = percentile20;
  }
};

export const calculateColorForRaster = (value) => {
  if (!isNaN(value) && value !== null && value !== 0) {
    const n = legends.length;

    const rangeSize = 1 / n;
    let colorV = rasterColorArray[n - 1]; // Default color for values outside the legends range

    for (let i = 1; i <= n; i++) {
      const lowerBound = (i - 1) * rangeSize;
      const upperBound = i * rangeSize;

      if (value >= lowerBound && value < upperBound) {
        colorV = rasterColorArray[i - 1];
        // console.log(`Value: ${value}, Range: [${lowerBound}, ${upperBound}), Color: ${colorV}`);
        break;
      }
    }

    // console.log(`Value: ${value}, Final Color: ${colorV}`);
    return colorV;
  } else {
    // console.log(`Invalid value: ${value}, Default Color: ${rasterColorArray[legends.length - 1]}`);
    return rasterColorArray[legends.length - 1]; // Default color for undefined or null values
  }
};