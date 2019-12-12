import React from 'react';
import { shallow } from 'enzyme';
import RadioButton from '../RadioButton';

function renderComponent({ id = 'test', name = 'test', ...otherProps } = {}, mountFn = shallow) {
    return mountFn(<RadioButton id={id} name={name} {...otherProps} />);
}

describe('<RadioButton /> component', () => {
    it('should render with necessary elements', () => {
        const radioButton = renderComponent({ label: 'Test' });

        expect(radioButton.find('.radio-button')).toHaveLength(1);
        expect(radioButton.find('input[type="radio"].radio-button-native-control')).toHaveLength(1);
        expect(radioButton.find('.radio-button-control')).toHaveLength(1);
        expect(radioButton.contains(<span className="radio-button-label">Test</span>)).toBeTruthy();
        expect(radioButton.find('input.radio-button-native-control').props().disabled).toBeFalsy();
    });

    it('should render with help text', () => {
        const radioButton = renderComponent({ helpText: 'lorem ipsum' });

        expect(radioButton.contains(<small className="radio-button-help-text">lorem ipsum</small>)).toBeTruthy();
    });

    it('should render with error', () => {
        const radioButton = renderComponent({ error: 'this is required field' });

        expect(radioButton.contains(<small className="radio-button-error">this is required field</small>)).toBeTruthy();
    });

    it('should render with necessary class if radio button is required', () => {
        const radioButton = renderComponent({ label: 'Required', required: true });

        expect(radioButton.hasClass('radio-button--required')).toBeTruthy();
    });

    it('should render with necessary class if radio button is disabled', () => {
        const checkbox = renderComponent({ label: 'Disabled', required: true, disabled: true });

        expect(checkbox.hasClass('radio-button--disabled')).toBeTruthy();
        expect(checkbox.hasClass('radio-button--required')).toBeFalsy();
        expect(checkbox.find('input.radio-button-native-control').props().disabled).toBeTruthy();
    });

    it('should not throw an error if `onFocus` property is not given', () => {
        const radioButton = renderComponent();

        expect(() => {
            radioButton.find('.radio-button-native-control').simulate('focus', new FocusEvent('focus'));
        }).not.toThrow();
    });

    it('should handle focus event', () => {
        const onFocus = jest.fn();
        const event = new FocusEvent('focus');
        const radioButton = renderComponent({ onFocus });
        radioButton.find('.radio-button-native-control').simulate('focus', event);
        radioButton.update();

        expect(radioButton.hasClass('radio-button--has-focus')).toBeTruthy();
        expect(onFocus).toHaveBeenCalledWith(event);
    });

    it('should not throw an error if `onBlur` property is not given', () => {
        const radioButton = renderComponent();

        expect(() => {
            radioButton.find('.radio-button-native-control').simulate('blur', new FocusEvent('blur'));
        }).not.toThrow();
    });

    it('should handle blur event', () => {
        const onBlur = jest.fn();
        const event = new FocusEvent('blur');
        const radioButton = renderComponent({ onBlur });
        radioButton.setState({ hasFocus: true });
        radioButton.update();
        radioButton.find('.radio-button-native-control').simulate('blur', event);
        radioButton.update();

        expect(radioButton.hasClass('radio-button--has-focus')).toBeFalsy();
        expect(onBlur).toHaveBeenCalledWith(event);
    });

    it('should not throw an error if `onChange` property is not given', () => {
        const radioButton = renderComponent();

        expect(() => {
            radioButton.instance().props.onChange(new Event('change'));
        }).not.toThrow();
    });

    it("should update component's state and call `onChange` callback", () => {
        const onChangeStub = jest.fn();
        const eventStub = { target: { name: 'test', checked: true } };
        const radioButton = renderComponent({ onChange: onChangeStub });

        radioButton.find('.radio-button-native-control').simulate('change', eventStub);
        radioButton.update();

        expect(radioButton.instance().state.checked).toBeTruthy();
        expect(onChangeStub).toHaveBeenCalledWith(eventStub);
    });
});
