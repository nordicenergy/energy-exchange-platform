import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSortAmountUp from '@fortawesome/fontawesome-free-solid/faSortAmountUp';
import faSortAmountDown from '@fortawesome/fontawesome-free-solid/faSortAmountDown';
import './SortOption.css';

export const ORDER_DESC = 'desc';
export const ORDER_ASC = 'asc';
export const NO_ORDER = null;

class SortOption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: NO_ORDER
        };
    }

    handleClick() {
        const { value, onChange } = this.props;
        const { order } = this.state;
        let newOrder;

        if (order === ORDER_DESC) {
            newOrder = ORDER_ASC;
        } else if (order === ORDER_ASC) {
            newOrder = NO_ORDER;
        } else {
            newOrder = ORDER_DESC;
        }

        this.setState({ order: newOrder });
        onChange && onChange({ [value]: newOrder });
    }

    renderIcon() {
        const { order } = this.state;

        if (order === ORDER_ASC) {
            return <FontAwesomeIcon icon={faSortAmountUp} />;
        }

        if (order === ORDER_DESC) {
            return <FontAwesomeIcon icon={faSortAmountDown} />;
        }

        return null;
    }

    render() {
        const { label } = this.props;
        const { order } = this.state;
        const classes = classNames('sort-option', order !== NO_ORDER && 'sort-option--active');

        return (
            <button className={classes} onClick={event => this.handleClick(event)} type="button">
                {label}
                {this.renderIcon()}
            </button>
        );
    }
}

SortOption.propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func
};

export default SortOption;
