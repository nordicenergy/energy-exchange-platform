import React from 'react';
import { ResetPassword } from '../ResetPassword';
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
function renderComponent(props = { match: { params: { resetToken: '123' } } }, context = { router: routerMock }) {
    return shallowWithIntl(<ResetPassword {...props} />, { context });
}

describe('<ResetPassword /> Container', () => {
    beforeEach(() => {
        historyMock.push.mockClear();
        userActionPerformers.performVerifyResetPasswordToken = jest.fn();
        userActionPerformers.performResetUserPassword = jest.fn();
        appActionPerformers.performSetupLoaderVisibility = jest.fn();
    });

    it(`should renders with:
        - div.reset-password-container element;
        - ResetPasswordForm component;
        - Logo component;
        - Illustration component;`, () => {
        const component = renderComponent();

        expect(component.find('div.reset-password-container')).toHaveLength(1);
        expect(component.find('ResetPasswordForm')).toHaveLength(1);
        expect(component.find('Logo')).toHaveLength(1);
        expect(component.find('Illustration')).toHaveLength(1);
    });

    it('should correctly map state to properties', () => {
        const stateDummy = {
            Users: {
                verifiedPasswordToken: {
                    loading: false,
                    data: 'verifiedPasswordToken-data-test',
                    error: null
                },
                resetPassword: {
                    loading: 'resetPassword-loading-test',
                    data: 'resetPassword-data-test',
                    error: 'resetPassword-error-test'
                }
            }
        };
        const props = ResetPassword.mapStateToProps(stateDummy);

        expect(props.loading).toBe('resetPassword-loading-test');
        expect(props.resetPasswordData).toBe('resetPassword-data-test');
        expect(props.tokenVerification).toBe('verifiedPasswordToken-data-test');
        expect(props.error).toBe('resetPassword-error-test');
    });

    it('should opens login page after login link was clicked', () => {
        const component = renderComponent();

        component
            .find('ResetPasswordForm')
            .props()
            .onLoginLinkClick();
        expect(historyMock.push).toHaveBeenCalledWith('/login');
    });

    it('should perform verify reset password token action and open login page after if token was invalid', () => {
        jest.spyOn(notificationsActionPerformers, 'performPushNotification').mockImplementation(jest.fn());
        const component = renderComponent();

        expect(userActionPerformers.performVerifyResetPasswordToken).toHaveBeenCalledWith('123');

        component.setProps({
            loading: true
        });
        expect(appActionPerformers.performSetupLoaderVisibility).toHaveBeenCalledWith(expect.anything(), true);

        component.setProps({
            loading: false,
            tokenVerification: { valid: false },
            error: null
        });
        expect(historyMock.push).toHaveBeenCalledWith('/login');
        expect(notificationsActionPerformers.performPushNotification).toHaveBeenCalledWith({
            type: 'error',
            message: 'Invalid reset password link'
        });

        notificationsActionPerformers.performPushNotification.mockRestore();
    });

    it('should perform reset user password action and open login page after send button was clicked', () => {
        jest.spyOn(notificationsActionPerformers, 'performPushNotification').mockImplementation(jest.fn());
        const component = renderComponent();

        component
            .find('ResetPasswordForm')
            .props()
            .onSubmit('demo1234', 'demo1234');
        expect(userActionPerformers.performResetUserPassword).toHaveBeenCalledWith('123', 'demo1234');

        component.setProps({
            loading: true
        });
        expect(appActionPerformers.performSetupLoaderVisibility).toHaveBeenCalledWith(expect.anything(), true);

        component.setProps({
            loading: false,
            resetPasswordData: { updated: true },
            error: null
        });
        expect(historyMock.push).toHaveBeenCalledWith('/login');
        expect(notificationsActionPerformers.performPushNotification).toHaveBeenCalledWith({
            type: 'success',
            message: 'Your password was successfully updated'
        });

        notificationsActionPerformers.performPushNotification.mockRestore();
    });

    it('should shows server error if reset password was failed', () => {
        jest.spyOn(notificationsActionPerformers, 'performPushNotification').mockImplementation(jest.fn());
        const component = renderComponent();

        component.setProps({
            loading: false,
            error: { message: 'Error message' }
        });

        expect(notificationsActionPerformers.performPushNotification).toHaveBeenCalledWith({
            type: 'error',
            message: 'Invalid reset password link'
        });

        notificationsActionPerformers.performPushNotification.mockRestore();
    });

    it('should validate email', () => {
        const component = renderComponent();
        // Disable console warning for the test.
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(jest.fn());

        component
            .find('ResetPasswordForm')
            .props()
            .onSubmit();
        expect(historyMock.push).not.toHaveBeenCalled();
        expect(component.state().errors).toHaveProperty('password');
        expect(component.state().errors).toHaveProperty('confirm');

        consoleWarnSpy.mockRestore();
    });
});
