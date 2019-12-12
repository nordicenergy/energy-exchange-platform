import { defineMessages } from 'react-intl';

const messages = defineMessages({
    formTitle: {
        id: 'app.resetPasswordPage.formTitle',
        defaultMessage: 'Reset password'
    },
    passwordField: {
        id: 'app.resetPasswordPage.passwordField',
        defaultMessage: 'Enter new password'
    },
    confirmField: {
        id: 'app.resetPasswordPage.confirmField',
        defaultMessage: 'Re-enter new password'
    },
    sendButton: {
        id: 'app.resetPasswordPage.sendButton',
        defaultMessage: 'Confirm'
    },
    loginLink: {
        id: 'app.resetPasswordPage.loginLink',
        defaultMessage: 'Login'
    },
    invalidPasswordError: {
        id: 'app.resetPasswordPage.errors.invalidEmail',
        defaultMessage:
            'Password must have a minimum of 8 alphanumeric characters, at least 1 letter, at least 1 number.'
    },
    invalidConfirmError: {
        id: 'app.resetPasswordPage.errors.invalidConfirm',
        defaultMessage: 'Passwords are not equal.'
    },
    invalidResetPasswordToken: {
        id: 'app.resetPasswordPage.errors.invalidResetPasswordToken',
        defaultMessage: 'Invalid reset password link'
    },
    passwordWasUpdated: {
        id: 'app.resetPasswordPage.info.passwordWasUpdated',
        defaultMessage: 'Your password was successfully updated'
    }
});

export default messages;
