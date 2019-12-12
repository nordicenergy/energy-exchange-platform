export const initialState = {
    pushedNotification: { data: {}, error: null, loading: false }
};

export function notificationsReducer(state = initialState, action) {
    switch (action.type) {
        case 'PUSH_NOTIFICATION':
            return {
                ...state,
                pushedNotification: {
                    data: action.payload || state.pushedNotification.data,
                    loading: action.loading,
                    error: action.error
                }
            };
        default:
            return state;
    }
}
