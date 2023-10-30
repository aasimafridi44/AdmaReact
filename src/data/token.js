const proxyServier = ['http://localhost:8080/', 'https://allorigins.win/', 'https://cors-anywhere.herokuapp.com/', 'https://api.allorigins.win/get?url=', 'https://web.archive.org/web/20180807170914/http://anyorigin.com/go?url=']
export const endPoint = proxyServier[0] + 'https://adma.farmbeats.azure.net';
export const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiJodHRwczovL2Zhcm1iZWF0cy5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jNmMxZTlkYS01ZDBjLTRmOGYtOWEwMi0zYzY3MjA2ZWZiZDYvIiwiaWF0IjoxNjk4NjYyMDk4LCJuYmYiOjE2OTg2NjIwOTgsImV4cCI6MTY5ODY2NTk5OCwiYWlvIjoiRTJGZ1lKQy85czN5MnVLRVNRMXYxUkxlTWFWa0FnQT0iLCJhcHBpZCI6IjNiZDYzZDQwLTIyYzMtNDQ2ZS1iOGI3LTgwOGMxNTdkMTFkOCIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2M2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNi8iLCJvaWQiOiJjMTg1Y2ZjMy0xNTE5LTQzOWQtOTBlNS0zMzM3MmUzNjIxMjEiLCJyaCI6IjAuQVVrQTJ1bkJ4Z3hkajAtYUFqeG5JRzc3MXNXVHVMRWNyb3RCbUpNTGVNQkNKYlJKQUFBLiIsInN1YiI6ImMxODVjZmMzLTE1MTktNDM5ZC05MGU1LTMzMzcyZTM2MjEyMSIsInRpZCI6ImM2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNiIsInV0aSI6IllDdUQ1ZGF0SmtLS1J6eGRhRUFKQUEiLCJ2ZXIiOiIxLjAifQ.w3-RJ_yOcJuF_D3nJ3NqN5mJ8Sfyd4ORiRBWod9mwPcN6jIgqXsvB46mY3itJFiHWwHLvLRBt3y_rVp9VnEFa2Tjjv7gkzehMREH5artD_w66xGICTRh-NyPru8UOr4W5ib2Ic0yOvsVAlFNgfiJZ8epDVSIgIBiHP_YYzOZlmvXQWEm5dUAQFehSvuNqvUZkSA1barBmDgj7mP8XplvB2wuUWtKOmaJy1478A6eDpwB53AJjK7CqD8aC_LOhQ4GfourjeUUMZqD2jBP_qpNUBCmt0DorJPwy5oIxyZ4J1W8N_fDCezs6CEIWz5HKHlgwRBCWExmq9IrZvDycFANBA"
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
