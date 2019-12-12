ProducerHistory example:

```jsx
const props = {
    title: 'History of changes',
    data: [
        {
            date: 'Sep 12',
            value: 'Change amount of energy 3000 kWh'
        },
        {
            date: 'Feb 22',
            value: 'Price change 2.4 ct/kWh'
        },
        {
            date: 'Feb 12',
            value: 'Change amount of energy 2300 kWh'        
        },
        {
            date: 'Jan 14',
            value: 'Price change 3 ct/kWh'
        }
    ]
};

<div style={{ backgroundColor: 'white', padding: '10px' }}>
    <ProducerHistory {...props} />
</div>;
```
