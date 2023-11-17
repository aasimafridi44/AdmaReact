import axios from 'axios';

const MAX_RETRIES = 5; // Maximum number of retries
const RETRY_DELAY_MS = 1000; // Delay between retries in milliseconds

export const fetchDataWithRetries = async (url, currentRetry = 0, headers='') => {
  try {
    const response = await axios.get(url, {headers: headers});    
    if(response.data.status.toLowerCase() !== 'Succeeded'.toLowerCase()) {
        if (currentRetry >= MAX_RETRIES) {
            console.log(`Max retries reached. Unable to fetch data from ${url}`);
            return {}
          }
      
          // Log the info (optional)
          console.log(`Delete boundary data from ${url}. Retrying...`);
      
          // Wait for the specified delay before retrying
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      
          // Retry with an increased retry count
          return fetchDataWithRetries(url, currentRetry + 1, headers);
    }
    return response.data.status; // Return the data if successful
  } catch (error) {
    // Check if the maximum number of retries has been reached
    if (currentRetry >= MAX_RETRIES) {
      throw new Error(`Max retries reached. Unable to fetch data from ${url}`);
    }

    // Log the error (optional)
    console.error(`Error fetching data from ${url}. Retrying...`);

    // Wait for the specified delay before retrying
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));

    // Retry with an increased retry count
    return fetchDataWithRetries(url, currentRetry + 1);
  }
};
