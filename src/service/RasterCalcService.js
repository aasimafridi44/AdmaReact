const legends= [];
const rasterColorArray = ['#1B8819', '#2ADE08', '#9BFF0C', '#FCE51C', '#F8850C', '#F80711', '#930A0C']


export const calculateValuesForLegend = (avgValue, georasterArr) => {
    const arrayBefore = [];
    const arrayAfter = [];
    let sumBefore = 0;
    let sumAfter = 0;

    if (georasterArr.length === 0) {
      legends[3] = 0;
      return [{'range': 'N/A' , 'color': rasterColorArray[3]}];
    }
    georasterArr.forEach((element) => {
      if (element < avgValue) {
        arrayBefore.push(element);
        sumBefore = sumBefore + element;
      } else {
        arrayAfter.push(element);
        sumAfter = sumAfter + element;
      }
    });
    const avgBefore = isNaN(sumBefore / arrayBefore.length) ? 0 : Math.ceil(sumBefore / arrayBefore.length);
    const avgAfter = isNaN(sumAfter / arrayAfter.length) ? 0 : Math.ceil(sumAfter / arrayAfter.length);
  
    // lower band
    let band = avgValue - avgBefore; // before value assigned to band
    if ((band > avgAfter - avgValue )) {
      band = avgAfter - avgValue;
    }
  
    /**Do not remove this commented code */
  
    // higher band
  /*if ((band > avgAfter - avgValue )) {
      band = band;
    } */
  
     /* higher - lower band */
    /* let band = avgAfter - avgBefore; */
  
    band = band < 1 ? 1 : band;
    return getLegends(avgValue, band);
}
  
  export const getLegends = (avgValue, band) => {
    const average = band / 2;
    const averageRangeHigher = Math.ceil(avgValue + average);
    const averageLowerValue = Math.ceil(avgValue - average);
    const middleBandNumber = 3;
    const legendArray = [];
    let stopLower = false;
    legends[middleBandNumber - 1] = averageRangeHigher;
    if (averageLowerValue <= 0) {
      stopLower = true;
      legendArray[middleBandNumber] = {
        'range' : '< ' + averageRangeHigher,
        'color' : rasterColorArray[middleBandNumber]};
    } else {
      legends[middleBandNumber] = averageLowerValue;
      legendArray[middleBandNumber] = {
        'range' : `${averageLowerValue} - ${averageRangeHigher}`,
        'color' : rasterColorArray[middleBandNumber]
      };
    }
    return calculateUpperLowerLegends(averageRangeHigher, averageLowerValue, band, legendArray, middleBandNumber, stopLower);
  }
  
  export const calculateUpperLowerLegends =  (averageRangeHigher, averageLowerValue, band, legendArray, middleBandNumber, stopLower) => {
    for (let i = 1; i <= 3; i++) {
      const legendHigher = Math.ceil(averageRangeHigher + band);
      legendArray[middleBandNumber - i] = {
        'range': (i === 3) ? '> ' + averageRangeHigher : `${averageRangeHigher} - ${legendHigher}`,
        'color': rasterColorArray[middleBandNumber - i]
        };
      averageRangeHigher = legendHigher;
      if (i !== 3) {
      legends[middleBandNumber - i - 1] = averageRangeHigher;
      }
      if (!stopLower) {
        const legendLower = Math.ceil(averageLowerValue - band);
        legendArray[middleBandNumber + i] = {
          'range': ((legendLower <= 0 || (i === 3)) ? '< ' + averageLowerValue :
            `${legendLower} - ${averageLowerValue}`),
          'color': rasterColorArray[middleBandNumber + i]
        };
        if (legendLower > 0) {
          averageLowerValue = legendLower;
          callIfNotEqualToThree(averageLowerValue, middleBandNumber, i);
        } else {
            stopLower = true;
        }
      }
    }
    return legendArray;
  }
  
  export const callIfNotEqualToThree = (averageLowerValue, middleBandNumber, i) => {
    if (i !== 3) {
      legends[middleBandNumber + i] = averageLowerValue;
    }
  }
  
  export const calculateColorForRaster = (value) => {
    let colorV;
    let index;
    if (isNaN(value) || value == null || value[0] === 0) {
      colorV = rasterColorArray[3];
    } else {
      legends.forEach((element , i) => {
        if (!colorV  && value > element) {
          colorV = rasterColorArray[i];
        }
        index = i;
      });
      if (!colorV) {
        colorV =  rasterColorArray[index + 1];
      }
    }
      return colorV;
  }