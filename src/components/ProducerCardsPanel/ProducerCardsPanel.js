import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Spinner from '../Loader/Spinner';
import ProducerCard, { ProducerType } from './ProducerCard';
import './ProducerCardsPanel.css';

const ProducerCardsPanel = ({ className, loading, producers, selectedProducerId, priceLabel, onProducerClick }) => {
    const classes = classNames('producer-cards-panel', className);

    return (
        <div className={classes}>
            <ul className="producer-cards-list">
                {producers.map(producer => (
                    <li key={producer.id} className="producer-cards-list-item">
                        <ProducerCard
                            className="producer-card--filled"
                            producer={producer}
                            selected={producer.id === selectedProducerId}
                            onClick={onProducerClick}
                        />
                    </li>
                ))}
            </ul>
            <div role="progressbar" aria-hidden={!!loading ? undefined : true} className="producer-cards-panel-loader">
                {loading && <Spinner size="sm" color="#30acc1" />}
            </div>
        </div>
    );
};

ProducerCardsPanel.propTypes = {
    className: PropTypes.string,
    loading: PropTypes.bool,
    producers: PropTypes.arrayOf(ProducerType),
    selectedProducerId: PropTypes.number,
    onProducerClick: PropTypes.func
};
ProducerCardsPanel.defaultProps = {
    loading: false,
    producers: []
};

export default ProducerCardsPanel;
