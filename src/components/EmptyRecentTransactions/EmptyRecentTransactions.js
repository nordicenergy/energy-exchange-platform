import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faClock from '@fortawesome/fontawesome-free-solid/faClock';
import './EmptyRecentTransactions.css';

export default function EmptyRecentTransactions(props) {
    const classes = classNames('empty-recent-transactions', props.className);

    return (
        <div className={classes}>
            <h2 className="empty-recent-transactions-title">{props.title}</h2>
            <FontAwesomeIcon className="empty-recent-transactions-icon" icon={faClock} />
            <p className="empty-recent-transactions-message">{props.message}</p>
        </div>
    );
}

EmptyRecentTransactions.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string
};
EmptyRecentTransactions.defaultProps = {
    title: 'Most Recent Transactions',
    message: 'No transaction information'
};
