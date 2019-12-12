import React from 'react';
import { shallow } from 'enzyme';
import Confirm from '../Confirm';
import focusManager from 'focus-manager';

const labelsMock = {
    message: 'Test',
    confirmButton: 'Yes',
    cancelButton: 'No'
};

function renderComponent({ labels = labelsMock, ...otherProps } = {}, mountFn = shallow) {
    return mountFn(<Confirm labels={labels} {...otherProps} />);
}

describe('<Confrim /> component', () => {
    it('should renders without errors', () => {
        const confirm = renderComponent();

        expect(confirm.find('.confirm-dialog-message').text()).toBe(labelsMock.message);
        expect(
            confirm
                .find('button')
                .at(0)
                .text()
        ).toBe(labelsMock.confirmButton);
        expect(
            confirm
                .find('button')
                .at(1)
                .text()
        ).toBe(labelsMock.cancelButton);

        confirm.setProps({ show: true });
        expect(confirm.hasClass('confirm--show')).toBeTruthy();
    });

    it('should calls onConfirm callback', () => {
        const onConfirmMock = jest.fn();
        const confirm = renderComponent({ onConfirm: onConfirmMock });

        confirm
            .find('button')
            .at(0)
            .simulate('click');
        expect(onConfirmMock).toHaveBeenCalled();
    });

    it('should calls onCancel callback', () => {
        const onCancelMock = jest.fn();
        const confirm = renderComponent({ onCancel: onCancelMock });

        confirm
            .find('button')
            .at(1)
            .simulate('click');
        expect(onCancelMock).toHaveBeenCalled();
    });

    it('should correct manage focus of the modal when show and hide it', () => {
        jest.spyOn(focusManager, 'capture').mockImplementation(jest.fn);
        jest.spyOn(focusManager, 'release').mockImplementation(jest.fn);

        const confirm = renderComponent({ show: false });
        expect(focusManager.capture).toHaveBeenCalledTimes(0);
        expect(focusManager.release).toHaveBeenCalledTimes(0);

        confirm.setProps({ show: true });

        expect(focusManager.capture).toHaveBeenCalledTimes(1);
        expect(focusManager.release).toHaveBeenCalledTimes(0);

        confirm.setProps({ show: false });

        expect(focusManager.capture).toHaveBeenCalledTimes(1);
        expect(focusManager.release).toHaveBeenCalledTimes(1);

        focusManager.capture.mockRestore();
        focusManager.release.mockRestore();
    });

    it('should add event listener on keydown', () => {
        jest.spyOn(document, 'addEventListener').mockImplementation(jest.fn);
        jest.spyOn(document, 'removeEventListener').mockImplementation(jest.fn);

        const confirm = renderComponent({ show: false });

        expect(document.addEventListener).toHaveBeenCalledTimes(1);
        expect(document.removeEventListener).toHaveBeenCalledTimes(0);

        const [[event, func, flag]] = document.addEventListener.mock.calls;
        expect(event).toEqual('keydown');
        expect(typeof func).toBe('function');
        expect(flag).toEqual(false);

        confirm.unmount();

        expect(document.addEventListener).toHaveBeenCalledTimes(1);
        expect(document.removeEventListener).toHaveBeenCalledTimes(1);

        const [[event1, func1, flag1]] = document.removeEventListener.mock.calls;
        expect(event1).toEqual('keydown');
        expect(typeof func1).toBe('function');
        expect(flag1).toEqual(false);

        document.addEventListener.mockRestore();
        document.removeEventListener.mockRestore();
    });
});
