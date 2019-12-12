import { getContracts, getSessionContract, setSessionContract } from '../services/api/contracts';

import { dispatcher } from '../store';

export function performGetContracts(userId) {
    dispatcher.dispatchPromise(getContracts, 'GET_CONTRACTS', state => state.Contracts.contracts.loading, [userId]);
}

export function performGetSessionContract(userId) {
    dispatcher.dispatchPromise(
        getSessionContract,
        'GET_SESSION_CONTRACT',
        state => state.Contracts.sessionContract.loading,
        [userId]
    );
}

export function performSetSessionContract(userId, contractId) {
    dispatcher.dispatchPromise(
        setSessionContract,
        'SET_SESSION_CONTRACT',
        state => state.Contracts.updatedSessionContract.loading,
        [userId, contractId]
    );
}
