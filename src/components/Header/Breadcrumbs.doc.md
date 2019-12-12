Breadcrumbs example:

```
const breadcrumbsItems = [
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
const wrapperStyle = {
    backgroundColor: '#051a2d',
    padding: '10px'
};
<div style={wrapperStyle}>
    <Breadcrumbs items={breadcrumbsItems} iconsTypes={iconsTypes}/>
</div>

```
