import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash.pick';
import classNames from 'classnames';
import './RadioButton.css';

class RadioButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: props.checkedDefault,
            hasFocus: false
        };
    }

    getState() {
        return { ...this.state, ...pick(this.props, ['checked']) };
    }

    handleFocus(event) {
        this.setState({ hasFocus: true });
        this.props.onFocus(event);
    }

    handleBlur(event) {
        this.setState({ hasFocus: false });
        this.props.onBlur(event);
    }

    handleChange(event) {
        this.setState({ checked: event.target.checked });
        this.props.onChange(event);
    }

    render() {
        const { className, name, value, error, label, required, disabled, helpText } = this.props;
        const { hasFocus, checked } = this.getState();
        const classes = classNames(
            'radio-button',
            hasFocus && !disabled && 'radio-button--has-focus',
            required && !disabled && 'radio-button--required',
            disabled && 'radio-button--disabled',
            className
        );

        return (
            <div className={classes}>
                {error && <small className="radio-button-error">{error}</small>}
                <label className="radio-button-wrapper">
                    <input
                        className="radio-button-native-control"
                        name={name}
                        type="radio"
                        value={value}
                        disabled={disabled}
                        checked={checked}
                        onFocus={event => this.handleFocus(event)}
                        onBlur={event => this.handleBlur(event)}
                        onChange={event => this.handleChange(event)}
                    />
                    <span className="radio-button-control" aria-hidden />
                    {label && <span className="radio-button-label">{label}</span>}
                </label>
                {helpText && <small className="radio-button-help-text">{helpText}</small>}
            </div>
        );
    }
}

RadioButton.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    id: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    checked: PropTypes.bool,
    checkedDefault: PropTypes.bool,
    label: PropTypes.string,
    error: PropTypes.node,
    helpText: PropTypes.node,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};
RadioButton.defaultProps = {
    disabled: false,
    checkedDefault: false,
    onFocus: () => {},
    onBlur: () => {},
    onChange: () => {}
};

export default RadioButton;
