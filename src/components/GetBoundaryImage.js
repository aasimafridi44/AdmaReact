import axios from 'axios';
import { apiEndPoint } from '../data/utils'

//Get All Boundary By Party Id.
export const GetSatelliteImageByBid = async (selectedParty, selectedBid) => {
    try {
        const response = await axios.get(`${apiEndPoint}/Boundary/GetBoundaryImage/${selectedParty.Id}/${selectedBid}`, { responseType: 'arraybuffer' })
        const satelliteImage = response.data.Data;
        const imageData = new Uint8Array(satelliteImage);
        const blob = new Blob([imageData], { type: 'image/octet-stream' });
        const url = URL.createObjectURL(blob);
        console.log('GetSatelliteImageByBid',url)
        return url;
    }
    catch(error) {
        console.error('Error fetching boundary image data:', error);
    }
};