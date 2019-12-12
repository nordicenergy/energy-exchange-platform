import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Button.css';

const Button = props => {
    const { className, type, disabled, children, onClick } = props;
    const classes = classNames('button', `button-${type}`, className);

    return (
        <button className={classes} disabled={disabled} onClick={onClick}>
            {children}
        </button>
    );
};

Button.propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(['success', 'primary']),
    disabled: PropTypes.bool,
    children: PropTypes.node,
    onClick: PropTypes.func
};
Button.defaultProps = {
    type: 'primary',
    disabled: false
};

export default Button;
