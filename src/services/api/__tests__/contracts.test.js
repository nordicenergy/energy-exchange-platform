import { getContracts, getSessionContract, setSessionContract } from '../contracts';
import Axios from 'axios';

describe('Contracts API Service', () => {
    beforeEach(() => {
        Axios.get = jest.fn();
        Axios.put = jest.fn();
    });

    it('should provide method for getting user contracts', () => {
        getContracts(1);
        expect(Axios.get).toHaveBeenCalledWith('/api/user/1/contracts?limit=100&offset=0');
    });

    it('should provide method for getting session contract', () => {
        getSessionContract(1);
        expect(Axios.get).toHaveBeenCalledWith('/api/user/1/sessionContract');
    });

    it('should provide method for setting session contract', () => {
        setSessionContract(1, 10);
        expect(Axios.put).toHaveBeenCalledWith('/api/user/1/sessionContract', { contractId: 10 });
    });
});
