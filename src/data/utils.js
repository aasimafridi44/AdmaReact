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
export const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiJodHRwczovL2Zhcm1iZWF0cy5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jNmMxZTlkYS01ZDBjLTRmOGYtOWEwMi0zYzY3MjA2ZWZiZDYvIiwiaWF0IjoxNjk4OTI2NDI2LCJuYmYiOjE2OTg5MjY0MjYsImV4cCI6MTY5ODkzMDMyNiwiYWlvIjoiRTJGZ1lKaTkrckxoRWVaY253bEt3Y2tia3BzZUF3QT0iLCJhcHBpZCI6IjNiZDYzZDQwLTIyYzMtNDQ2ZS1iOGI3LTgwOGMxNTdkMTFkOCIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2M2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNi8iLCJvaWQiOiJjMTg1Y2ZjMy0xNTE5LTQzOWQtOTBlNS0zMzM3MmUzNjIxMjEiLCJyaCI6IjAuQVVrQTJ1bkJ4Z3hkajAtYUFqeG5JRzc3MXNXVHVMRWNyb3RCbUpNTGVNQkNKYlJKQUFBLiIsInN1YiI6ImMxODVjZmMzLTE1MTktNDM5ZC05MGU1LTMzMzcyZTM2MjEyMSIsInRpZCI6ImM2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNiIsInV0aSI6IkJPaTVsTTl1R2thUGNiOGdVY0lzQUEiLCJ2ZXIiOiIxLjAifQ.zRhQv8sYnRavf_Pyme0-9pDX2oFKNxdjhCOjyOcdpDAxqCmf_lDr2TtTLG2QagNQj88kD-JZ_nzkLSH5mMXE4VRD5-28hB_fnLWTFYwQSNtezwfx9BEY8VtLeg3D242XJ_g8JuhResogCpsH6uA4yRvrlIBROltOZqas_u0ziXGpvJeu1PIBNbe4mtltvhihrbM6m_eHkfvMqhISWc2gqGNqq6zRaGvTRrzfAurh_xBHcf4lKanaF3s4f4Wwc_s-gpn99Dz3oSRjZzaP6Swa00Jy7XkK0IhYen75lulx8B1i5Pv6OEyIsOGGWs_yf6k243n9p4_pZexgQodUq0_KmQ"
// Define your custom headers
export const headers = {
  'Authorization':'Bearer '+apiToken,
  'Content-Type': 'application/json',
  'api-version': '2022-11-01-preview',
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': '*'
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
