import React from 'react';
import { mount } from 'enzyme';
import { KEYBOARD_KEY_VALUES } from '../../../constants';
import DateField from '../DateField';

function renderComponent({ label = 'test', name = 'test', ...otherProps } = {}) {
    const dateField = mount(<DateField label={label} name={name} {...otherProps} />);

    jest.spyOn(dateField.instance().dateFieldRef, 'getBoundingClientRect').mockReturnValue({ top: 450 });
    return dateField;
}

describe('<DateField /> component', () => {
    it('should renders without errors', () => {
        renderComponent({ value: Date.now() });
    });

    it('should shows and hides <DatePicker />', () => {
        const eventStub = { preventDefault: jest.fn() };
        const dateField = renderComponent();

        // Close on cancel button click
        dateField
            .find('.date-field-addon')
            .props()
            .onClick(eventStub);
        dateField.update();
        expect(dateField.find('DatePicker')).toHaveLength(1);
        expect(eventStub.preventDefault).toHaveBeenCalledTimes(1);

        dateField
            .find('DatePicker')
            .props()
            .onCancel();
        dateField.update();
        expect(dateField.find('DatePicker')).toHaveLength(0);

        // Close on confirm button click
        dateField
            .find('.date-field-addon')
            .props()
            .onClick(eventStub);
        dateField.update();
        dateField
            .find('DatePicker')
            .props()
            .onConfirm(new Date());
        dateField.update();
        expect(eventStub.preventDefault).toHaveBeenCalledTimes(2);
        expect(dateField.find('DatePicker')).toHaveLength(0);

        // Close on click outside of <DatePicker /> component
        dateField
            .find('.date-field-addon')
            .props()
            .onClick(eventStub);
        dateField.update();
        document.body.dispatchEvent(new MouseEvent('click'));
        dateField.update();
        expect(eventStub.preventDefault).toHaveBeenCalledTimes(3);
        expect(dateField.find('DatePicker')).toHaveLength(0);
    });

    it('should calculate correct <DatePicker /> position', () => {
        const eventStub = { preventDefault: jest.fn() };
        const dateField = renderComponent({ value: Date.now() });

        dateField
            .find('.date-field-addon')
            .props()
            .onClick(eventStub);
        dateField.update();
        expect(dateField.find('DatePicker').props().position).toBe('top');

        jest.spyOn(dateField.instance().dateFieldRef, 'getBoundingClientRect').mockReturnValue({ top: 200 });
        dateField
            .find('.date-field-addon')
            .props()
            .onClick(eventStub);
        dateField.update();
        expect(dateField.find('DatePicker').props().position).toBe('bottom');
    });

    it('should not throw an error if `onChange` property is not given', () => {
        const dateField = renderComponent({ onChange: undefined });

        expect(() => {
            dateField.instance().props.onChange();
        }).not.toThrow();
    });

    it('should resets value and calls onChange callback when remove date', () => {
        const onChangeStub = jest.fn();
        const dateDummy = new Date();
        const timestamp = parseInt(dateDummy.getTime() / 1000, 10);
        const dateField = renderComponent({ defaultValue: timestamp, onChange: onChangeStub });

        dateField
            .find('TextField')
            .props()
            .onFocus();
        dateField.update();

        dateField
            .find('TextField')
            .props()
            .onChange({ target: { value: '19.11.2029' } });

        dateField
            .find('TextField')
            .props()
            .onKeyDown({ key: KEYBOARD_KEY_VALUES.ENTER });

        expect(dateField.state().value).toBe(timestamp);
        expect(onChangeStub).toHaveBeenCalledWith({
            name: 'test',
            value: `${parseInt(new Date('11.19.2029').getTime() / 1000, 10)}`
        });
    });

    it('should updates state and calls onChange callback when select date', () => {
        const eventStub = { preventDefault: jest.fn() };
        const onChangeStub = jest.fn();
        const dateDummy = new Date();
        const timestamp = parseInt(dateDummy.getTime() / 1000, 10);
        const dateField = renderComponent({ onChange: onChangeStub });

        dateField
            .find('.date-field-addon')
            .props()
            .onClick(eventStub);
        dateField.update();
        dateField
            .find('DatePicker')
            .props()
            .onChange(dateDummy);
        expect(dateField.state().value).toEqual(timestamp);
        expect(onChangeStub).toHaveBeenCalledWith({ name: 'test', value: timestamp });
    });

    it('should calls onChange callback when confirm selected date', () => {
        const eventStub = { preventDefault: jest.fn() };
        const onChangeStub = jest.fn();
        const dateDummy = new Date();
        const timestamp = parseInt(dateDummy.getTime() / 1000, 10);
        const dateField = renderComponent({ defaultValue: timestamp, onChange: onChangeStub });

        dateField
            .find('.date-field-addon')
            .props()
            .onClick(eventStub);
        dateField.update();
        dateField
            .find('DatePicker')
            .props()
            .onConfirm(dateDummy);
        expect(onChangeStub).toHaveBeenCalledWith({ name: 'test', value: timestamp });
    });

    it('should calls onChange callback with initialValue when cancel selected date', () => {
        const eventStub = { preventDefault: jest.fn() };
        const onChangeStub = jest.fn();
        const dateDummy = new Date();
        const newDateDummy = new Date(1970, 0, 1);
        const timestamp = parseInt(dateDummy.getTime() / 1000, 10);
        const dateField = renderComponent({ defaultValue: timestamp, onChange: onChangeStub });

        dateField
            .find('.date-field-addon')
            .props()
            .onClick(eventStub);
        dateField.update();
        dateField
            .find('DatePicker')
            .props()
            .onChange(newDateDummy);
        dateField
            .find('DatePicker')
            .props()
            .onCancel();
        expect(dateField.state().value).toBe(timestamp);
        expect(onChangeStub).toHaveBeenCalledWith({ name: 'test', value: timestamp });
    });

    it('should not throw an error if `onFocus` property is not given', () => {
        const dateField = renderComponent();

        expect(() => {
            dateField.instance().props.onFocus();
        }).not.toThrow();
    });

    it('should call `onFocus` callback', () => {
        const timestamp = parseInt(Date.now() / 1000, 10);
        const onFocusStub = jest.fn();
        const dateField = renderComponent({ onFocus: onFocusStub, value: timestamp });

        dateField
            .find('TextField')
            .props()
            .onFocus();
        dateField.update();

        expect(onFocusStub).toHaveBeenCalledWith({ name: 'test', value: timestamp });
    });

    it('should not throw an error if `onBlur` property is not given', () => {
        const dateField = renderComponent();

        expect(() => {
            dateField.instance().props.onBlur();
        }).not.toThrow();
    });

    it('should call `onBlur` callback', () => {
        const timestamp = parseInt(new Date('09.01.2019').getTime() / 1000, 10);
        const onBlurStub = jest.fn();
        const dateField = renderComponent({ onBlur: onBlurStub, value: timestamp });

        dateField.find('TextField').simulate('click');
        dateField
            .find('TextField')
            .props()
            .onFocus();
        dateField
            .find('TextField')
            .props()
            .onChange({ target: { value: '29.01.2019' } }); // German format dd.mm.yyyy
        dateField
            .find('TextField')
            .props()
            .onKeyDown({ key: KEYBOARD_KEY_VALUES.ENTER });
        dateField.update();

        expect(dateField.find('TextField').props().value).toBe('Sep 01, 2019'); // German handwritten format
        expect(onBlurStub).toHaveBeenCalledWith({
            name: 'test',
            value: `${parseInt(new Date('01.29.2019').getTime() / 1000, 10)}`
        });
    });

    it('should call handle input value based on edit mask', () => {
        const timestamp = parseInt(new Date('09.01.2019').getTime() / 1000, 10);
        const onChangeStub = jest.fn();
        const dateField = renderComponent({ onChange: onChangeStub, value: timestamp });

        dateField.find('TextField').simulate('click');
        dateField
            .find('TextField')
            .props()
            .onFocus();
        dateField
            .find('TextField')
            .props()
            .onChange({ target: { value: '12032019abcde' } });
        dateField
            .find('TextField')
            .props()
            .onKeyDown({ key: KEYBOARD_KEY_VALUES.ENTER });
        dateField.update();

        expect(onChangeStub).toHaveBeenCalledWith({
            name: 'test',
            value: `${parseInt(new Date('03.12.2019').getTime() / 1000, 10)}`
        });
    });

    it('should correctly handle null input', () => {
        const onChangeStub = jest.fn();
        const dateField = renderComponent({ onChange: onChangeStub, value: null });

        dateField.find('TextField').simulate('click');
        dateField
            .find('TextField')
            .props()
            .onFocus();
        dateField
            .find('TextField')
            .props()
            .onKeyDown({ key: KEYBOARD_KEY_VALUES.Q });
        dateField
            .find('TextField')
            .props()
            .onKeyDown({ key: KEYBOARD_KEY_VALUES.ENTER });
        dateField.update();

        expect(onChangeStub).toHaveBeenCalledWith({
            name: 'test',
            value: ''
        });
    });
});
