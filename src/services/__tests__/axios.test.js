import Axios from 'axios';
import { dispatcher } from '../../store';
import * as notificationsActions from '../../action_performers/notifications';
import * as usersActions from '../../action_performers/users';
import * as browserStorage from '../browserStorage';
import configureAxios from '../axios';
import history from '../history';

describe('Axios (AJAX) Configuration Service', () => {
    beforeEach(() => {
        browserStorage.getToken = jest.fn();
        browserStorage.getToken.mockReturnValue('test');
        dispatcher.dispatchAction = jest.fn();
        usersActions.performLogout = jest.fn();
        notificationsActions.performPushNotification = jest.fn();
        history.push = jest.fn();

        Axios.interceptors.response.use = jest.fn();
        Axios.interceptors.request.use = jest.fn();
    });

    it('should correctly setup axios interceptors when token already set', () => {
        configureAxios();

        expect(dispatcher.dispatchAction).toHaveBeenCalledTimes(1);
        expect(dispatcher.dispatchAction).toHaveBeenCalledWith('LOGIN', null, null, false);
        expect(Axios.interceptors.response.use).toHaveBeenCalled();
        expect(Axios.interceptors.request.use).toHaveBeenCalled();

        const [[, responseCallback]] = Axios.interceptors.response.use.mock.calls;
        responseCallback({ response: { status: 401 } });
        expect(usersActions.performLogout).toHaveBeenCalledTimes(1);
        expect(notificationsActions.performPushNotification).toHaveBeenCalledWith({
            message: 'Your session has expired.',
            type: 'error'
        });

        responseCallback({ response: { status: 403 } });
        expect(history.push).toHaveBeenCalledWith('/');
        expect(notificationsActions.performPushNotification).toHaveBeenCalledWith({
            message: 'Your are not authorized for this operation.',
            type: 'error'
        });

        expect(responseCallback.bind(null, { response: { status: 500 } })).toThrowError();

        const [[requestCallback]] = Axios.interceptors.request.use.mock.calls;
        expect(requestCallback({ test: 'test' })).toEqual({ headers: { Authorization: 'Bearer test' }, test: 'test' });
        expect(requestCallback({ test: 'test', headers: { test: 'test' } })).toEqual({
            headers: { Authorization: 'Bearer test', test: 'test' },
            test: 'test'
        });
    });

    it('should correctly setup axios interceptors when have no token', () => {
        browserStorage.getToken.mockReturnValue(null);
        configureAxios();

        expect(dispatcher.dispatchAction).not.toHaveBeenCalled();
        expect(Axios.interceptors.response.use).toHaveBeenCalled();
        expect(Axios.interceptors.request.use).toHaveBeenCalled();

        const [[requestCallback]] = Axios.interceptors.request.use.mock.calls;
        expect(requestCallback({ test: 'test' })).toEqual({ test: 'test' });
    });
});
