import React from 'react';
import NavigationCard from './NavigationCard';
import './NavigationCardsPanel.css';

const NavigationCardsPanel = ({ navigationCards, onCardClick }) => (
    <nav className="navigation-cards">
        {navigationCards.map(cardItem => (
            <NavigationCard
                key={cardItem.type}
                type={cardItem.type}
                title={cardItem.title}
                disabled={cardItem.disabled}
                onCardClickHandler={() => onCardClick(cardItem.path)}
            />
        ))}
    </nav>
);

export default NavigationCardsPanel;
