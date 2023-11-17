import axios from 'axios';
import { endPoint, headers } from '../data/utils'

//Get All Boundary By Party Id.
export const GetAllBoundaryByField = async (selectedParty, selectedField) => {
    try {
        const response = await axios.get(endPoint+ '/parties/'+ selectedParty.id +'/boundaries?api-version=2023-06-01-preview', { headers })
        const result = response.data.value;
        const boundaries = result.filter((boundary) => boundary.parentId === selectedField.id).map((boundary) => boundary.id);
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
        const response = axios.get(`${endPoint}/parties/${selectedParty.id}/boundaries/${boundariesData[0]}?api-version=2023-06-01-preview`, { headers })
        // Resolve the promise with the transformed data
        return response;
    }
    catch(error) {
        console.error('Error fetching boundary data:', error);
    }
    
}

/*
    boundariesData.map((id) => {
         return 
   
    }); */