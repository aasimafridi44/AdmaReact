export const requestedUrl = (requestUrl) => {
  const proxyServer = ['http://localhost:8080/', 'https://cors-anywhere.herokuapp.com/']
  let proxyUrl
  if (requestUrl.indexOf('localhost') !== -1) {
    proxyUrl = proxyServer[0];
  } else {
    proxyUrl = proxyServer[1];
  }
  return proxyUrl
}

export const endPoint = requestedUrl(window.location.href) + 'https://adma.farmbeats.azure.net';
export const googleMapKey = "AIzaSyADpUeiQiPTYYvsqwbVLiJWoSv0tf3fEVs"
export const libraries = ['drawing'];
export const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiJodHRwczovL2Zhcm1iZWF0cy5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jNmMxZTlkYS01ZDBjLTRmOGYtOWEwMi0zYzY3MjA2ZWZiZDYvIiwiaWF0IjoxNzAwMjI2MzA1LCJuYmYiOjE3MDAyMjYzMDUsImV4cCI6MTcwMDIzMDIwNSwiYWlvIjoiRTJWZ1lBaFlkNlV1OUxyKzNscmVkdkVqQ1NzdkFRQT0iLCJhcHBpZCI6IjNiZDYzZDQwLTIyYzMtNDQ2ZS1iOGI3LTgwOGMxNTdkMTFkOCIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2M2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNi8iLCJvaWQiOiJjMTg1Y2ZjMy0xNTE5LTQzOWQtOTBlNS0zMzM3MmUzNjIxMjEiLCJyaCI6IjAuQVVrQTJ1bkJ4Z3hkajAtYUFqeG5JRzc3MXNXVHVMRWNyb3RCbUpNTGVNQkNKYlJKQUFBLiIsInN1YiI6ImMxODVjZmMzLTE1MTktNDM5ZC05MGU1LTMzMzcyZTM2MjEyMSIsInRpZCI6ImM2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNiIsInV0aSI6IkJscmREUU1RUmtHeTk1Y0hCVDFzQUEiLCJ2ZXIiOiIxLjAifQ.CkdX-RayS0w5rsj934ixflN1ahOlOiwoZfSkJLihHkuKKGCm-ZDAyKy261os-byACuQ6QhkOTe9cnQvXpRMAjSSJRVqvcf2GEI0ETsnq0KvLUyjX_WjwutIrV9BYhi0sSjFiOrnJORfJkWREl8Gcei8ExnZGKC3oGp2k7kSoi8zxPn_zUBfyB0oJknigEsXT7uKWDXM4fAFpgytJj342l4CXEPBClT6a_dEQm5q7AHYfUAPK4nN5ZbNXfgOyICz6JVkNrp886sARuuleQgN5lmzsUPFBjye3TJed8Gyh6L913qmiyg89_oFzXcDmlFnOZT2jhlmNSYYY3Ey6XbP6IA";
// Define your custom headers
export const headers = {
  'Authorization':'Bearer '+ apiToken,
  'Content-Type': 'application/json',
  'api-version': '2023-16-01-preview',
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': '*'
};
export const polygonOptions = {
  fillColor: '#1aff8c', // Fill color (in this case, orange)
  fillOpacity: 0.5, // Fill opacity (0 to 1)
  strokeColor: '#00cc66', // Stroke color
  strokeOpacity: 1, // Stroke opacity (0 to 1)
  strokeWeight: 2, // Stroke weight (line thickness)
};
export const convertCoordinatesToLatLngArray = (nestedCoordinatesArray) => {  
    const convertArray = (arr) => {
        return arr.map((item) => {
          if (Array.isArray(item[0])) {
            return convertArray(item[0]);
          }
          if (item.length === 2) {
            const [lat, lng] = item; // Note the order, assuming it's [lng, lat]
            return { lat, lng };
          }
          console.error(`Invalid coordinates: ${item}`);
          return null; // or handle the error as needed
        });
      };
    
      const latLngArray = convertArray(nestedCoordinatesArray);
      // Flatten the resulting array (if needed)
      //const flattenedArray = latLngArray.flat();
      return latLngArray.filter((latLng) => latLng !== null);
  }

export const resultArray = (inputArray) => {
    return inputArray.map(obj => {
        // Destructure the lat and lng properties and rename them
        const { lat, lng, ...rest } = obj; // Remove lat and lng properties
        const [newLat, newLng] = [lat, lng].map(val => val); // Get absolute values
        return [newLat, newLng, ...Object.values(rest)]; // Add other properties back
    })
};

export const to_long_lat = (coordinates) => {
  return coordinates.map(polygon =>
    polygon.map(point => [point[1], point[0]])
  );
};

export const convertToGeoJSON = (coordinates) => {
  //const to_long_lat = coordinates.map(items => to_long_lat(items));
  
  const geojson = {
    type: 'FeatureCollection',
    features: [],
  };
  for (const coords of coordinates) {
    const arr = coords.geometry
    //console.log('convertToGeoJSON', arr)
    const feature = {
      type: 'Feature',
      properties: {
        'boundaryId': coords.boundaryId,
        'partyId': coords.partyId,
        'parentId': coords.parentId,
        'type': coords.type,
        'mode': ''
      },
      geometry: {
        type: 'Polygon',
        coordinates: arr,
      },
    };

    geojson.features.push(feature);
  }
  return geojson;
};

export const extractArraysFromFeatureCollection = (featureCollection) => {
  if (!featureCollection || !featureCollection.features || !Array.isArray(featureCollection.features)) {
    // Return an empty array or handle the invalid input as needed
    return [];
  }

  const arrays = [];

  featureCollection.features.forEach(feature => {
    if (feature.geometry && feature.geometry.coordinates) {
      arrays.push(feature.geometry.coordinates);
    }
  });

  return arrays;
}