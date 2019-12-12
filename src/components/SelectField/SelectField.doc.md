```jsx
const options = [
    { value: 'wind', label: 'Wind' },
    { value: 'biomass (peat)', label: 'Biomass (peat)' },
    { value: 'biomass (corn)', label: 'Biomass (corn)' },
    { value: 'solar', label: 'Solar' },
    { value: 'renewable', label: 'Renewable' },
];

<SelectField label="Type of energy" options={options} />;
```

#### SelectField with disabled options

```jsx
const options = [
    { value: 'wind', label: 'Wind' },
    { value: 'biomass (peat)', label: 'Biomass (peat)' },
    { value: 'biomass (corn)', label: 'Biomass (corn)', disabled: true },
    { value: 'solar', label: 'Solar' },
    { value: 'renewable', label: 'Renewable', disabled: true },
];

<SelectField label="Type of energy" options={options} />;
```
