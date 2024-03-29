import axios from 'axios';
import { apiEndPoint } from '../data/utils'

//Get Boundary Image By Party Id and Boundary Id.
export const GetSatelliteImageByBid = async (selectedParty, selectedBid) => {
    try {
        const response = await axios.get(`${apiEndPoint}/Boundary/GetBoundaryImage/${selectedParty.Id}/${selectedBid}`)
        const satelliteImage = response.data.Data
        return satelliteImage
    }
    catch(error) {
        console.error('Error fetching boundary image data:', error);
    }
};

export const fetchImageWithRetry = async(url, maxRetries = 400, currentRetry = 0) => {
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.blob();
      } else {
        return '';
      }
    })
    .then(blob => {
        return blob === '' ? '' : URL.createObjectURL(blob)
    });
}
export const DeleteSatelliteImageByJob = async(selectedParty, selectedBid) => {
    try {
        const jobParams = {}
        const response = await axios.patch(`${apiEndPoint}/Boundary/CreateCascadeDeleteJob?partyId=${selectedParty}&boundaryId=${selectedBid}`, jobParams, {})
        return response.data.Data
    }  catch(error) {
        console.error('Error in deleting boundary data:', error);
    }

}