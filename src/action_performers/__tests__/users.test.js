import { dispatcher } from '../../store';

import {
    performRegistration,
    performLogin,
    performLogout,
    performGetUserData,
    performUpdateUserData,
    performResetUserPassword,
    performCreateResetPasswordToken,
    performVerifyResetPasswordToken
} from '../users';

describe('Users action performers', () => {
    beforeEach(() => {
        dispatcher.dispatchPromise = jest.fn();
    });

    it('should call dispatch method for user registration', () => {
        const userData = { firstName: 'John', lastName: 'Doe', username: 'test', password: 'qwerty123' };

        performRegistration(userData);

        const [firstCall] = dispatcher.dispatchPromise.mock.calls;
        const [method, type, loadingFunc, meta] = firstCall;
        const loading = loadingFunc({
            Users: { registration: { loading: 'TEST' } }
        });
        const [data] = meta;

        expect(dispatcher.dispatchPromise.mock.calls.length).toEqual(1);
        expect(method.name).toEqual('create');
        expect(type).toEqual('REGISTRATION');
        expect(loading).toEqual('TEST');
        expect(data).toEqual(userData);
    });

    it('should call dispatch method for user login', () => {
        performLogin({ username: 'test', password: 'test' });

        const [firstCall] = dispatcher.dispatchPromise.mock.calls;
        const [method, type, loadingFunc, meta] = firstCall;
        const loading = loadingFunc({
            Users: { login: { loading: 'TEST' } }
        });
        const [credentials] = meta;

        expect(dispatcher.dispatchPromise.mock.calls.length).toEqual(1);
        expect(method.name).toEqual('login');
        expect(type).toEqual('LOGIN');
        expect(loading).toEqual('TEST');
        expect(credentials).toEqual({ username: 'test', password: 'test' });
    });

    it('should call dispatch method for user logout', () => {
        performLogout();

        const [firstCall] = dispatcher.dispatchPromise.mock.calls;
        const [method, type, loadingFunc, meta] = firstCall;
        const loading = loadingFunc({
            Users: { logout: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise.mock.calls.length).toEqual(1);
        expect(method.name).toEqual('logout');
        expect(type).toEqual('LOGOUT');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual(undefined);
    });

    it('should call dispatch method for get user data', () => {
        performGetUserData();

        const [firstCall] = dispatcher.dispatchPromise.mock.calls;
        const [method, type, loadingFunc, meta] = firstCall;
        const loading = loadingFunc({
            Users: { profile: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise.mock.calls.length).toEqual(1);
        expect(method.name).toEqual('getUserData');
        expect(type).toEqual('GET_USER_DATA');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual(undefined);
    });

    it('should call dispatch method for updating user data', () => {
        performUpdateUserData({
            address: 'Huyssenallee 2, 45128 Essen',
            dateOfBirth: 'Jan 11, 1987',
            name: 'John Smith',
            email: 'johnsmith@gmail.com',
            bankAccountNumber: '11122333455556666666'
        });

        const [firstCall] = dispatcher.dispatchPromise.mock.calls;
        const [method, type, loadingFunc, meta] = firstCall;
        const loading = loadingFunc({
            Users: { updatedProfile: { loading: 'TEST' } }
        });
        const [userData] = meta;
        expect(dispatcher.dispatchPromise.mock.calls.length).toEqual(1);
        expect(method.name).toEqual('updateUserData');
        expect(type).toEqual('UPDATE_USER_DATA');
        expect(loading).toEqual('TEST');
        expect(userData).toEqual({
            address: 'Huyssenallee 2, 45128 Essen',
            dateOfBirth: 'Jan 11, 1987',
            name: 'John Smith',
            email: 'johnsmith@gmail.com',
            bankAccountNumber: '11122333455556666666'
        });
    });

    it('should call dispatch method for resetting password', () => {
        performResetUserPassword('passwordToken', 'newPassword');

        const [firstCall] = dispatcher.dispatchPromise.mock.calls;
        const [method, type, loadingFunc, meta] = firstCall;
        const loading = loadingFunc({
            Users: { resetPassword: { loading: 'TEST' } }
        });
        const [resetPasswordToken, newPassword] = meta;
        expect(dispatcher.dispatchPromise.mock.calls.length).toEqual(1);
        expect(method.name).toEqual('resetUserPassword');
        expect(type).toEqual('RESET_USER_PASSWORD');
        expect(loading).toEqual('TEST');
        expect(resetPasswordToken).toEqual('passwordToken');
        expect(newPassword).toEqual('newPassword');
    });

    it('should call dispatch method for creating reset password link', () => {
        performCreateResetPasswordToken('jhon.doe@test.com');

        const [firstCall] = dispatcher.dispatchPromise.mock.calls;
        const [method, type, loadingFunc, meta] = firstCall;
        const loading = loadingFunc({
            Users: { createdPasswordToken: { loading: 'TEST' } }
        });
        const [email] = meta;
        expect(dispatcher.dispatchPromise.mock.calls.length).toEqual(1);
        expect(method.name).toEqual('createResetPasswordToken');
        expect(type).toEqual('CREATE_RESET_PASSWORD_TOKEN');
        expect(loading).toEqual('TEST');
        expect(email).toEqual('jhon.doe@test.com');
    });

    it('should call dispatch method for verifying reset password token', () => {
        performVerifyResetPasswordToken('token');

        const [firstCall] = dispatcher.dispatchPromise.mock.calls;
        const [method, type, loadingFunc, meta] = firstCall;
        const loading = loadingFunc({
            Users: { verifiedPasswordToken: { loading: 'TEST' } }
        });
        const [token] = meta;
        expect(dispatcher.dispatchPromise.mock.calls.length).toEqual(1);
        expect(method.name).toEqual('verifyResetPasswordToken');
        expect(type).toEqual('VERIFY_RESET_PASSWORD_TOKEN');
        expect(loading).toEqual('TEST');
        expect(token).toEqual('token');
    });
});
