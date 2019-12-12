export const initialState = {
    contracts: { data: [], error: null, loading: false },
    sessionContract: { data: null, error: null, loading: false },
    updatedSessionContract: { data: null, error: null, loading: false }
};

export function contractsReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_CONTRACTS': {
            const payload = action && action.payload;
            return {
                ...state,
                contracts: {
                    data: payload && payload.contracts ? payload.contracts : state.contracts.data,
                    loading: action.loading,
                    error: action.error
                }
            };
        }
        case 'GET_SESSION_CONTRACT': {
            const payload = action && action.payload;
            return {
                ...state,
                sessionContract: {
                    data: payload && payload.sessionContract ? payload.sessionContract : state.sessionContract.data,
                    loading: action.loading,
                    error: action.error
                }
            };
        }
        case 'SET_SESSION_CONTRACT': {
            const payload = action && action.payload;

            return {
                ...state,
                updatedSessionContract: {
                    data: payload ? payload : state.updatedSessionContract.data,
                    loading: action.loading,
                    error: action.error
                }
            };
        }
        default:
            return state;
    }
}
