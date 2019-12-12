import React from 'react';
import { shallowWithIntl } from '../../../services/intlTestHelper';
import { Notifications } from '../Notifications';

const notificationMock = {
    timestamp: Date.now(),
    type: 'error',
    message: 'Error message'
};
const newNotification = {
    timestamp: Date.now(),
    type: 'success',
    message: 'Success message'
};
function renderComponent(props = {}, mountFn = shallowWithIntl) {
    return mountFn(<Notifications {...props} />);
}

describe('<Notifications /> component', () => {
    jest.useFakeTimers();

    it('should renders without errors', () => {
        renderComponent();
    });

    it('should return correct props', () => {
        const stateMock = {
            Users: { data: [] },
            Notifications: {
                pushedNotification: { data: notificationMock }
            }
        };
        const props = Notifications.mapStateToProps(stateMock);

        expect(props).toEqual({ pushedNotification: notificationMock });
    });

    it('should update state when received new notification', () => {
        const notifications = renderComponent();

        notifications.setProps({ pushedNotification: notificationMock });
        expect(notifications.state()).toEqual({
            open: true,
            notification: notificationMock,
            pendingNotification: null
        });
        notifications.setProps({ pushedNotification: newNotification });
        expect(notifications.state()).toEqual({
            open: false,
            notification: notificationMock,
            pendingNotification: newNotification
        });
    });

    it('should hide active notification', () => {
        const notifications = renderComponent();

        notifications.setState({ open: true, notification: notificationMock });
        notifications
            .find('Notification')
            .props()
            .onClose();
        expect(notifications.state().open).toBeFalsy();
    });

    it('should close show pending notification after hide active notification', () => {
        const notifications = renderComponent();

        notifications.setState({
            open: true,
            notification: notificationMock,
            pendingNotification: newNotification
        });
        notifications
            .find('Notification')
            .props()
            .onClose();
        expect(notifications.state()).toEqual({
            open: true,
            notification: newNotification,
            pendingNotification: null
        });
    });
});
