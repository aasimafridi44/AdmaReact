import axios from 'axios';
import { apiEndPoint } from '../data/utils'

//Get Boundary Image By Party Id and Boundary Id.
export const GetSatelliteImageByBid = async (selectedParty, selectedBid) => {
    try {
        const response = await axios.get(`${apiEndPoint}/Boundary/GetBoundaryImage/${selectedParty.Id}/${selectedBid}`)
        const satelliteImage = response.data.Data
        console.log('satelliteImage', satelliteImage)
        let blobUrl = '';
        return fetch(satelliteImage)
        .then(response => response.blob())
        .then(blob => {
            blobUrl = URL.createObjectURL(blob)
            return blobUrl;
        })
    }
    catch(error) {
        console.error('Error fetching boundary image data:', error);
    }
};
export const DeleteSatelliteImageByJob = async(selectedParty, selectedBid) => {
    try {
        const jobParams = {}
        const response = await axios.patch(`${apiEndPoint}/Boundary/CreateCascadeDeleteJob?partyId=${selectedParty.Id}&boundaryId=${selectedBid}`, jobParams, {})
        return response.data.Data
    }  catch(error) {
        console.error('Error in deleting boundary data:', error);
    }

}