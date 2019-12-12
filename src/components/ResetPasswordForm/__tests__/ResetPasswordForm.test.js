import React from 'react';
import { shallow } from 'enzyme';
import ResetPasswordForm from '../ResetPasswordForm';

const labelsMock = {
    formTitle: 'Reset password',
    passwordField: 'Enter new password',
    confirmField: 'Re-enter new password',
    sendButton: 'Confirm',
    loginLink: 'Login'
};
const onSubmitMock = jest.fn();
const onLoginLinkClickMock = jest.fn();

function renderComponent(
    { labels = labelsMock, onSubmit = onSubmitMock, onLoginLinkClick = onLoginLinkClickMock } = {},
    mountFn = shallow
) {
    return mountFn(<ResetPasswordForm labels={labels} onSubmit={onSubmit} onLoginLinkClick={onLoginLinkClick} />);
}

describe('<ResetPasswordForm /> component', () => {
    it(`should renders:
        - form title
        - password field
        - confirm field
        - send button
        - login link`, () => {
        const component = renderComponent();

        expect(component.find('h3.reset-password-form-title')).toHaveLength(1);
        expect(component.find('TextField.password-field')).toHaveLength(1);
        expect(component.find('TextField.confirm-field')).toHaveLength(1);
        expect(component.find('Button')).toHaveLength(1);
        expect(component.find('a.login-link')).toHaveLength(1);
    });

    it('should update state if one of the fields value was changed', () => {
        const component = renderComponent();

        component
            .find('TextField.password-field')
            .props()
            .onChange({
                target: {
                    name: 'password',
                    value: 'qwerty'
                }
            });
        expect(component.state().password).toBe('qwerty');

        component
            .find('TextField.confirm-field')
            .props()
            .onChange({
                target: {
                    name: 'confirm',
                    value: 'qwerty123'
                }
            });
        expect(component.state().confirm).toBe('qwerty123');
    });

    it('should calls onSubmit callback when form was submitted', () => {
        const component = renderComponent();

        component.find('form').simulate('submit', { preventDefault: () => null });
        expect(onSubmitMock).toHaveBeenCalledWith(component.state().password, component.state().confirm);
    });

    it('should calls onLoginLinkClick callback when login link was clicked', () => {
        const component = renderComponent();

        component.find('.login-link').simulate('click', { preventDefault: () => null });
        expect(onLoginLinkClickMock).toHaveBeenCalled();
    });
});
