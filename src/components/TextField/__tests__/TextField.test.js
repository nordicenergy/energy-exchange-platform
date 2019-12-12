import React from 'react';
import InputMask from 'react-input-mask';
import { shallow } from 'enzyme';
import TextField from '../TextField';

const onChangeStub = jest.fn();
const onFocusStub = jest.fn();
const onBlurStub = jest.fn();
const onKeyDownStub = jest.fn();
function renderComponent(
    {
        label = 'Test',
        onChange = onChangeStub,
        onFocus = onFocusStub,
        onBlur = onBlurStub,
        onKeyDown = onKeyDownStub,
        ...otherProps
    } = {},
    mountFn = shallow
) {
    return mountFn(
        <TextField
            {...otherProps}
            label={label}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
        />
    );
}

describe('<TextField /> component', () => {
    beforeEach(() => {
        onChangeStub.mockClear();
        onFocusStub.mockClear();
        onBlurStub.mockClear();
        onKeyDownStub.mockClear();
    });

    it(`should renders:
        - label
        - input`, () => {
        const textField = renderComponent();

        expect(textField.find('.text-field-label')).toHaveLength(1);
        expect(textField.find('.text-field-label').text()).toBe('Test');
        expect(textField.find('.text-field-input')).toHaveLength(1);
    });

    it('should render with asterisk if field is required', () => {
        const textField = renderComponent({ required: true });

        expect(textField.find('.text-field-asterisk')).toHaveLength(1);
    });

    it('should render multiline field', () => {
        const textField = renderComponent({ multiLine: true });

        expect(textField.hasClass('text-field--multiline')).toBeTruthy();
        expect(textField.find('textarea')).toHaveLength(1);
    });

    it('should render masked field', () => {
        const textField = renderComponent({ mask: '99/99/9999' });
        expect(textField.find(InputMask)).toHaveLength(1);
    });

    it('should renders with helper text', () => {
        const helperTextDummy = 'Test helper text';
        const textField = renderComponent({ helperText: helperTextDummy });

        expect(textField.find('small.text-field-helper-text')).toHaveLength(1);
        expect(textField.find('small.text-field-helper-text').text()).toBe(helperTextDummy);
    });

    it('should renders with addon', () => {
        const addonDummy = 'Test addon';
        const textField = renderComponent({ addon: addonDummy });

        expect(textField.find('.text-field-addon')).toHaveLength(1);
        expect(textField.find('.text-field-addon').text()).toBe(addonDummy);
    });

    it('should renders with error', () => {
        const errorMock = 'Test error';
        const textField = renderComponent({ error: errorMock });

        expect(textField.hasClass('text-field--error')).toBeTruthy();
        expect(textField.find('.text-field-error')).toHaveLength(1);
        expect(textField.find('.text-field-error').text()).toBe(errorMock);
    });

    it('should adds class when field in focus', () => {
        const textField = renderComponent();

        textField.find('.text-field-input').simulate('focus');
        expect(textField.hasClass('text-field--focused')).toBeTruthy();
    });

    it('should calls onFocus callback when field was focused', () => {
        const textField = renderComponent();

        textField.find('.text-field-input').simulate('focus');
        expect(onFocusStub).toHaveBeenCalled();
    });

    it('should not calls onFocus if onFocus is not a function', () => {
        const textField = renderComponent({ onFocus: null });

        textField.find('.text-field-input').simulate('focus');
    });

    it('should calls onBlur callback when field was blurred', () => {
        const textField = renderComponent();

        textField.find('.text-field-input').simulate('blur');
        expect(onBlurStub).toHaveBeenCalled();
    });

    it('should not calls onBlur if onBlur is not a function', () => {
        const textField = renderComponent({ onBlur: null });

        textField.find('.text-field-input').simulate('blur');
    });

    it('should calls onChange callback when input value was changed', () => {
        const textField = renderComponent();
        const eventDummy = {
            target: {
                value: 'test'
            }
        };

        textField.find('.text-field-input').simulate('change', eventDummy);
        expect(onChangeStub).toHaveBeenCalledWith(eventDummy);
    });

    it('should not calls onChange if onChange is not a function', () => {
        const textField = renderComponent({ onChange: null });
        const eventDummy = {
            target: {
                value: 'test'
            }
        };

        textField.find('.text-field-input').simulate('change', eventDummy);
    });

    it('should calls onKeyDown callback', () => {
        const textField = renderComponent();
        const eventDummy = {
            key: 'Enter'
        };

        textField.find('.text-field-input').simulate('keyDown', eventDummy);
        expect(onKeyDownStub).toHaveBeenCalledWith(eventDummy);
    });
});
