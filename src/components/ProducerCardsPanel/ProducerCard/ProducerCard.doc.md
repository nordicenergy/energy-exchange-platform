#### ProducerCard component

```jsx
const wrapperStyle = {
    padding: '1rem 2rem',
    background: '#d5d5d5'
};
const cardWrapperStyle = {
    maxWidth: '19rem',
    margin: '0 auto'
};
const producer = {
    id: 1,
    price: 2.9,
    name: 'John Doe',
    plantType: 'solar',
    status: 'sold out'
};

<div style={wrapperStyle}>
    <div style={cardWrapperStyle}>
        <ProducerCard producer={producer} />
    </div>
</div>;
```

#### Selected ProducerCard

```jsx
const wrapperStyle = {
    padding: '1rem 2rem',
    background: '#d5d5d5'
};
const cardWrapperStyle = {
    maxWidth: '19rem',
    margin: '0 auto'
};
const producer = {
    id: 1,
    price: 2.9,
    name: 'John Doe',
    plantType: 'solar',
    status: 'sold out'
};

<div style={wrapperStyle}>
    <div style={cardWrapperStyle}>
        <ProducerCard selected producer={producer} />
    </div>
</div>;
```
