NavigationCardsPanel component:

```jsx
const wrapperStyles = {
    padding: '1rem',
    backgroundColor: '#e6e6e6'
};
const labels = {
    myProducer: 'My Producer',
    buyEnergy: 'Buy Energy',
    sellEnergy: 'Sell Energy',
};

const navigationCards = [
    {
        type: 'my_producer',
        title: 'My Producer',
        path: '/#navigationcardspanel'
    },
    {
        type: 'buy_energy',
        title: 'Buy Energy',
        path: '/#navigationcardspanel'
    },
    {
        type: 'sell_energy',
        title: 'Sell Energy',
        path: '/#navigationcardspanel'
    }
];

<div style={wrapperStyles}>
    <NavigationCardsPanel navigationCards={navigationCards} labels={labels} onCardClick={f => f}/>
</div>
```
