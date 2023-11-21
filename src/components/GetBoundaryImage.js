import axios from 'axios';
import { apiEndPoint } from '../data/utils'

//Get All Boundary By Party Id.
export const GetSatelliteImageByBid = async (selectedParty, selectedBid) => {
    try {
        const response = await axios.get(`${apiEndPoint}/Boundary/GetBoundaryImage/${selectedParty.Id}/${selectedBid}`, {responseType: 'blob'})
        const satelliteImage = "https://tnaasim.blob.core.windows.net/image/Oct_Screenshot%202023-08-27%20181814.png?sp=r&st=2023-11-21T10:37:17Z&se=2023-11-21T18:37:17Z&spr=https&sv=2022-11-02&sr=b&sig=tcqKK3Dsldq2jyD2UIIQG7rJJapdoL5MMRZZgrIpPaI%3D";//response.data
        let blobUrl = '';
        return fetch(satelliteImage)
        .then(response => response.blob())
        .then(blob => {
            blobUrl = URL.createObjectURL(blob)
            return blobUrl;
        })
        // const imageData = new Uint8Array(satelliteImage);
        /*
        const blob = new Blob([satelliteImage], { type: 'application/octet-stream' });
        
        if(satelliteImage !== '')
        {
            console.log('GetSatelliteImageByBid===', satelliteImage)
            const url = URL.createObjectURL(blob);
            console.log('GetSatelliteImageByBid',url, satelliteImage)
            //return url;
        }
        */
    }
    catch(error) {
        console.error('Error fetching boundary image data:', error);
    }
};