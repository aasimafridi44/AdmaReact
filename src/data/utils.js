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
export const apiEndPoint = requestedUrl(window.location.href)  + 'https://adma-api.azurewebsites.net'
export const endPoint = requestedUrl(window.location.href) + 'https://adma.farmbeats.azure.net';
export const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiJodHRwczovL2Zhcm1iZWF0cy5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jNmMxZTlkYS01ZDBjLTRmOGYtOWEwMi0zYzY3MjA2ZWZiZDYvIiwiaWF0IjoxNzAwMzcyMjMzLCJuYmYiOjE3MDAzNzIyMzMsImV4cCI6MTcwMDM3NjEzMywiYWlvIjoiRTJWZ1lDajUvS3M4M0NTTkplUlp4cHByejEwM0FBQT0iLCJhcHBpZCI6IjNiZDYzZDQwLTIyYzMtNDQ2ZS1iOGI3LTgwOGMxNTdkMTFkOCIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2M2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNi8iLCJvaWQiOiJjMTg1Y2ZjMy0xNTE5LTQzOWQtOTBlNS0zMzM3MmUzNjIxMjEiLCJyaCI6IjAuQVVrQTJ1bkJ4Z3hkajAtYUFqeG5JRzc3MXNXVHVMRWNyb3RCbUpNTGVNQkNKYlJKQUFBLiIsInN1YiI6ImMxODVjZmMzLTE1MTktNDM5ZC05MGU1LTMzMzcyZTM2MjEyMSIsInRpZCI6ImM2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNiIsInV0aSI6Ik92dW9SWnYwWlVtdEJ0V1BvQ2h6QUEiLCJ2ZXIiOiIxLjAifQ.cTQIoBEb81ouIp4jUjOiff3QT4Xzn0hV3ypTnLevV7OfUyDnVFuI3e23ln3Ez6A2EQ0dOYfsk3XOp_UWntbNy4l77CQwPCUX2DhdDKu0bmwV9s_UlbJC_gHHxSHCLQ650_lqWEu1VyRvOyDSmfgSVo0l63PA9oHTimWaEmOyG6RL6E0mk-Kb7aBINFJLtLA-6p-7UhM-HqNFzeEM5AqRroCZrMHZyLr66BrN-huEBxHM1F9eKHDtxb3-O61vu3uB0SSNdTVl1XzeUmscJWE2YU5i98R8hOJJhQZwl4ADyUpQtHXi4QFiayYcthYBTP9OvcnBL-DhrOlC5waSsD5q4g";

// Define your custom headers
export const headers = {
  'Content-Type': 'application/json'
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