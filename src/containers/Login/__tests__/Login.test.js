import React from 'react';
import { Login } from '../Login';
import { shallowWithIntl } from '../../../services/intlTestHelper';
import * as userActionPerformers from '../../../action_performers/users';
import * as notificationsActionPerformers from '../../../action_performers/notifications';

const historyMock = {
    push: jest.fn()
};
const routeMock = {
    location: {
        search: ''
    }
};
const routerMock = {
    history: historyMock,
    route: routeMock,
    getQueryParam: f => f
};
function renderComponent(props = {}, context = { router: routerMock }, mountFn = shallowWithIntl) {
    return mountFn(<Login {...props} />, { context });
}

describe('<Login /> Container', () => {
    afterEach(() => {
        historyMock.push.mockClear();
    });

    it(`should renders with:
        - login form
        - logo
        - illustration`, () => {
        const component = renderComponent();

        expect(component.find('LoginForm')).toHaveLength(1);
        expect(component.find('Logo')).toHaveLength(1);
        expect(component.find('Illustration')).toHaveLength(1);
    });

    it('should map state properties', () => {
        const stateMock = {
            Users: {
                login: {
                    loading: true,
                    data: { foo: 'bar' }
                }
            }
        };
        const props = Login.mapStateToProps(stateMock);

        expect(props.loading).toEqual(stateMock.Users.login.loading);
        expect(props.login).toEqual(stateMock.Users.login.data);
    });

    it('should opens restore password page after forgot password link was clicked', () => {
        const component = renderComponent();

        component
            .find('LoginForm')
            .props()
            .onForgotPasswordLinkClick();
        expect(historyMock.push).toHaveBeenCalledWith('/restore-password');
    });

    it('should pass default username from url query to LoginForm', () => {
        const component = renderComponent({}, { router: { ...routerMock, getQueryParam: () => 'demo@example.com' } });

        expect(component.find('LoginForm').props().defaultUsername).toBe('demo@example.com');
    });

    it('should validate credentials', () => {
        const component = renderComponent();
        const credentialsMock = {
            username: '',
            password: ''
        };
        // Disable console warning for the test.
        jest.spyOn(console, 'warn').mockImplementation(jest.fn());
        jest.spyOn(userActionPerformers, 'performLogin').mockImplementation(jest.fn());

        component
            .find('LoginForm')
            .props()
            .onSubmit(credentialsMock);
        expect(userActionPerformers.performLogin).not.toHaveBeenCalled();
        expect(component.state().errors).toHaveProperty('username');
        expect(component.state().errors).toHaveProperty('password');

        console.warn.mockRestore();
        userActionPerformers.performLogin.mockRestore();
    });

    it('should calls performLogin after form was submitted', () => {
        const component = renderComponent();
        const credentialsMock = {
            username: 'test-username',
            password: 'qwerty'
        };
        jest.spyOn(userActionPerformers, 'performLogin').mockImplementation(jest.fn());

        component
            .find('LoginForm')
            .props()
            .onSubmit(credentialsMock);
        expect(userActionPerformers.performLogin).toHaveBeenCalledWith(credentialsMock);

        userActionPerformers.performLogin.mockRestore();
    });

    it('should redirect to home page after authentication', () => {
        const component = renderComponent();

        component.setProps({ loading: true, login: {} });
        component.setProps({
            loading: false,
            login: { authentication: { authenticationToken: 'abc' } }
        });

        expect(historyMock.push).toHaveBeenCalledWith('/');
    });

    it('should redirect to /test after authentication', () => {
        const component = renderComponent(
            {},
            {
                router: {
                    ...routerMock,
                    route: {
                        location: {
                            search: '?next=%2Ftest'
                        }
                    }
                }
            }
        );

        component.setProps({ loading: true, login: {} });
        component.setProps({
            loading: false,
            login: { authentication: { authenticationToken: 'abc' } }
        });

        expect(historyMock.push).toHaveBeenCalledWith('/test');
    });

    it('should shows server error if authentication is failed', () => {
        jest.spyOn(notificationsActionPerformers, 'performPushNotification').mockImplementation(jest.fn());
        const component = renderComponent();

        component.setProps({
            loading: false,
            login: null,
            error: { message: 'Error message' }
        });

        expect(notificationsActionPerformers.performPushNotification).toHaveBeenCalledWith({
            type: 'error',
            message: 'Invalid username or password.'
        });

        notificationsActionPerformers.performPushNotification.mockRestore();
    });
});
