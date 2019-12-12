import Axios from 'axios';
import moment from 'moment';
import { SESSION_API_URL } from '../../constants';

export function create(userData) {
    const lang = document.documentElement.getAttribute('lang') || 'en';
    return Axios.post(`${SESSION_API_URL}/user/create?lang=${lang}`, userData);
}

export function login(credentials) {
    return Axios.post(`${SESSION_API_URL}/user/login`, credentials);
}

export function logout() {
    return Axios.get(`${SESSION_API_URL}/user/logout`);
}

export function getUserData() {
    return Axios.get(`${SESSION_API_URL}/user/getUserData`).then(response => {
        const { data = {} } = response;
        const { user = {} } = data;
        const { contract = {} } = user;
        const { startDate: contractStartDate = '', endDate: contractEndDate = '' } = contract;
        const birthdayData = user.birthday || '';
        return {
            data: {
                user: {
                    ...user,
                    birthday: moment(birthdayData).unix(), // convert to unix time stamp
                    contract: {
                        ...contract,
                        startDate: moment(contractStartDate).unix(), // convert to unix time stamp
                        endDate: moment(contractEndDate).unix() // convert to unix time stamp
                    }
                }
            }
        };
    });
}

export function updateUserData(userData) {
    return Axios.patch(`${SESSION_API_URL}/user/updateUserData`, userData);
}

export function resetUserPassword(resetToken, newPassword) {
    return Axios.patch(`${SESSION_API_URL}/user/resetPassword`, { resetToken, newPassword });
}

export function createResetPasswordToken(email) {
    const lang = document.documentElement.getAttribute('lang') || 'en';
    return Axios.post(`${SESSION_API_URL}/user/resetPasswordToken?lang=${lang}`, { email });
}

export function verifyResetPasswordToken(token) {
    return Axios.get(`${SESSION_API_URL}/user/resetPasswordToken/${token}`, {
        headers: { 'Cache-Control': 'no-cache' }
    });
}
