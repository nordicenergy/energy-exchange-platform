import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment/moment';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faCalendarAlt from '@fortawesome/fontawesome-free-solid/faCalendarAlt';

import TextField from '../TextField';
import mixDatePicker from './mixins/mixDatePicker';
import { DateLabelsPropType } from './DatePicker';
import { DATE_FORMAT, KEYBOARD_KEY_VALUES } from '../../constants';

import './DateField.css';

const DATE_EDIT_FORMAT = 'DD.MM.YYYY';
const MASKS = {
    EDIT: '99.99.9999',
    HANDWRITTEN: '*** 99, 9999'
};

class DateField extends mixDatePicker(Component) {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            editingValue: ''
        };
    }

    getValue() {
        const { fieldHasFocus, editingValue } = this.getState();
        return fieldHasFocus ? editingValue : this.handwrittenDateFormat();
    }

    handwrittenDateFormat() {
        const { value } = this.getState();

        if (!value || isNaN(value)) {
            return '';
        }

        return this.formatDate(value, DATE_FORMAT);
    }

    formatDate(value, format) {
        if (!value) {
            return '';
        }

        const date = new Date(value * 1000); // convert seconds to ms
        return moment(date).format(format);
    }

    handleFocus() {
        const { name, onFocus } = this.props;
        const { value } = this.getState();

        this.setState({
            fieldHasFocus: true,
            editingValue: this.formatDate(value, DATE_EDIT_FORMAT),
            showDatePicker: false
        });

        onFocus({ name, value });
    }

    handleBlur() {
        const { name, onBlur, onChange } = this.props;
        const { editingValue, value } = this.getState();

        const momentValue = moment(editingValue, DATE_EDIT_FORMAT);
        const finalValue = /[0-9]/.test(editingValue) ? (momentValue.isValid() ? momentValue.format('X') : value) : ''; // unix format - seconds

        this.setState({ fieldHasFocus: false, editingValue: this.formatDate(finalValue, DATE_EDIT_FORMAT) });

        onBlur({ name, value: finalValue });
        onChange({ name, value: finalValue });
    }

    handleKeyDown(event) {
        if (event.key === KEYBOARD_KEY_VALUES.ENTER) {
            return this.handleBlur();
        }

        return this.setState({
            fieldHasFocus: true
        });
    }

    handleKeyboardChange(event) {
        const { value } = event.target;
        this.setState({ editingValue: value });
    }

    render() {
        const { className, disabled, label, helperText, error, name, required } = this.props;
        const { fieldHasFocus } = this.getState();
        const datePickerIcon = (
            <span className="date-field-addon" onClick={event => this.openDatePicker(event)}>
                <FontAwesomeIcon icon={faCalendarAlt} />
            </span>
        );
        const classes = classNames('date-field', disabled && 'date-field--disabled', className);

        return (
            <div className={classes} ref={ref => (this.dateFieldRef = ref)}>
                <TextField
                    disabled={disabled}
                    label={label}
                    addon={datePickerIcon}
                    mask={fieldHasFocus ? MASKS.EDIT : MASKS.HANDWRITTEN}
                    maskChar={null}
                    helperText={helperText || (disabled ? '' : 'Editing format dd.mm.yyyy')}
                    required={required}
                    name={name}
                    value={this.getValue()}
                    error={error}
                    hasFocus={fieldHasFocus}
                    onFocus={event => this.handleFocus(event)}
                    onBlur={event => this.handleBlur(event)}
                    onKeyDown={event => this.handleKeyDown(event)}
                    onChange={event => this.handleKeyboardChange(event)}
                />
                {this.renderDatePicker()}
            </div>
        );
    }
}

DateField.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    helperText: PropTypes.string,
    datePickerLabels: DateLabelsPropType,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    error: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func
};

DateField.defaultProps = {
    datePickerLabels: {
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
    },
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {}
};

export default DateField;
