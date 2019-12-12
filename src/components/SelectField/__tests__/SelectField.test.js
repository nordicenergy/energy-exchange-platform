import React from 'react';
import { shallow, mount } from 'enzyme';
import SelectField from '../SelectField';

const optionsDummy = [
    { value: 'wind', label: 'Wind' },
    { value: 'biomass (peat)', label: 'Biomass (peat)' },
    { value: 'biomass (corn)', label: 'Biomass (corn)' },
    { value: 'solar', label: 'Solar' },
    { value: 'renewable', label: 'Renewable' }
];
function renderComponent(
    { id = 'test', name = 'test', label, assistiveLabel, options = optionsDummy, ...otherProps } = {},
    mountFn = shallow
) {
    return mountFn(
        <SelectField
            id={id}
            name={name}
            label={label}
            assistiveLabel={assistiveLabel}
            options={options}
            {...otherProps}
        />
    );
}

describe('<SelectField /> component', () => {
    it('should renders without errors', () => {
        const selectField = renderComponent({}, mount);

        expect(selectField.instance().layoutRef.classList.contains('select-field-layout')).toBeTruthy();
    });

    it('should render with asterisk if select field is required', () => {
        const selectField = renderComponent({ required: true, label: 'Test label' });

        expect(selectField.find('.select-field-asterisk')).toHaveLength(1);
    });

    it('should renders with error', () => {
        const selectField = renderComponent({ error: 'test error' });

        expect(selectField.find('.select-field-error').text()).toBe('test error');
    });

    it('should display options when field in focus', () => {
        const selectField = renderComponent({}, mount);
        const eventMock = new Event('click');
        Object.defineProperty(eventMock, 'target', {
            writable: false,
            value: selectField.instance().layoutRef.firstElementChild
        });

        document.body.dispatchEvent(eventMock);
        selectField.update();
        expect(selectField.find('.options-list-item')).toHaveLength(5);
        expect(selectField.find('.options-list-item--selected')).toHaveLength(1);
        expect(selectField.hasClass('options-list-item--hide')).toBeFalsy();

        document.body.dispatchEvent(eventMock);
        selectField.update();
        expect(selectField.find('.options-list-item')).toHaveLength(5);
        expect(selectField.find('.options-list-item--hide')).toHaveLength(1);

        selectField.setState({ isFocused: true });
        expect(selectField.find('.options-list-item')).toHaveLength(5);
        expect(selectField.find('.options-list-item--hide')).toHaveLength(0);
    });

    it('should not select disabled option', () => {
        const selectField = renderComponent({
            defaultValue: 'wind',
            options: [
                { value: 'wind', label: 'Wind' },
                { value: 'biomass (peat)', label: 'Biomass (peat)', disabled: true },
                { value: 'biomass (corn)', label: '', disabled: true },
                { value: 'solar', label: 'Solar' },
                { value: 'renewable', label: 'Renewable' }
            ]
        });

        selectField.setState({ isFocused: true });
        selectField.update();
        selectField
            .find('.options-list-item')
            .at(2)
            .simulate('click', new Event('click'));
        expect(selectField.state().isFocused).toBeTruthy();
        expect(selectField.state().value).toEqual('wind');
    });

    it('should update state after some option was clicked', () => {
        const selectField = renderComponent({ options: ['wind', 'solar', 'biomass'] });

        selectField.setState({ isFocused: true });
        selectField.update();
        selectField
            .find('.options-list-item')
            .at(2)
            .simulate('click');
        expect(selectField.state().value).toEqual('biomass');
    });

    it('should call onChange callback after some option was clicked', () => {
        const onChangeMock = jest.fn();
        const selectField = renderComponent({ value: optionsDummy[1], onChange: onChangeMock });

        selectField.setState({ isFocused: true });
        selectField.update();
        selectField
            .find('.options-list-item')
            .at(2)
            .simulate('click');
        expect(onChangeMock).toHaveBeenCalledWith({ name: 'test', value: 'biomass (corn)' });
    });

    it('should call onChange callback after some option was selected by enter key press', () => {
        const onChangeMock = jest.fn();
        const selectField = renderComponent({ value: optionsDummy[1], onChange: onChangeMock });

        selectField.setState({ isFocused: true });
        selectField.update();
        selectField
            .find('.options-list-item')
            .at(2)
            .simulate('keyUp', { key: 'Enter' });
        expect(onChangeMock).toHaveBeenCalledWith({ name: 'test', value: 'biomass (corn)' });
    });

    it('should be focused by enter key press on field', () => {
        const selectField = renderComponent({ value: optionsDummy[1] });
        selectField.setState({
            isFocused: false
        });
        selectField.find('.select-field-layout').simulate('keyUp', { key: 'Enter' });
        expect(selectField.state('isFocused')).toEqual(true);
    });

    it('should remove event listener before component unmount', () => {
        jest.spyOn(document.body, 'removeEventListener');

        const selectField = renderComponent();
        const handleBodyClick = selectField.instance().handleBodyClick;

        selectField.unmount();
        expect(document.body.removeEventListener).toHaveBeenCalledWith('click', handleBodyClick);

        document.body.removeEventListener.mockRestore();
    });

    it('should provide possibility to render select with empty value by default', () => {
        const selectFieldWithEmptyValue = renderComponent({ value: null, supportEmptyValue: true });
        expect(selectFieldWithEmptyValue.find('strong.select-control-text').text()).toEqual('');

        const selectField = renderComponent({ value: null, supportEmptyValue: false });
        expect(selectField.find('strong.select-control-text').text()).toEqual(optionsDummy[0].label);
    });

    it('should set assistive label to aria attribute', () => {
        const selectField = renderComponent({ assistiveLabel: 'assistive label' });
        expect(selectField.find('.select-field-input').prop('aria-label')).toEqual('assistive label');

        selectField.setProps({ label: 'label' });

        expect(selectField.find('.select-field-input').prop('aria-label')).toEqual('label');
    });
});
