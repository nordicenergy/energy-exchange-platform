import React from 'react';
import { shallow, mount } from 'enzyme';
import Notification from '../Notification';

const notificationMock = {
    timestamp: Date.now(),
    message: 'Test message'
};
const onCloseMock = jest.fn();
function renderComponent(
    { open = true, notification = notificationMock, onClose = onCloseMock, ...otherProps } = {},
    mountFn = shallow
) {
    return mountFn(<Notification open={open} notification={notification} onClose={onClose} {...otherProps} />);
}

describe('<Notification /> component', () => {
    jest.useFakeTimers();

    it(`should renders:
        - Transition
        - Toast`, () => {
        const notification = renderComponent({}, mount);

        expect(notification.find('Transition')).toHaveLength(1);
        expect(notification.find('Toast')).toHaveLength(1);
        expect(notification.find('Toast').text()).toBe(notificationMock.message);
    });

    it('should renders error notification with default message', () => {
        const notification = renderComponent({ defaultErrorMessage: 'TEST', notification: { type: 'error' } }, mount);

        expect(notification.find('Transition')).toHaveLength(1);
        expect(notification.find('Toast')).toHaveLength(1);
        expect(notification.find('Toast').text()).toBe('TEST');
    });

    it("should not renders if notification doesn't pass", () => {
        const notification = renderComponent({ notification: null });

        expect(notification.type()).toBeNull();
    });

    it('should not renders if notification has type success and empty message', () => {
        const notification = renderComponent({ notification: { type: 'success', message: null } });

        expect(notification.type()).toBeNull();
    });

    it('should calls onClose callback after timeout', () => {
        renderComponent();
        jest.runAllTimers();
        expect(onCloseMock).toHaveBeenCalled();
    });

    it('should calls onClose callback after animation was ended', () => {
        const notification = renderComponent();

        notification
            .find('Transition')
            .props()
            .onExited();
        expect(onCloseMock).toHaveBeenCalled();
    });

    it('should set auto hide timeout', () => {
        const setTimeoutSpy = jest.spyOn(window, 'setTimeout').mockImplementation(jest.fn());
        renderComponent();

        expect(setTimeoutSpy).toHaveBeenCalled();

        setTimeoutSpy.mockRestore();
    });

    it('should set new auto hide timeout', () => {
        const setTimeoutSpy = jest.spyOn(window, 'setTimeout').mockImplementation(jest.fn());
        const notification = renderComponent();

        setTimeoutSpy.mockClear();
        notification.setProps({ open: true });
        expect(setTimeoutSpy).toHaveBeenCalled();

        setTimeoutSpy.mockRestore();
    });

    it('should not set new auto hide timeout', () => {
        const setTimeoutSpy = jest.spyOn(window, 'setTimeout').mockImplementation(jest.fn());
        const notification = renderComponent();

        setTimeoutSpy.mockClear();
        notification.setProps({ open: false });
        expect(setTimeoutSpy).not.toHaveBeenCalled();

        setTimeoutSpy.mockRestore();
    });

    it('should reset timeout', () => {
        const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout').mockImplementation(jest.fn());
        const notification = renderComponent();

        notification.unmount();
        expect(clearTimeoutSpy).toHaveBeenCalled();

        clearTimeoutSpy.mockRestore();
    });
});
