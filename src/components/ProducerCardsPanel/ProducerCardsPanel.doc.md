#### ProducerCardsPanel component

```jsx
const wrapperStyle = {
    padding: '1rem 2rem',
    background: '#d5d5d5'
};
const producers = [
    { id: 0, price: 2.9, plantType: 'solar', name: 'John Doe' },
    { id: 1, price: 2, plantType: 'wind', name: 'Peter Producer', status: 'sold out' },
    { id: 2, price: 1, plantType: 'biomass', name: 'Jeremy', status: 'sold out' },
    { id: 3, price: 5, plantType: 'wind', name: 'Blark' },
    { id: 4, price: 1, plantType: 'solar', name: 'Alice' },
    { id: 5, price: 1, plantType: 'default', name: 'Standard' }
];

<div style={wrapperStyle}>
    <ProducerCardsPanel producers={producers} selectedProducerId={1} />
</div>;
```

#### ProducerCardsPanel with loader

```jsx
const wrapperStyle = {
    padding: '1rem 2rem',
    background: '#d5d5d5'
};
const producers = [
    { id: 0, price: 2.9, plantType: 'solar', name: 'John Doe' },
    { id: 1, price: 2, plantType: 'wind', name: 'Peter Producer', status: 'sold out' },
    { id: 2, price: 1, plantType: 'biomass', name: 'Jeremy', status: 'sold out' },
    { id: 3, price: 5, plantType: 'wind', name: 'Blark' },
    { id: 4, price: 1, plantType: 'solar', name: 'Alice' }
];

<div style={wrapperStyle}>
    <ProducerCardsPanel loading producers={producers} selectedProducerId={1} />
</div>;
```
