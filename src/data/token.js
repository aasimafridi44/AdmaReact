const proxyServier = ['http://localhost:8080/', 'https://allorigins.win/', 'https://cors-anywhere.herokuapp.com/', 'https://api.allorigins.win/get?url=', 'https://web.archive.org/web/20180807170914/http://anyorigin.com/go?url=']
export const endPoint = proxyServier[0] + 'https://adma.farmbeats.azure.net';
export const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiJodHRwczovL2Zhcm1iZWF0cy5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jNmMxZTlkYS01ZDBjLTRmOGYtOWEwMi0zYzY3MjA2ZWZiZDYvIiwiaWF0IjoxNjk4NTc1OTUxLCJuYmYiOjE2OTg1NzU5NTEsImV4cCI6MTY5ODU3OTg1MSwiYWlvIjoiRTJGZ1lMaWNhUGxDTWM5bnU2eUkvLzR1N1pwZkFBPT0iLCJhcHBpZCI6IjNiZDYzZDQwLTIyYzMtNDQ2ZS1iOGI3LTgwOGMxNTdkMTFkOCIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2M2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNi8iLCJvaWQiOiJjMTg1Y2ZjMy0xNTE5LTQzOWQtOTBlNS0zMzM3MmUzNjIxMjEiLCJyaCI6IjAuQVVrQTJ1bkJ4Z3hkajAtYUFqeG5JRzc3MXNXVHVMRWNyb3RCbUpNTGVNQkNKYlJKQUFBLiIsInN1YiI6ImMxODVjZmMzLTE1MTktNDM5ZC05MGU1LTMzMzcyZTM2MjEyMSIsInRpZCI6ImM2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNiIsInV0aSI6IldCWnJoTHFreDBxNng0OHBJVmdUQUEiLCJ2ZXIiOiIxLjAifQ.VfxKgKDdkRbHlyhAw-JUrjSUOCtOJGcaJ_5v7kTJu8fYaHl48tNE5clGzjv12yyEBgn5JMkOZuiPRtMTJcsuXVJGkDm2a3jrPO3gpi3rR33KFakHHlpClI6VXT0an9n8L5vxmXJsYvmj3g3MfZbjQBSaUTD-cbUUUZVKOxMdi5YPVO66unGrtLsvZIs_ix7KeLICLPap9GiGrKuhWBBY_CzMa2SIx3DAtep-OhGRCyQGR6FbhhPaugAHEuBDlcua8Y4yM25hPlsm6d3dY8omkQ-CqnFQqGlW3v9gjWtexQFp6Ty0KyKJoqGDMG3nPnGhKS_9xY9yuAVjVnoz3IagZQ"
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
