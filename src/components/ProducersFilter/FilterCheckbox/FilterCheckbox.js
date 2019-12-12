import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { OtherEnergyIcon, WindEnergyIcon, SolarEnergyIcon, BiomassEnergyIcon } from './icons';
import { PLANT_TYPES, KEYBOARD_KEY_VALUES } from '../../../constants';
import './FilterCheckbox.css';

class FilterCheckbox extends React.Component {
    handleFilterEnterPress(event) {
        const { onChange, name } = this.props;
        if (event.key === KEYBOARD_KEY_VALUES.ENTER) {
            onChange({
                target: {
                    name
                }
            });
        }
    }

    renderIcon() {
        switch (this.props.type) {
            case PLANT_TYPES.wind:
                return <WindEnergyIcon />;
            case PLANT_TYPES.solar:
                return <SolarEnergyIcon />;
            case PLANT_TYPES.biomass:
                return <BiomassEnergyIcon />;
            default:
                return <OtherEnergyIcon />;
        }
    }

    render() {
        const { className, label, name, checked, onChange } = this.props;
        const classes = classNames('filter-checkbox', className);
        return (
            <label className={classes} onKeyUp={event => this.handleFilterEnterPress(event)} tabIndex={0}>
                <input
                    className="filter-checkbox-input"
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                />
                <span className="filter-checkbox-label">
                    <span className="filter-checkbox-icon">{this.renderIcon()}</span>
                    <span className="filter-checkbox-text">{label}</span>
                </span>
            </label>
        );
    }
}

FilterCheckbox.propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(Object.keys(PLANT_TYPES).map(key => PLANT_TYPES[key])),
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func
};

export default FilterCheckbox;
