import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash.pick';
import classNames from 'classnames';
import './Checkbox.css';

class Checkbox extends Component {
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

    handleChange(event) {
        this.setState({ checked: event.target.checked });
        this.props.onChange(event);
    }

    handleFocus(event) {
        this.setState({ hasFocus: true });
        this.props.onFocus(event);
    }

    handleBlur(event) {
        this.setState({ hasFocus: false });
        this.props.onBlur(event);
    }

    render() {
        const { className, name, value, error, label, required, disabled, helpText } = this.props;
        const { checked, hasFocus } = this.getState();
        const classes = classNames(
            'checkbox',
            hasFocus && !disabled && 'checkbox--has-focus',
            required && !disabled && 'checkbox--required',
            disabled && 'checkbox--disabled',
            className
        );

        return (
            <div className={classes}>
                <label className="checkbox-wrapper">
                    <input
                        className="checkbox-native-control"
                        name={name}
                        type="checkbox"
                        value={value}
                        disabled={disabled}
                        checked={checked}
                        onFocus={event => this.handleFocus(event)}
                        onBlur={event => this.handleBlur(event)}
                        onChange={event => this.handleChange(event)}
                    />
                    <span className="checkbox-control" aria-hidden />
                    {label && <span className="checkbox-label">{label}</span>}
                </label>
                {error && (
                    <div role="alert" className="checkbox-error" aria-live="polite">
                        {error}
                    </div>
                )}
                {helpText && <small className="checkbox-help-text">{helpText}</small>}
            </div>
        );
    }
}

Checkbox.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    id: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    checked: PropTypes.bool,
    checkedDefault: PropTypes.bool,
    label: PropTypes.node,
    error: PropTypes.node,
    helpText: PropTypes.node,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func
};
Checkbox.defaultProps = {
    disabled: false,
    checkedDefault: false,
    onFocus: () => {},
    onBlur: () => {},
    onChange: () => {}
};

export default Checkbox;
