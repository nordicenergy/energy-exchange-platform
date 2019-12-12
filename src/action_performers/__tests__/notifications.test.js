import { dispatcher } from '../../store';
import { performPushNotification } from '../notifications';

describe('Notifications action performers', () => {
    const notificationMock = {
        type: 'error',
        message: 'Error message'
    };
    const timestampMock = 999;

    beforeAll(() => {
        jest.spyOn(dispatcher, 'dispatchAction').mockImplementation(jest.fn());
        jest.spyOn(Date, 'now').mockReturnValue(timestampMock);
    });

    afterAll(() => {
        dispatcher.dispatchAction.mockRestore();
        Date.now.mockRestore();
    });

    afterEach(() => {
        dispatcher.dispatchAction.mockClear();
    });

    it('should calls dispatch method for push notification', () => {
        performPushNotification(notificationMock);

        expect(dispatcher.dispatchAction).toHaveBeenCalledWith(
            'PUSH_NOTIFICATION',
            expect.objectContaining({
                timestamp: timestampMock,
                type: notificationMock.type,
                message: notificationMock.message
            }),
            null,
            false,
            []
        );
    });
});
