import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import pickMeUp from 'pickmeup';
import './DatePicker.css';

export const DateLabelsPropType = PropTypes.shape({
    days: PropTypes.arrayOf(PropTypes.string).isRequired,
    daysShort: PropTypes.arrayOf(PropTypes.string).isRequired,
    daysMin: PropTypes.arrayOf(PropTypes.string).isRequired,
    months: PropTypes.arrayOf(PropTypes.string).isRequired,
    monthsShort: PropTypes.arrayOf(PropTypes.string).isRequired
});

class DatePicker extends Component {
    constructor(props) {
        super(props);

        this.handleBodyClick = this.handleBodyClick.bind(this);
        this.handlePickMeUpChange = this.handlePickMeUpChange.bind(this);
        this.datepicker = null;
    }

    componentDidMount() {
        const { date, labels } = this.props;

        this.datepicker = pickMeUp(this.datePickerRef, {
            flat: true,
            date: date,
            locale: 'default',
            locales: { default: labels },
            prev: '',
            next: ''
        });
        this.datePickerRef.addEventListener('pickmeup-change', this.handlePickMeUpChange);
        document.body.addEventListener('click', this.handleBodyClick);
    }

    componentDidUpdate() {
        this.datepicker.set_date(this.props.date);
    }

    componentWillUnmount() {
        this.datePickerRef.removeEventListener('pickmeup-change', this.handlePickMeUpChange);
        this.datepicker.destroy();
        document.body.removeEventListener('click', this.handleBodyClick);
    }

    handleBodyClick(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.onClickOutside(event);
        }
    }

    handlePickMeUpChange(event) {
        const { onChange } = this.props;
        onChange && onChange(event.detail.date);
    }

    handleConfirmClick() {
        const { onConfirm } = this.props;
        onConfirm && onConfirm(this.datepicker.get_date());
    }

    render() {
        const { className, position, onCancel } = this.props;
        const classes = classNames('date-picker', `date-picker--${position}`, className);

        return (
            <div ref={wrapperRef => (this.wrapperRef = wrapperRef)} className={classes}>
                <div ref={ref => (this.datePickerRef = ref)} />
                <footer className="date-picker-actions">
                    <button onClick={onCancel}>Cancel</button>
                    <button onClick={() => this.handleConfirmClick()}>Ok</button>
                </footer>
            </div>
        );
    }
}

DatePicker.propTypes = {
    className: PropTypes.string,
    position: PropTypes.oneOf(['top', 'bottom']),
    labels: DateLabelsPropType.isRequired,
    date: PropTypes.instanceOf(Date),
    onChange: PropTypes.func,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    onClickOutside: PropTypes.func
};
DatePicker.defaultProps = {
    position: 'top',
    date: new Date(),
    onClickOutside: () => {}
};

export default DatePicker;
