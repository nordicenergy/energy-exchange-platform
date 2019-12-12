import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './CoinButton.css';

const CoinButton = props => {
    const { className, disabled, label, price, onClick } = props;
    const classes = classNames('coin-button', className);

    return (
        <button className={classes} disabled={disabled} onClick={onClick}>
            <span>{label}</span>
            <span>
                <strong>{price}</strong> ct/kWh
            </span>
        </button>
    );
};

CoinButton.propTypes = {
    label: PropTypes.string,
    price: PropTypes.number,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func
};
CoinButton.defaultProps = {
    label: '',
    price: 0,
    disabled: false
};

export default CoinButton;
