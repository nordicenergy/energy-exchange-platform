import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle';
import faExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import './Toast.css';

const Toast = props => {
    const { className, type, message, onCloseClick } = props;
    const classes = classNames('toast', `toast--${type}`, className);
    let icon = null;

    if (type === 'success') {
        icon = <FontAwesomeIcon icon={faCheckCircle} className="toast-icon" />;
    }

    if (type === 'error') {
        icon = <FontAwesomeIcon icon={faExclamationTriangle} className="toast-icon" />;
    }

    return (
        <div role="alertdialog" className={classes}>
            {icon}
            <h2 className="toast-message">{message}</h2>
            <button aria-label="Close notification alert" className="toast-close-button" onClick={onCloseClick}>
                <FontAwesomeIcon icon={faTimes} />
            </button>
        </div>
    );
};

Toast.propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(['success', 'error']),
    message: PropTypes.string.isRequired,
    onCloseClick: PropTypes.func
};
Toast.defaultProps = {
    type: 'success'
};

export default Toast;
