import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { KEYBOARD_KEY_VALUES } from '../../constants';
import './NavigationCard.css';
import MyProducerIcon from './MyProducerIcon';
import BuyEnergyIcon from './BuyEnergyIcon';
import SellEnergyIcon from './SellEnergyIcon';

const ICONS_TYPES = {
    buy_energy: BuyEnergyIcon,
    my_producer: MyProducerIcon,
    sell_energy: SellEnergyIcon
};

class NavigationCard extends React.Component {
    handlerCardEnterPress(event) {
        if (event.key === KEYBOARD_KEY_VALUES.ENTER) {
            this.props.onCardClickHandler();
        }
    }

    render() {
        const { title, type, disabled, onCardClickHandler } = this.props;
        const Icon = ICONS_TYPES[type];
        const classes = classNames({ 'nav-card-container': true, 'nav-card-container--disabled': disabled });

        return (
            <div
                className={classes}
                onClick={() => !disabled && onCardClickHandler()}
                onKeyUp={event => !disabled && this.handlerCardEnterPress(event)}
                tabIndex={0}
            >
                <div className="nav-card">
                    <div className="nav-card-image-container">
                        <Icon />
                    </div>
                    <div className="nav-card-title-container">
                        <p className="nav-card-title">{title}</p>
                    </div>
                </div>
            </div>
        );
    }
}

NavigationCard.propTypes = {
    title: PropTypes.string,
    type: PropTypes.oneOf(['buy_energy', 'my_producer', 'sell_energy']),
    disabled: PropTypes.bool,
    onCardClickHandler: PropTypes.func.isRequired
};

export default NavigationCard;
