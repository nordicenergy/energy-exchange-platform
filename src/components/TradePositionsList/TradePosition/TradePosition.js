import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './TradePosition.css';
import { Button } from '../../.';

export const TradePositionPropType = PropTypes.shape({
    offerAddressUrl: PropTypes.string,
    offerAddress: PropTypes.string,
    producerUrl: PropTypes.string,
    producerName: PropTypes.string,
    offerIssued: PropTypes.string,
    validOn: PropTypes.string,
    energyOffered: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    energyAvailable: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    txHash: PropTypes.string,
    txHashUrl: PropTypes.string
});

const TradePosition = ({ className, labels, tradePosition, onPerform }) => {
    const offerAddress =
        tradePosition.offerAddressUrl && tradePosition.offerAddress ? (
            <a target="_blank" href={tradePosition.offerAddressUrl} rel="external noopener noreferrer">
                {tradePosition.offerAddress}
            </a>
        ) : (
            <strong>{tradePosition.offerAddress}</strong>
        );
    const producerName =
        tradePosition.producerUrl && tradePosition.producerName ? (
            <a target="_blank" href={tradePosition.producerUrl}>
                {tradePosition.producerName}
            </a>
        ) : (
            <strong>{labels.producerNamePlaceholder}</strong>
        );
    const hash =
        tradePosition.txHashUrl && tradePosition.txHash ? (
            <a target="_blank" href={tradePosition.txHashUrl} rel="external noopener noreferrer">
                {tradePosition.txHash}
            </a>
        ) : null;
    const classes = classNames({ 'trade-position': true, 'trade-position-tx--performed': !!hash });

    return (
        <div className={classes}>
            <div className="trade-position-data trade-position-data--primary">
                <div className="trade-position-entry">
                    <span>{labels.offerAddress}</span>
                    {offerAddress}
                </div>
                <div className="trade-position-entry">
                    <span>{labels.producerName}</span>
                    {producerName}
                </div>
            </div>
            <div className="trade-position-data trade-position-data--primary">
                <div className="trade-position-entry">
                    <span>{labels.offerIssued}</span>
                    <strong>{tradePosition.offerIssued}</strong>
                </div>
                <div className="trade-position-entry">
                    <span>{labels.validOn}</span>
                    <strong>{tradePosition.validOn}</strong>
                </div>
                <div className="trade-position-entry">
                    <span>{labels.energyOffered}</span>
                    <strong>{tradePosition.energyOffered}</strong>
                </div>
                <div className="trade-position-entry">
                    <span>{labels.energyAvailable}</span>
                    <strong>{tradePosition.energyAvailable}</strong>
                </div>
                <div className="trade-position-entry">
                    <span>{labels.price}</span>
                    <strong>
                        {tradePosition.price} <span translate="no">ct/kWh</span>
                    </strong>
                </div>
            </div>
            <div className="trade-position-tx">
                {hash ? (
                    <div className="trade-position-entry">
                        <span>{labels.transaction}</span>
                        {hash}
                    </div>
                ) : (
                    <Button onClick={() => onPerform(tradePosition)}>{labels.performTransaction}</Button>
                )}
            </div>
        </div>
    );
};

TradePosition.propTypes = {
    className: PropTypes.string,
    labels: PropTypes.shape({
        producerNamePlaceholder: PropTypes.string,
        offerAddress: PropTypes.string,
        producerName: PropTypes.string,
        offerIssued: PropTypes.string,
        validOn: PropTypes.string,
        energyOffered: PropTypes.string,
        energyAvailable: PropTypes.string,
        price: PropTypes.string,
        transaction: PropTypes.string,
        performTransaction: PropTypes.string
    }),
    tradePosition: TradePositionPropType.isRequired,
    onPerform: PropTypes.func
};
TradePosition.defaultProps = {
    labels: {
        producerNamePlaceholder: 'Unknown',
        offerAddress: 'Offer Address',
        producerName: 'Producer',
        offerIssued: 'Offer Issued',
        validOn: 'Valid on',
        energyOffered: 'kWh offered',
        energyAvailable: 'kWh available',
        price: 'Price',
        transaction: 'Transaction Hash',
        performTransaction: 'Perform Transaction'
    },
    tradePosition: {},
    onPerform: f => f
};

export default TradePosition;
