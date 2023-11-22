import axios from 'axios';
import { apiEndPoint } from '../data/utils'

//Get All Boundary By Party Id.
export const GetAllBoundaryByField = async (selectedParty, selectedField) => {
    try {
        const response = await axios.get(`${apiEndPoint}/Boundary/GetByPartyAndFieldId/${selectedParty.Id}/${selectedField.Id}`)
        const boundaries = response.data.Data;
        return boundaries;
    }
    catch(error) {
        console.error('Error fetching boundary data:', error);
    }
};

//Get Boundary Details By Boundary Id.
export const GetBoundaryDetails = async (selectedParty, selectedField) => {
    try {
        const boundariesData = await GetAllBoundaryByField(selectedParty, selectedField)
        const requestPromises = boundariesData.map((item) => {
           return axios.get(`${apiEndPoint}/Boundary/GetByPartyAndBoundaryId/${selectedParty.Id}/${item.Id}`)
        });
        return axios.all(requestPromises)
        .then((responses) => {
            return responses
        }) 
    }
    catch(error) {
        console.error('Error fetching boundary data:', error);
    }
    
}

//Get Boundary Details By Boundary Id.
export const CreateBoundary = async (selectedParty, boundaryId, selectedField, geoType, coordinates) => {
    const createBoundaryParam =  {
        "parentId": selectedField.Id,
        "parentType": "Field",
        "type": "string",
        "geometry": {
          "type": geoType,
          "coordinates": coordinates
        },
        "name": `${selectedField.Name} of boundary`,
        "description": "field boundary"
    }
    const response = await axios.patch(`${apiEndPoint}/Boundary/CreateOrUpdate/${selectedParty.Id}/${boundaryId}`, createBoundaryParam)
    return response;
}