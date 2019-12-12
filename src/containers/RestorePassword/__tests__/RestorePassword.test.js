import React from 'react';
import { RestorePassword } from '../RestorePassword';
import { shallowWithIntl } from '../../../services/intlTestHelper';
import * as userActionPerformers from '../../../action_performers/users';
import * as notificationsActionPerformers from '../../../action_performers/notifications';
import * as appActionPerformers from '../../../action_performers/app';

const historyMock = {
    push: jest.fn()
};
const routerMock = {
    history: historyMock
};
function renderComponent(props = {}, context = { router: routerMock }) {
    return shallowWithIntl(<RestorePassword {...props} />, { context });
}

describe('<RestorePassword /> Container', () => {
    beforeEach(() => {
        historyMock.push.mockClear();
        userActionPerformers.performCreateResetPasswordToken = jest.fn();
        appActionPerformers.performSetupLoaderVisibility = jest.fn();
    });

    it(`should renders with:
        - restore password form
        - logo
        - illustration`, () => {
        const component = renderComponent();

        expect(component.find('RestorePasswordForm')).toHaveLength(1);
        expect(component.find('Logo')).toHaveLength(1);
        expect(component.find('Illustration')).toHaveLength(1);
    });

    it('should correctly map state to properties', () => {
        const stateDummy = {
            Users: {
                createdPasswordToken: {
                    loading: 'test',
                    data: 'test',
                    error: 'test'
                }
            }
        };
        const props = RestorePassword.mapStateToProps(stateDummy);

        expect(props.loading).toBe('test');
        expect(props.data).toBe('test');
        expect(props.error).toBe('test');
    });

    it('should opens login page after login link was clicked', () => {
        const component = renderComponent();

        component
            .find('RestorePasswordForm')
            .props()
            .onLoginLinkClick();
        expect(historyMock.push).toHaveBeenCalledWith('/login');
    });

    it('should perform create reset token action and open login page after send button was clicked', () => {
        jest.spyOn(notificationsActionPerformers, 'performPushNotification').mockImplementation(jest.fn());
        const component = renderComponent();

        component
            .find('RestorePasswordForm')
            .props()
            .onSubmit('info@nordicenergy.io');
        expect(userActionPerformers.performCreateResetPasswordToken).toHaveBeenCalledWith('info@nordicenergy.io');

        component.setProps({
            loading: true
        });
        expect(appActionPerformers.performSetupLoaderVisibility).toHaveBeenCalledWith(expect.anything(), true);

        component.setProps({
            loading: false,
            data: { created: true },
            error: null
        });
        expect(historyMock.push).toHaveBeenCalledWith('/login');
        expect(notificationsActionPerformers.performPushNotification).toHaveBeenCalledWith({
            type: 'success',
            message: 'An email will be sent to you with a link to reset your password'
        });

        notificationsActionPerformers.performPushNotification.mockRestore();
    });

    it('should shows server error if restore password was failed', () => {
        jest.spyOn(notificationsActionPerformers, 'performPushNotification').mockImplementation(jest.fn());
        const component = renderComponent();

        component.setProps({
            loading: false,
            error: { message: 'Error message' }
        });

        expect(notificationsActionPerformers.performPushNotification).toHaveBeenCalledWith({
            message:
                'An error occurred while creating reset password token. Please contact administrator to resolve the error.',
            type: 'error'
        });

        notificationsActionPerformers.performPushNotification.mockRestore();
    });

    it('should validate email', () => {
        const component = renderComponent();
        // Disable console warning for the test.
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(jest.fn());

        component
            .find('RestorePasswordForm')
            .props()
            .onSubmit();
        expect(historyMock.push).not.toHaveBeenCalled();
        expect(component.state().errors).toHaveProperty('info@nordicenergy.io');

        consoleWarnSpy.mockRestore();
    });
});
