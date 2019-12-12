import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import pick from 'lodash.pick';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faChevronDown from '@fortawesome/fontawesome-free-solid/faChevronDown';
import { KEYBOARD_KEY_VALUES } from '../../constants';
import './SelectField.css';

export const OptionPropType = PropTypes.oneOfType([
    PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
        disabled: PropTypes.bool
    }),
    PropTypes.string
]);

class SelectField extends Component {
    constructor(props) {
        super(props);

        this.handleBodyClick = this.handleBodyClick.bind(this);
        this.state = {
            value: props.defaultValue,
            isFocused: false
        };
    }

    getState() {
        return { ...this.state, ...pick(this.props, ['value']) };
    }

    componentDidMount() {
        document.body.addEventListener('click', this.handleBodyClick);
    }

    componentWillUnmount() {
        document.body.removeEventListener('click', this.handleBodyClick);
    }

    handleBodyClick(event) {
        this.setState({
            isFocused:
                this.state.isFocused && !event.target.classList.contains('options-list-item')
                    ? false
                    : !!(this.layoutRef.compareDocumentPosition(event.target) & Node.DOCUMENT_POSITION_CONTAINED_BY)
        });
    }

    handleOptionClick(value) {
        const { onChange, name } = this.props;

        this.setState({ value, isFocused: false });
        onChange && onChange({ name, value });
    }

    handleOptionEnterPress(event, value) {
        const { onChange, name } = this.props;
        if (event.key === KEYBOARD_KEY_VALUES.ENTER) {
            this.setState({ value, isFocused: false });
            onChange && onChange({ name, value });
        }
    }

    getSelectedOption() {
        const { options, supportEmptyValue } = this.props;
        const { value } = this.getState();
        const [selectedOption = {}] = options;

        for (let i = 0; i < options.length; i += 1) {
            const option = options[i];
            if (value === option.value || value === option) {
                return option;
            }
        }

        if (supportEmptyValue) {
            return '';
        }

        return selectedOption;
    }

    renderOptions(selectedOption) {
        const { options } = this.props;
        const renderedOptions = [];

        for (let i = 0; i < options.length; i += 1) {
            const option = options[i];
            let isSelected, label, value;

            if (typeof option === 'string') {
                label = option;
                value = option;
                isSelected = selectedOption === value;
            } else {
                label = option.label || option.value;
                value = option.value;
                isSelected = selectedOption.value === value;
            }

            const classes = classNames(
                'options-list-item',
                option.disabled && 'options-list-item--disabled',
                isSelected && 'options-list-item--selected'
            );
            const onClick = option.disabled ? event => event.preventDefault() : () => this.handleOptionClick(value);

            renderedOptions.push(
                <li
                    key={i}
                    className={classes}
                    onClick={onClick}
                    tabIndex={0}
                    role="option"
                    aria-selected={isSelected}
                    onKeyUp={event => this.handleOptionEnterPress(event, value)}
                >
                    {label}
                </li>
            );
        }

        return renderedOptions;
    }

    handleFieldEnterPress(event) {
        if (event.key === KEYBOARD_KEY_VALUES.ENTER) {
            this.setState({
                isFocused: !this.state.isFocused
            });
        }
    }

    render() {
        const { id = Date.now(), className, label, assistiveLabel, disabled, required, error } = this.props;
        const { isFocused } = this.getState();
        const listBoxId = `listbox-${id}`;
        const classes = classNames(
            'select-field',
            isFocused && 'select-field--focused',
            disabled && 'select-field--disabled',
            className
        );
        const listboxClass = classNames('options-list', !isFocused && 'options-list-item--hide');
        const selectedOption = this.getSelectedOption();
        const labelContent = required ? (
            <Fragment>
                {label} <sup className="select-field-asterisk">*</sup>
            </Fragment>
        ) : (
            label
        );

        return (
            <div id={id} className={classes}>
                <div
                    className="select-field-layout"
                    ref={ref => (this.layoutRef = ref)}
                    tabIndex={disabled ? -1 : 0}
                    onKeyUp={event => this.handleFieldEnterPress(event)}
                >
                    {label && <label className="select-field-label">{labelContent}</label>}
                    <div
                        className="select-field-input"
                        aria-label={label || assistiveLabel}
                        aria-expanded={!!isFocused ? true : undefined}
                        aria-controls={listBoxId}
                    >
                        <div role="button" className="select-control" aria-label="Show select options">
                            <strong className="select-control-text">
                                {typeof selectedOption === 'string'
                                    ? selectedOption
                                    : selectedOption.label || selectedOption.value}
                            </strong>
                            <FontAwesomeIcon className="select-control-icon" icon={faChevronDown} />
                        </div>
                        <ul id={listBoxId} className={listboxClass} role="listbox">
                            {this.renderOptions(selectedOption)}
                        </ul>
                    </div>
                </div>
                {error && (
                    <div role="alert" className="select-field-error" aria-live="polite">
                        {error}
                    </div>
                )}
            </div>
        );
    }
}

SelectField.propTypes = {
    className: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    label: PropTypes.string,
    assistiveLabel: PropTypes.string,
    options: PropTypes.arrayOf(OptionPropType),
    defaultValue: OptionPropType,
    value: OptionPropType,
    required: PropTypes.bool,
    error: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    supportEmptyValue: PropTypes.bool
};
SelectField.defaultProps = {
    assistiveLabel: 'Select control',
    options: [],
    defaultValue: '',
    supportEmptyValue: false
};

export default SelectField;
