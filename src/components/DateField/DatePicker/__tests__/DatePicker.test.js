import React from 'react';
import { mount } from 'enzyme';
import DatePicker from '../DatePicker';

const labelsMock = {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
};
const onChangeMock = jest.fn();
const onConfirmMock = jest.fn();
function renderComponent(
    { labels = labelsMock, onChange = onChangeMock, onConfirm = onConfirmMock, ...otherProps } = {},
    mountFn = mount
) {
    return mountFn(<DatePicker labels={labels} onChange={onChange} onConfirm={onConfirm} {...otherProps} />);
}

describe('<DatePicker /> component', () => {
    afterEach(() => {
        onChangeMock.mockClear();
        onConfirmMock.mockClear();
    });

    it('should renders without errors and with necessary refs', () => {
        const datePicker = renderComponent();
        const handlePickMeUpChange = datePicker.instance().handlePickMeUpChange;
        const destroyMock = jest.spyOn(datePicker.instance().datepicker, 'destroy').mockImplementation(jest.fn());
        const removeEventListenerMock = jest
            .spyOn(datePicker.instance().datePickerRef, 'removeEventListener')
            .mockImplementation(jest.fn());

        expect(datePicker.instance().wrapperRef).toBeInstanceOf(HTMLDivElement);
        datePicker.unmount();
        expect(destroyMock).toHaveBeenCalled();
        expect(removeEventListenerMock).toHaveBeenCalledWith('pickmeup-change', handlePickMeUpChange);
    });

    it('should add and remove body event listeners on `componentDidMount` and `componentWillUnmount`', () => {
        jest.spyOn(window.document.body, 'addEventListener');
        jest.spyOn(window.document.body, 'removeEventListener');

        const datePicker = renderComponent();
        const bodyEventListener = datePicker.instance().handleBodyClick;

        expect(window.document.body.addEventListener).toHaveBeenCalledWith('click', bodyEventListener);

        datePicker.unmount();
        expect(window.document.body.removeEventListener).toHaveBeenCalledWith('click', bodyEventListener);
    });

    it('should renders with correct classes', () => {
        const datePicker = renderComponent({ position: 'bottom', className: 'custom-class' });

        expect(datePicker.html().includes('date-picker--bottom')).toBeTruthy();
        expect(datePicker.html().includes('custom-class')).toBeTruthy();
    });

    it('should calls onChange callback when day was selected', () => {
        const dateMock = new Date();
        const datePicker = renderComponent();
        const eventMock = new Event('pickmeup-change');
        Object.defineProperty(eventMock, 'detail', { value: { date: dateMock } });

        datePicker.instance().datePickerRef.dispatchEvent(eventMock);
        expect(onChangeMock).toHaveBeenCalledWith(dateMock);
    });

    it('should not calls onChange callback if onChange is not a function', () => {
        const dateMock = new Date();
        const datePicker = renderComponent({ onChange: null });
        const eventMock = new Event('pickmeup-change');
        Object.defineProperty(eventMock, 'detail', { value: { date: dateMock } });

        datePicker.instance().datePickerRef.dispatchEvent(eventMock);
        expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('should calls onConfirm callback when confirm button was clicked', () => {
        const dateMock = new Date();
        const datePicker = renderComponent();
        jest.spyOn(datePicker.instance().datepicker, 'get_date').mockReturnValue(dateMock);

        datePicker
            .find('button')
            .at(1)
            .simulate('click');
        expect(onConfirmMock).toHaveBeenCalledWith(dateMock);

        datePicker.instance().datepicker.get_date.mockRestore();
    });

    it('should not calls onConfirm callback if onConfirm is not a function', () => {
        const dateMock = new Date();
        const datePicker = renderComponent({ onConfirm: null });
        jest.spyOn(datePicker.instance().datepicker, 'get_date').mockReturnValue(dateMock);

        datePicker
            .find('button')
            .at(1)
            .simulate('click');
        expect(onConfirmMock).not.toHaveBeenCalled();

        datePicker.instance().datepicker.get_date.mockRestore();
    });

    it('should set new date when component was updated', () => {
        const dateMock = new Date();
        const datePicker = renderComponent();
        jest.spyOn(datePicker.instance().datepicker, 'set_date').mockImplementation(jest.fn());

        datePicker.setProps({ date: dateMock });
        expect(datePicker.instance().datepicker.set_date).toHaveBeenCalledWith(dateMock);

        datePicker.instance().datepicker.set_date.mockRestore();
    });

    it('should call `onClickOutside` when click outside of date picker', () => {
        const onClickOutsideStub = jest.fn();
        const eventStub = new MouseEvent('click');

        renderComponent({ onClickOutside: onClickOutsideStub });

        window.document.body.dispatchEvent(eventStub);
        expect(onClickOutsideStub).toHaveBeenCalledWith(eventStub);
    });

    it('should not call `onClickOutside` when click inside of date picker', () => {
        const onClickOutsideStub = jest.fn();
        const datePicker = renderComponent({ onClickOutside: onClickOutsideStub });
        const eventStub = new MouseEvent('click');

        Object.defineProperty(eventStub, 'target', { value: datePicker.instance().wrapperRef.firstElementChild });

        window.document.body.dispatchEvent(eventStub);
        expect(onClickOutsideStub).not.toHaveBeenCalled();
    });

    it('should not throw an error if `onClickOutside` property is not given', () => {
        const datePicker = renderComponent();

        expect(() => {
            datePicker.instance().props.onClickOutside();
        }).not.toThrow();
    });
});
