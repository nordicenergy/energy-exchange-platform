Header example:

```jsx
<Header locales={['en', 'de']} contracts={[]} locale="en" onLocaleChange={() => null} />
```

Header example with breadcrumbs:

```jsx
const breadCrumbs = [
    {
         id: 'trading',
         label: 'Trading',
         icon: 'faChartBar',
         path: '#breadcrumbs'
    },
    {
        id: 'powerchain',
        label: 'PowerChain',
        path: '#breadcrumbs'
    }
];

const iconsTypes = {
    '': 'faHome',
    documents: 'faBook',
    submit_metric: 'faCalculator',
    trading: 'faChartBar',
    profile: 'faUser'
};
<Header 
    breadCrumbs={breadCrumbs}
    iconsTypes={iconsTypes}
    locales={['en', 'de']}
    locale="en"
    onLocaleChange={() => null}
    contracts={[{ id: '1046464' }, { id: '1045645' }, { id: '15555' }]}
    selectedContractId={'1046464'}
    onContractChange={f => f} />;
```
