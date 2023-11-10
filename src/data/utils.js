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
export const apiVersion = "2023-06-01-preview";
export const googleMapKey = "AIzaSyADpUeiQiPTYYvsqwbVLiJWoSv0tf3fEVs"
export const libraries = ['drawing'];
export const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiJodHRwczovL2Zhcm1iZWF0cy5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jNmMxZTlkYS01ZDBjLTRmOGYtOWEwMi0zYzY3MjA2ZWZiZDYvIiwiaWF0IjoxNjk5NjMxOTg3LCJuYmYiOjE2OTk2MzE5ODcsImV4cCI6MTY5OTYzNTg4NywiYWlvIjoiRTJWZ1lEZ1lZSHJKWk43aDB5OC9maXRTVjNEWkR3QT0iLCJhcHBpZCI6IjNiZDYzZDQwLTIyYzMtNDQ2ZS1iOGI3LTgwOGMxNTdkMTFkOCIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2M2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNi8iLCJvaWQiOiJjMTg1Y2ZjMy0xNTE5LTQzOWQtOTBlNS0zMzM3MmUzNjIxMjEiLCJyaCI6IjAuQVVrQTJ1bkJ4Z3hkajAtYUFqeG5JRzc3MXNXVHVMRWNyb3RCbUpNTGVNQkNKYlJKQUFBLiIsInN1YiI6ImMxODVjZmMzLTE1MTktNDM5ZC05MGU1LTMzMzcyZTM2MjEyMSIsInRpZCI6ImM2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNiIsInV0aSI6Iklya21BbzBtajBtQ1FXeW56a0F3QUEiLCJ2ZXIiOiIxLjAifQ.JckUpq5v_Xo8qtWKgY04Hs8YZfPqCxFOMMURFVnp67nd_RT29x-jQuLys00hFaVKLwUalB2kY3GQbgKVUUs_Goi9E56aAiimJh_kX_p_WfETbNBFiyLBuGT5r0xu_vxRq5irOT4WRm-Qoa5KIxlsTzX2h2P-D8_nfkuYUWsi8MnkeJtzR8E5r3fa74_IRE9SHbVVq7eFvkzdjjBFny1A70ubduXKSmHFJb5wNXs1ntzOly5XLpgLXH403tiv88bMOcQdPjJ14uLbxLuPU1SdoiQcy59wv0w6iZjtR8T5j7u57tFAAGGyWJRMk5xYzc_1r-jQHPGncgNnKasXp9Kt7Q";
export const ImageOverlayURL = "https://tavant-my.sharepoint.com/personal/aasim_khan_tavant_com/Documents/field2.png"
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
