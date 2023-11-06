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
export const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiJodHRwczovL2Zhcm1iZWF0cy5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jNmMxZTlkYS01ZDBjLTRmOGYtOWEwMi0zYzY3MjA2ZWZiZDYvIiwiaWF0IjoxNjk5Mjc1ODU5LCJuYmYiOjE2OTkyNzU4NTksImV4cCI6MTY5OTI3OTc1OSwiYWlvIjoiRTJGZ1lPalU3RGJQY2wxY1ZEaHQyMlQvL05ocEFBPT0iLCJhcHBpZCI6IjNiZDYzZDQwLTIyYzMtNDQ2ZS1iOGI3LTgwOGMxNTdkMTFkOCIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2M2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNi8iLCJvaWQiOiJjMTg1Y2ZjMy0xNTE5LTQzOWQtOTBlNS0zMzM3MmUzNjIxMjEiLCJyaCI6IjAuQVVrQTJ1bkJ4Z3hkajAtYUFqeG5JRzc3MXNXVHVMRWNyb3RCbUpNTGVNQkNKYlJKQUFBLiIsInN1YiI6ImMxODVjZmMzLTE1MTktNDM5ZC05MGU1LTMzMzcyZTM2MjEyMSIsInRpZCI6ImM2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNiIsInV0aSI6IklPdHdwd1RaMVUtTlV4UzNwV19BQUEiLCJ2ZXIiOiIxLjAifQ.pk5rU_t2KiSckeTeREFiI6pzBI5bBk5DriSBKMkdLbzfYXejfLMZoGZil_XuQ6WKbzUNatBiyvYbpXcVTNHjiXxXeXaBRopLy2hniB5WmlwiQxOsQ9gGPvk8In43xOBY5J9vVQVajGccLeWZLDZRuqE6U7vrMEKH82tgemBsKJxTUUeIu50IgwsSHxL-fqoEf3ONU3-h6s-tSnLiLEpaWIkJhvw3vUS0OEvSDgDBCc74Jkk4wpTQ1laqTtWFySk8kU7a-hAfmEYwjfRRerW5MO6z8LKaZZcVP56J8JrGaKlwGV3h9kyiCJmbo-hvHUf3oq5zTUJnd30bFtelurRLzQ";
// Define your custom headers
export const headers = {
  'Authorization':'Bearer '+ apiToken,
  'Content-Type': 'application/json',
  'api-version': '2022-11-01-preview',
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
