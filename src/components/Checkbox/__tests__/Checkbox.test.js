import React from 'react';
import { shallow } from 'enzyme';
import Checkbox from '../Checkbox';

function renderComponent({ id = 'test', name = 'test', ...otherProps } = {}, mountFn = shallow) {
    return mountFn(<Checkbox id={id} name={name} {...otherProps} />);
}

describe('<Checkbox /> component', () => {
    it('should render with necessary elements', () => {
        const checkbox = renderComponent({ label: 'Test' });

        expect(checkbox.find('.checkbox')).toHaveLength(1);
        expect(checkbox.find('input[type="checkbox"].checkbox-native-control')).toHaveLength(1);
        expect(checkbox.find('.checkbox-control')).toHaveLength(1);
        expect(checkbox.contains(<span className="checkbox-label">Test</span>)).toBeTruthy();
        expect(checkbox.find('input.checkbox-native-control').props().disabled).toBeFalsy();
    });

    it('should render with help text', () => {
        const checkbox = renderComponent({ helpText: 'lorem ipsum' });

        expect(checkbox.contains(<small className="checkbox-help-text">lorem ipsum</small>)).toBeTruthy();
    });

    it('should render with error', () => {
        const checkbox = renderComponent({ error: 'this is required field' });

        expect(
            checkbox.contains(
                <div role="alert" className="checkbox-error" aria-live="polite">
                    this is required field
                </div>
            )
        ).toBeTruthy();
    });

    it('should render with necessary class if checkbox is required', () => {
        const checkbox = renderComponent({ label: 'Required', required: true });

        expect(checkbox.hasClass('checkbox--required')).toBeTruthy();
    });

    it('should render with necessary class if checkbox is disabled', () => {
        const checkbox = renderComponent({ label: 'Disabled', required: true, disabled: true });

        expect(checkbox.hasClass('checkbox--disabled')).toBeTruthy();
        expect(checkbox.hasClass('checkbox--required')).toBeFalsy();
        expect(checkbox.find('input.checkbox-native-control').props().disabled).toBeTruthy();
    });

    it('should not throw an error if `onFocus` property is not given', () => {
        const checkbox = renderComponent();

        expect(() => {
            checkbox.find('.checkbox-native-control').simulate('focus', new FocusEvent('focus'));
        }).not.toThrow();
    });

    it('should handle focus event', () => {
        const onFocus = jest.fn();
        const event = new FocusEvent('focus');
        const checkbox = renderComponent({ onFocus });
        checkbox.find('.checkbox-native-control').simulate('focus', event);
        checkbox.update();

        expect(checkbox.hasClass('checkbox--has-focus')).toBeTruthy();
        expect(onFocus).toHaveBeenCalledWith(event);
    });

    it('should not throw an error if `onBlur` property is not given', () => {
        const checkbox = renderComponent();

        expect(() => {
            checkbox.find('.checkbox-native-control').simulate('blur', new FocusEvent('blur'));
        }).not.toThrow();
    });

    it('should handle blur event', () => {
        const onBlur = jest.fn();
        const event = new FocusEvent('blur');
        const checkbox = renderComponent({ onBlur });
        checkbox.setState({ hasFocus: true });
        checkbox.update();
        checkbox.find('.checkbox-native-control').simulate('blur', event);
        checkbox.update();

        expect(checkbox.hasClass('checkbox--has-focus')).toBeFalsy();
        expect(onBlur).toHaveBeenCalledWith(event);
    });

    it('should not throw an error if `onChange` property is not given', () => {
        const checkbox = renderComponent();

        expect(() => {
            checkbox.instance().props.onChange(new Event('change'));
        }).not.toThrow();
    });

    it("should update component's state and call `onChange` callback", () => {
        const onChangeStub = jest.fn();
        const eventStub = { target: { name: 'test', checked: true } };
        const checkbox = renderComponent({ onChange: onChangeStub });

        checkbox.find('.checkbox-native-control').simulate('change', eventStub);
        checkbox.update();

        expect(checkbox.instance().state.checked).toBeTruthy();
        expect(onChangeStub).toHaveBeenCalledWith(eventStub);
    });
});
