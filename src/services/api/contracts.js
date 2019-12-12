import Axios from 'axios';
import { SESSION_API_URL } from '../../constants';

export function getContracts(userId) {
    // for current moment we are not supporting pagination for comboboxes
    // also expect that user will have only several contracts (less than 100)
    return Axios.get(`${SESSION_API_URL}/user/${userId}/contracts?limit=100&offset=0`);
}

export function getSessionContract(userId) {
    return Axios.get(`${SESSION_API_URL}/user/${userId}/sessionContract`);
}

export function setSessionContract(userId, contractId) {
    return Axios.put(`${SESSION_API_URL}/user/${userId}/sessionContract`, { contractId });
}
