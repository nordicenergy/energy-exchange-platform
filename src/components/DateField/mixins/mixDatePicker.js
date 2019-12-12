import React from 'react';
import classNames from 'classnames';
import pick from 'lodash.pick';
import DatePicker from '../DatePicker/DatePicker';

const DATE_PICKER_HEIGHT = 362; // px
const HEADER_HEIGHT = 72; // px
const PAGE_TOP_OFFSET = DATE_PICKER_HEIGHT + HEADER_HEIGHT; // px
const SECOND = 1000; // ms

const mixDatePicker = Base =>
    class extends Base {
        constructor(props) {
            super(props);
            this.dateFieldRef = null;
            this.state = {
                initialValue: '',
                value: parseInt(props.defaultValue, 10),
                fieldHasFocus: false,
                showDatePicker: false,
                datePickerPosition: 'top'
            };
        }

        getState() {
            return { ...this.state, ...pick(this.props, ['value']) };
        }

        handleDatePickerChange(date) {
            const { onChange, name } = this.props;
            const value = parseInt(date.getTime() / SECOND, 10); // convert to seconds

            this.setState({ value });
            onChange({ name, value });
        }

        handleDatePickerOnCancel() {
            const { initialValue } = this.getState();
            const { onChange, name } = this.props;

            this.setState({ fieldHasFocus: false, showDatePicker: false, value: initialValue });
            onChange({ name, value: initialValue });
        }

        handleDatePickerConfirm(date) {
            this.setState({ fieldHasFocus: false, showDatePicker: false });
            this.handleDatePickerChange(date);
        }

        handleDatePickerClickOutside(event) {
            const { name, onBlur } = this.props;
            const { showDatePicker, value } = this.getState();

            if (showDatePicker && this.dateFieldRef && !this.dateFieldRef.contains(event.target)) {
                this.setState({ fieldHasFocus: false, showDatePicker: false });
                onBlur({ name, value });
            }
        }

        openDatePicker(event) {
            event.preventDefault();
            const { value } = this.getState();
            const dateFieldBounds = this.dateFieldRef ? this.dateFieldRef.getBoundingClientRect() : {};
            const datePickerPosition = dateFieldBounds.top >= PAGE_TOP_OFFSET ? 'top' : 'bottom';
            this.setState({ showDatePicker: true, initialValue: value, datePickerPosition });
        }

        renderDatePicker() {
            const { datePickerLabels } = this.props;
            const { value, showDatePicker, datePickerPosition } = this.getState();
            const classes = classNames('date-field-datepicker', `date-field-datepicker--${datePickerPosition}`);

            if (showDatePicker) {
                return (
                    <DatePicker
                        className={classes}
                        position={datePickerPosition}
                        labels={datePickerLabels}
                        date={!value || isNaN(value) ? new Date() : new Date(value * SECOND)}
                        onChange={date => this.handleDatePickerChange(date)}
                        onCancel={() => this.handleDatePickerOnCancel()}
                        onConfirm={date => this.handleDatePickerConfirm(date)}
                        onClickOutside={event => this.handleDatePickerClickOutside(event)}
                    />
                );
            }

            return null;
        }
    };

export default mixDatePicker;
