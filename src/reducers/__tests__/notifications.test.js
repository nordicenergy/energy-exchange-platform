import { initialState, notificationsReducer } from '../notifications';

const { NOTIFICATION_MOCK, ACTIONS } = fixtures();

describe('Notifications reducer', () => {
    describe('Pending cases:', () => {
        it('should handle PUSH_NOTIFICATION', () => {
            const newState = notificationsReducer(initialState, ACTIONS.pushNotification.pending);

            expect(newState.pushedNotification.data).toEqual(initialState.pushedNotification.data);
            expect(newState.pushedNotification.loading).toBeTruthy();
            expect(newState.pushedNotification.error).toBeNull();
        });
    });

    describe('Success cases:', () => {
        it('should handle PUSH_NOTIFICATION', () => {
            const newState = notificationsReducer(initialState, ACTIONS.pushNotification.success);

            expect(newState.pushedNotification.data).toEqual(NOTIFICATION_MOCK);
            expect(newState.pushedNotification.loading).toBeFalsy();
            expect(newState.pushedNotification.error).toBeNull();
        });
    });

    describe('Error cases:', () => {
        it('should handle PUSH_NOTIFICATION', () => {
            const newState = notificationsReducer(initialState, ACTIONS.pushNotification.error);

            expect(newState.pushedNotification.data).toEqual(initialState.pushedNotification.data);
            expect(newState.pushedNotification.loading).toBeFalsy();
            expect(newState.pushedNotification.error).toBeInstanceOf(Error);
        });
    });
});

function fixtures() {
    const NOTIFICATION_MOCK = {
        timestamp: Date.now(),
        type: 'error',
        message: 'Error message'
    };

    const ACTIONS = {
        pushNotification: {
            pending: {
                type: 'PUSH_NOTIFICATION',
                payload: null,
                loading: true,
                error: null
            },
            success: {
                type: 'PUSH_NOTIFICATION',
                payload: NOTIFICATION_MOCK,
                loading: false,
                error: null
            },
            error: {
                type: 'PUSH_NOTIFICATION',
                payload: null,
                loading: false,
                error: new Error()
            }
        }
    };

    return { NOTIFICATION_MOCK, ACTIONS };
}
