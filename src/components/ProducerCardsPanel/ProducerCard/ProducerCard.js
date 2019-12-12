import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { KEYBOARD_KEY_VALUES } from '../../../constants';
import { formatFloat } from '../../../services/formatter';
import defaultImage from './defaultImage.png';
import './ProducerCard.css';

class ProducerCard extends React.Component {
    handlerCardEnterPress(event, id) {
        if (event.key === KEYBOARD_KEY_VALUES.ENTER) {
            this.props.onClick(id);
        }
    }

    render() {
        const { className, producer, selected, onClick } = this.props;
        const classes = classNames('producer-card', selected && 'producer-card--selected', className);
        const style = { backgroundImage: `url(${producer.picture || defaultImage})` };

        return (
            <div
                className={classes}
                onClick={() => onClick && onClick(producer.id)}
                onKeyUp={event => this.handlerCardEnterPress(event, producer.id)}
                style={style}
                tabIndex={0}
            >
                <div className="producer-card-layout">
                    <div className="producer-card-meta">
                        <strong className="producer-card-price" translate="no">
                            {formatFloat(producer.price)} ct/kWh
                        </strong>
                        <span className="producer-card-plant-type">{producer.plantType}</span>
                    </div>
                    <div className="producer-card-name">
                        {producer.status && <small className="producer-card-status">{producer.status}</small>}
                        <h3>{producer.name}</h3>
                    </div>
                </div>
            </div>
        );
    }
}

export const ProducerType = PropTypes.shape({
    id: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string,
    status: PropTypes.string,
    plantType: PropTypes.string.isRequired
});
ProducerCard.propTypes = {
    className: PropTypes.string,
    producer: ProducerType.isRequired,
    selected: PropTypes.bool,
    onClick: PropTypes.func
};
ProducerCard.defaultProps = {
    selected: false
};

export default ProducerCard;
