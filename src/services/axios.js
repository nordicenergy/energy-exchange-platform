import Axios from 'axios';
import { dispatcher } from '../store';
import { getToken } from './browserStorage';
import history from './history';
import { performPushNotification } from '../action_performers/notifications';
import { performLogout } from '../action_performers/users';
import { getTranslationOf } from './translations';

export default function configureAxios() {
    const token = getToken();

    if (token) {
        dispatcher.dispatchAction('LOGIN', null, null, false);
    }

    Axios.interceptors.response.use(null, error => {
        const { response: { status, config = { url: '' } } = {} } = error;
        const notLoginRequest = config.url.indexOf('/user/login') < 0;

        if (status === 401 && notLoginRequest) {
            performLogout();
            return performPushNotification({
                message: getTranslationOf('app.common.errors.sessionHasExpired'),
                type: 'error'
            });
        }

        if (status === 403) {
            performPushNotification({
                message: getTranslationOf('app.common.errors.notAuthorized'),
                type: 'error'
            });
            return history.push('/');
        }

        throw error;
    });

    // @TODO do not need if we use cookie with httpOnly
    Axios.interceptors.request.use(data => {
        const config = { ...data };

        const accessToken = getToken();

        if (accessToken) {
            if (!config.headers) {
                config.headers = {};
            }

            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    });
}
