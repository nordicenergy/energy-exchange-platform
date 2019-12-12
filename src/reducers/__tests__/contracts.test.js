import { contractsReducer, initialState } from '../contracts';

const { ACTIONS } = fixtures();

describe('Contracts reducer:', () => {
    describe('Pending cases:', () => {
        it('should handle GET_CONTRACTS', () => {
            const result = contractsReducer(initialState, ACTIONS.getContracts.pending);
            expect(result.contracts.loading).toEqual(true);
            expect(result.contracts.error).toEqual(null);
            expect(result.contracts.data).toEqual([]);
        });
        it('should handle GET_SESSION_CONTRACT', () => {
            const result = contractsReducer(initialState, ACTIONS.getSessionContract.pending);
            expect(result.sessionContract.loading).toEqual(true);
            expect(result.sessionContract.error).toEqual(null);
            expect(result.sessionContract.data).toEqual(null);
        });
        it('should handle SET_SESSION_CONTRACT', () => {
            const result = contractsReducer(initialState, ACTIONS.setSessionContract.pending);
            expect(result.updatedSessionContract.loading).toEqual(true);
            expect(result.updatedSessionContract.error).toEqual(null);
            expect(result.updatedSessionContract.data).toEqual(null);
        });
    });
    describe('Error cases:', () => {
        it('should handle GET_CONTRACTS', () => {
            const result = contractsReducer(initialState, ACTIONS.getContracts.fail);
            expect(result.contracts.loading).toEqual(false);
            expect(result.contracts.error).toEqual('Error Message');
            expect(result.contracts.data).toEqual([]);
        });
        it('should handle GET_SESSION_CONTRACT', () => {
            const result = contractsReducer(initialState, ACTIONS.getSessionContract.fail);
            expect(result.sessionContract.loading).toEqual(false);
            expect(result.sessionContract.error).toEqual('Error Message');
            expect(result.sessionContract.data).toEqual(null);
        });
        it('should handle SET_SESSION_CONTRACT', () => {
            const result = contractsReducer(initialState, ACTIONS.setSessionContract.fail);
            expect(result.updatedSessionContract.loading).toEqual(false);
            expect(result.updatedSessionContract.error).toEqual('Error Message');
            expect(result.updatedSessionContract.data).toEqual(null);
        });
    });
    describe('Success cases:', () => {
        it('should handle GET_CONTRACTS', () => {
            const result = contractsReducer(initialState, ACTIONS.getContracts.success);
            expect(result.contracts.loading).toEqual(false);
            expect(result.contracts.error).toEqual(null);
            expect(result.contracts.data).toEqual(ACTIONS.getContracts.success.payload.contracts);
        });
        it('should handle GET_SESSION_CONTRACT', () => {
            const result = contractsReducer(initialState, ACTIONS.getSessionContract.success);
            expect(result.sessionContract.loading).toEqual(false);
            expect(result.sessionContract.error).toEqual(null);
            expect(result.sessionContract.data).toEqual(ACTIONS.getSessionContract.success.payload.sessionContract);
        });
        it('should handle SET_SESSION_CONTRACT', () => {
            const result = contractsReducer(initialState, ACTIONS.setSessionContract.success);
            expect(result.updatedSessionContract.loading).toEqual(false);
            expect(result.updatedSessionContract.error).toEqual(null);
            expect(result.updatedSessionContract.data).toEqual(ACTIONS.setSessionContract.success.payload);
        });
    });
});

function fixtures() {
    const ACTIONS = {
        getContracts: {
            success: {
                type: 'GET_CONTRACTS',
                payload: {
                    contracts: [{ id: '10020' }]
                },
                error: null,
                loading: false,
                meta: [2]
            },
            fail: {
                type: 'GET_CONTRACTS',
                payload: null,
                error: 'Error Message',
                loading: false,
                meta: [2]
            },
            pending: {
                type: 'GET_CONTRACTS',
                payload: null,
                error: null,
                loading: true,
                meta: [2]
            }
        },
        getSessionContract: {
            success: {
                type: 'GET_SESSION_CONTRACT',
                payload: {
                    sessionContract: { id: '10020' }
                },
                error: null,
                loading: false,
                meta: [2]
            },
            fail: {
                type: 'GET_SESSION_CONTRACT',
                payload: null,
                error: 'Error Message',
                loading: false,
                meta: [2]
            },
            pending: {
                type: 'GET_SESSION_CONTRACT',
                payload: null,
                error: null,
                loading: true,
                meta: [2]
            }
        },
        setSessionContract: {
            success: {
                type: 'SET_SESSION_CONTRACT',
                payload: {
                    sessionContract: { id: '10020' }
                },
                error: null,
                loading: false,
                meta: [2, 10020]
            },
            fail: {
                type: 'SET_SESSION_CONTRACT',
                payload: null,
                error: 'Error Message',
                loading: false,
                meta: [2, 10020]
            },
            pending: {
                type: 'SET_SESSION_CONTRACT',
                payload: null,
                error: null,
                loading: true,
                meta: [2, 10020]
            }
        }
    };
    return { ACTIONS };
}
