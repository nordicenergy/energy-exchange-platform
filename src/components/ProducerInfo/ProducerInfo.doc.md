ProducerInfo example (square profile image):

```jsx
const billProps = {
    labels: {
        name: 'Name',
        price: 'Price',
        marketPrice: 'vs. market price of',
        energyType: 'Type of energy',
        annualProduction: 'Annual Production',
        purchased: 'Energy purchased',
        capacity: 'Peak Capacity',
        selectedSince: 'Selected since',
        ethereumAddress: 'Ethereum Address',
        location: 'Location'
    },
    details: {
        name: 'Nordic Energy',
        price: 2.4,
        marketPrice: 2.4,
        energyType: 'Solar',
        annualProduction: 3000,
        purchased: 1300,
        capacity: 8,
        selectedSince: 'Sep 12 - Feb 22',
        ethereumAddress: '0x1383b6EFe917e2BB5d80a55a8B1A81f360eD06bd',
        location: 'Vaasa, Finland'
    },
    description: `Nordic Energy is a European energy
                  trading corporation and the blockchain based interface between the Group's
                  operating companies and global wholesale markets for
                  energy and energy-related raw materials in both their
                  physical and/or derivative forms.`,
    picture: 'https://upload.wikimedia.org/wikipedia/en/5/87/Nordic_Energy.jpg'
};

<div style={{ backgroundColor: 'white', padding: '10px' }}>
    <ProducerInfo {...billProps} />
</div>;
```

ProducerInfo example (without profile image and several fields):

```jsx
const billProps = {
    labels: {
        name: 'Name',
        price: 'Price',
        marketPrice: 'vs. market price of',
        energyType: 'Type of energy',
        annualProduction: 'Annual Production',
        purchased: 'Energy purchased',
        capacity: 'Peak Capacity',
        selectedSince: 'Selected since',
        location: 'Location'
    },
    details: {
        name: 'Producer',
        price: 2.4,
        marketPrice: 2.5,
        energyType: 'Wind',
        annualProduction: null,
        purchased: null,
        capacity: null,
        selectedSince: '',
        location: ''
    },
    description: `LTN Supply & Trading is a leading European energy
                  trading house and the interface between the LTN Group's
                  operating companies and global wholesale markets for
                  energy and energy-related raw materials in both their
                  physical and/or derivative forms.`
};

<div style={{ backgroundColor: 'white', padding: '10px' }}>
    <ProducerInfo {...billProps} />
</div>;
```

ProducerInfo example (rectangle profile image, standard):

```jsx
const lukeProps = {
    labels: {
        name: 'Name',
        price: 'Price',
        energyType: 'Type of energy',
        annualProduction: 'Annual Production',
        purchased: 'Energy purchased',
        capacity: 'Peak Capacity',
        selectedSince: 'Selected since',
        location: 'Location'
    },
    details: {
        name: 'Vaasan Sahko',
        price: 2.4,
        energyType: 'Wind',
        annualProduction: 3000,
        purchased: 1300,
        capacity: 8,
        status: 'standard',
        selectedSince: 'Sep 12 - Feb 22',
        location: 'Kirkkopuistikko 0, Vaasa, FI 65100'
    },
    description: `Vaasan Sahko is a Finish energy
                  distributor and the interface between the Energy Group's
                  operating companies and global wholesale markets for
                  energy and energy-related raw materials in both their
                  physical and/or derivative forms.`,
    picture: 'https://upload.wikimedia.org/wikipedia/en/9/9b/Vaasan-Sahko.png'
};

<div style={{ backgroundColor: 'white', padding: '10px' }}>
    <ProducerInfo {...lukeProps} />
</div>;
```
