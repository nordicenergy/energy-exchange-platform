import React, { Component, Fragment } from 'react';
import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import pick from 'lodash.pick';
import './TextField.css';

class TextField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue,
            hasFocus: props.hasFocus
        };
    }

    getState() {
        return { ...this.state, ...pick(this.props, ['value', 'hasFocus']) };
    }

    handleFocus(event) {
        const { onFocus } = this.props;

        this.setState({ hasFocus: true });
        onFocus && onFocus(event);
    }

    handleBlur(event) {
        const { onBlur } = this.props;

        this.setState({ hasFocus: false });
        onBlur && onBlur(event);
    }

    handleChange(event) {
        const { onChange } = this.props;
        const { value } = event.target;

        this.setState({ value });
        onChange && onChange(event);
    }

    render() {
        const {
            className,
            darkMode,
            label,
            id,
            type,
            name,
            disabled,
            placeholder,
            addon,
            helperText,
            required,
            multiLine,
            mask,
            maskChar,
            beforeMaskedValueChange,
            error,
            onKeyDown
        } = this.props;
        const { value, hasFocus } = this.getState();
        const classes = classNames(
            'text-field',
            multiLine && 'text-field--multiline',
            hasFocus && 'text-field--focused',
            error && 'text-field--error',
            darkMode && 'text-field--dark',
            disabled && 'text-field--disabled',
            className
        );
        const Input = mask ? InputMask : multiLine ? 'textarea' : 'input';
        const labelContent = required ? (
            <Fragment>
                {label} <sup className="text-field-asterisk">*</sup>
            </Fragment>
        ) : (
            label
        );

        const inputProps = {
            className: 'text-field-input',
            id,
            disabled,
            type,
            name,
            mask,
            placeholder,
            autoComplete: name,
            value: value || '',
            onChange: event => this.handleChange(event),
            onFocus: event => this.handleFocus(event),
            onBlur: event => this.handleBlur(event),
            onKeyDown
        };

        // Specific props for MaskInput
        if (inputProps.mask) {
            inputProps.maskChar = maskChar;
            inputProps.beforeMaskedValueChange = beforeMaskedValueChange;
        }

        return (
            <div className={classes}>
                <label className="text-field-layout">
                    <strong className="text-field-label">{labelContent}</strong>
                    <span className="text-field-input-group">
                        <Input {...inputProps} />
                        {addon && <span className="text-field-addon">{addon}</span>}
                    </span>
                </label>
                {helperText && <small className="text-field-helper-text">{helperText}</small>}
                {error && (
                    <div role="alert" className="text-field-error" aria-live="polite">
                        {error}
                    </div>
                )}
            </div>
        );
    }
}

TextField.propTypes = {
    className: PropTypes.string,
    darkMode: PropTypes.bool,
    label: PropTypes.string.isRequired,
    id: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultValue: PropTypes.string,
    hasFocus: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    addon: PropTypes.node,
    helperText: PropTypes.node,
    required: PropTypes.bool,
    multiLine: PropTypes.bool,
    mask: PropTypes.string,
    maskChar: PropTypes.any,
    beforeMaskedValueChange: PropTypes.func,
    error: PropTypes.string
};
TextField.defaultProps = {
    darkMode: false,
    type: 'text',
    disabled: false,
    defaultValue: ''
};

export default TextField;
