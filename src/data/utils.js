import { LatLngBounds, LatLng } from 'leaflet'

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
export const apiEndPoint = 'https://adma-api.azurewebsites.net'
export const endPoint = requestedUrl(window.location.href) + 'https://adma.farmbeats.azure.net';
export const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSIsImtpZCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSJ9.eyJhdWQiOiJodHRwczovL2Zhcm1iZWF0cy5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jNmMxZTlkYS01ZDBjLTRmOGYtOWEwMi0zYzY3MjA2ZWZiZDYvIiwiaWF0IjoxNzAwNjU0MDIzLCJuYmYiOjE3MDA2NTQwMjMsImV4cCI6MTcwMDY1NzkyMywiYWlvIjoiRTJWZ1lKamd2dTIvUEdQdzlIakJsV3dtR3hpeUFBPT0iLCJhcHBpZCI6IjNiZDYzZDQwLTIyYzMtNDQ2ZS1iOGI3LTgwOGMxNTdkMTFkOCIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2M2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNi8iLCJvaWQiOiJjMTg1Y2ZjMy0xNTE5LTQzOWQtOTBlNS0zMzM3MmUzNjIxMjEiLCJyaCI6IjAuQVVrQTJ1bkJ4Z3hkajAtYUFqeG5JRzc3MXNXVHVMRWNyb3RCbUpNTGVNQkNKYlJKQUFBLiIsInN1YiI6ImMxODVjZmMzLTE1MTktNDM5ZC05MGU1LTMzMzcyZTM2MjEyMSIsInRpZCI6ImM2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNiIsInV0aSI6IlhfQU5xSlF4eVUyLThpNVRoeHMyQUEiLCJ2ZXIiOiIxLjAifQ.cMCGf9uDkpIQIm8jZT4PP-gP4tbLnhzAHqK7n11HoINnyCAOlVkQHaNyBUqwzrCF-zf8B2fV75oGxmR4hVh3rFTwicIFnKfLUJ-DbDRRIeKiNxuBquv2ZRwsozutOF01_VVAJV2XohQ14e8Zt3jGXTWiZEx-4gQRQkpW7t1CR_JSsHjK7LTqY77TZ6TNVzL-fYIkg0j1uiUeJejTtWXccdmr1qcUtJ2lw4sxnSHSZq5NmICIdV9gaJDIBVpH537BteCyDHp4d_kGfRHqGwNcViuAFqx9suzaBXbX1k3qivE9CT5ti2UVB7_ZzaxPhWJVlS84-8GVjTtFeAkTXb2Jzw";

// Define your custom headers
export const headers = {
  'Content-Type': 'application/json',
  'Authorization':'Bearer '+ apiToken,
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

export const to_lat_lng = (coordinates) => {
  return coordinates.map(polygon =>
    polygon.map(point => [point[0], point[1]])
  );
};

export const convertToGeoJSON = (coordinates, type = 'get') => {
  //const to_long_lat = coordinates.map(items => to_long_lat(items));
  
  const geojson = {
    type: 'FeatureCollection',
    features: [],
  };
  console.log('length', coordinates, coordinates.length)
  if(coordinates.length < 1){
    return geojson
  }
  console.log('for loop', coordinates)
  for (const coords of coordinates) { 
    console.log('for loop--', coords)  
    const arr = type === 'get' ? coords.geometry : coords.Geometry.Coordinates
    console.log('convertToGeoJSON', arr)
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
  console.log('geojson', geojson)
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
export const getBoundsCords = (arr) => {
  if(arr !== undefined)  {
  //const newLatLng = to_lat_lng(arr)
  //console.log('arr', arr)
  //console.log('newLatLng', newLatLng)
  const cords = arr[0];
  // Calculate the opposite corners
  const minLat = Math.min(...cords.map(coord => coord[0]));
  const minLng = Math.min(...cords.map(coord => coord[1]));
  const maxLat = Math.max(...cords.map(coord => coord[0]));
  const maxLng = Math.max(...cords.map(coord => coord[1]));
  //console.log('=]]', new LatLng(minLat, minLng), new LatLng(maxLat, maxLng))
  return new LatLngBounds(
    new LatLng(minLng, minLat ),
    new LatLng(maxLng, maxLat )
  );
  }
  return []
}