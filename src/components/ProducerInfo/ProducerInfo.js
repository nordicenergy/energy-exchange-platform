import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { PRODUCER_STATUSES } from '../../constants';
import { formatFloat } from '../../services/formatter';
import './ProducerInfo.css';

const MAP_SERVICE_URL = 'http://maps.google.com/?q=';

class ProducerInfo extends React.Component {
    renderPrice() {
        const { labels, details } = this.props;
        const { price, marketPrice, status } = details;
        const isStandard = status === PRODUCER_STATUSES.standard;
        const mainPrice = isStandard ? marketPrice : price;

        return (
            <React.Fragment>
                <span>{`${formatFloat(mainPrice)} ct/kWh`}</span>
                {!isStandard && marketPrice ? (
                    <small className="producer-information-market-value">
                        {`${labels.marketPrice} `}
                        <strong>{formatFloat(marketPrice)}</strong>
                        {` ct/kWh`}
                    </small>
                ) : null}
            </React.Fragment>
        );
    }

    renderLocation() {
        const { details } = this.props;
        const { location } = details;
        return (
            <span>
                <a target="_blank" href={`${MAP_SERVICE_URL}${location}`}>
                    {location}
                </a>
            </span>
        );
    }

    renderValue(value, smallerText) {
        const classes = classNames({ 'producer-information-smaller-value': smallerText });
        return <span className={classes}>{value}</span>;
    }

    renderRow(label, value, smallerText) {
        const renderValue = typeof value === 'function' ? value : this.renderValue.bind(null, value, smallerText);
        return (
            <div role="listitem" className="producer-information-row">
                <p>
                    <span className="producer-information-label">{label}</span>
                    <span className="producer-information-value" translate="no">
                        {renderValue()}
                    </span>
                </p>
            </div>
        );
    }

    renderImage(picture) {
        if (picture) {
            return <img src={picture} alt="Here you can see how looks producer" />;
        }

        return <Placeholder />;
    }

    render() {
        const { labels, details, description, picture } = this.props;
        const {
            name,
            price,
            energyType,
            ethereumAddress,
            annualProduction,
            purchased,
            capacity,
            selectedSince,
            location
        } = details;

        const calcCapacity = Number(capacity || 0) / 1000; // expect kWh, convert to MW
        return (
            <section className="producer-information">
                <section className="producer-information-details">
                    <div role="list">
                        {name && this.renderRow(labels.name, name)}
                        {price > 0 && this.renderRow(labels.price, this.renderPrice.bind(this))}
                        {energyType && this.renderRow(labels.energyType, energyType)}
                        {annualProduction > 0 &&
                            this.renderRow(labels.annualProduction, `${formatFloat(annualProduction)} kWh/day`)}
                        {purchased > 0 && this.renderRow(labels.purchased, `${formatFloat(purchased)} kWh`)}
                        {capacity > 0 && this.renderRow(labels.capacity, `${formatFloat(calcCapacity)} MW`)}
                        {selectedSince && this.renderRow(labels.selectedSince, selectedSince)}
                        {ethereumAddress && this.renderRow(labels.ethereumAddress, ethereumAddress, true)}
                        {location && location.trim() && this.renderRow(labels.location, this.renderLocation.bind(this))}
                    </div>
                    <figure className="producer-information-image">{this.renderImage(picture)}</figure>
                </section>
                <p className="producer-information-desc">{description}</p>
            </section>
        );
    }
}

ProducerInfo.propTypes = {
    details: PropTypes.shape({
        name: PropTypes.string,
        price: PropTypes.number,
        energyType: PropTypes.string,
        annualProduction: PropTypes.number,
        purchased: PropTypes.number,
        capacity: PropTypes.number,
        selectedSince: PropTypes.string,
        ethereumAddress: PropTypes.string,
        location: PropTypes.string,
        marketPrice: PropTypes.number,
        status: PropTypes.string
    }),
    labels: PropTypes.shape({
        name: PropTypes.string,
        price: PropTypes.string,
        marketPrice: PropTypes.string,
        energyType: PropTypes.string,
        annualProduction: PropTypes.string,
        purchased: PropTypes.string,
        capacity: PropTypes.string,
        selectedSince: PropTypes.string,
        ethereumAddress: PropTypes.string,
        location: PropTypes.string
    }),
    description: PropTypes.string,
    picture: PropTypes.string
};

export default ProducerInfo;

export function Placeholder() {
    return (
        <div className="producer-information-image-placeholder">
            <svg
                viewBox="0 0 85 81"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Default placeholder for producer image"
                role="img"
            >
                <title>Producer Profile Image Placeholder</title>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-1141.000000, -271.000000)">
                        <g transform="translate(1142.000000, 272.000000)">
                            <g stroke="#b3b3b3" strokeLinejoin="round" strokeWidth="2">
                                <polyline points="12 26 28.963 14.5 28.963 26 47.377 13.75 47.377 26 65.082 14.375 65.082 26 83 14.187 83 30 83 79 12.533 79" />
                                <polygon points="12 79 0 79 0 39 0 9 12 0 12 39" />
                            </g>
                            <polygon
                                fill="#f2f2f2"
                                points="55.7148 49.7363 38.7488 73.9283 41.2618 53.0003 34.9788 53.0003 51.9438 29.0003 49.4308 49.7363"
                            />
                            <polygon
                                stroke="#b3b3b3"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points="56.1641 49.7725 38.7491 73.9285 41.2761 53.0005 34.2761 53.0005 51.9441 29.0005 49.9101 49.7725"
                            />
                            <g stroke="#b3b3b3" strokeWidth="2">
                                <path d="M39.126,68.3301 C32.267,65.7991 27.376,59.2031 27.376,51.4641 C27.376,41.5391 35.421,33.4931 45.347,33.4931 C46.287,33.4931 47.21,33.5651 48.111,33.7041" />
                                <path d="M51.5674,34.5986 C58.4264,37.1296 63.3174,43.7256 63.3174,51.4636 C63.3174,61.3896 55.2724,69.4356 45.3464,69.4356 C44.4064,69.4356 43.4834,69.3636 42.5824,69.2246" />
                                <polygon strokeLinejoin="round" points="12 0 0 9 0 17 12 8" />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
}
