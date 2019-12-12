import {
    create,
    login,
    logout,
    getUserData,
    updateUserData,
    resetUserPassword,
    createResetPasswordToken,
    verifyResetPasswordToken
} from '../services/api/users';

import { dispatcher } from '../store';

export function performRegistration(userData) {
    dispatcher.dispatchPromise(create, 'REGISTRATION', state => state.Users.registration.loading, [userData]);
}

export function performLogin(credentials) {
    dispatcher.dispatchPromise(login, 'LOGIN', state => state.Users.login.loading, [credentials]);
}

export function performLogout() {
    dispatcher.dispatchPromise(logout, 'LOGOUT', state => state.Users.logout.loading);
}

export function performGetUserData() {
    dispatcher.dispatchPromise(getUserData, 'GET_USER_DATA', state => state.Users.profile.loading);
}

export function performUpdateUserData(userData) {
    dispatcher.dispatchPromise(updateUserData, 'UPDATE_USER_DATA', state => state.Users.updatedProfile.loading, [
        userData
    ]);
}

export function performResetUserPassword(resetToken, newPassword) {
    dispatcher.dispatchPromise(resetUserPassword, 'RESET_USER_PASSWORD', state => state.Users.resetPassword.loading, [
        resetToken,
        newPassword
    ]);
}

export function performCreateResetPasswordToken(email) {
    dispatcher.dispatchPromise(
        createResetPasswordToken,
        'CREATE_RESET_PASSWORD_TOKEN',
        state => state.Users.createdPasswordToken.loading,
        [email]
    );
}

export function performVerifyResetPasswordToken(resetToken) {
    dispatcher.dispatchPromise(
        verifyResetPasswordToken,
        'VERIFY_RESET_PASSWORD_TOKEN',
        state => state.Users.verifiedPasswordToken.loading,
        [resetToken]
    );
}
