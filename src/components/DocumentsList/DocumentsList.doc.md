DocumentsList example (without pagination):
```
const documents = [
    { id: 1, date: 1523707200, name: 'Invoice', url: '/test1.pdf' },
    { id: 2, date: 1523707200, name: 'Monthly Installment', url: '/test2.pdf' },
    { id: 3, date: 1523707200, name: 'Annual bill', link: '/test3.pdf' },
    { id: 4, date: 1523707200, name: 'Monthly Installment', url: '/test4.pdf' },
    { id: 5, date: 1523707200, name: 'Monthly Installment' },
    { id: 6, date: 1523707200, name: 'Monthly Installment', url: '/test6.pdf' },
    { id: 7, date: 1523707200, name: 'Monthly Installment', url: '/test7.pdf' },
    { id: 8, date: undefined, name: undefined, url: undefined }
];

const wrapperStyles = {
    backgroundColor: '#e6e6e6',
    padding: '20px'
};
<div style={wrapperStyles}>
    <DocumentsList documents={documents} />
</div> 
```


DocumentsList example (extended, with pagination):
```
const documents = [
    { id: 1, date: 1523707200, name: 'Invoice', url: '/test1.pdf' },
    { id: 2, date: 1523707200, name: 'Monthly Installment', url: '/test2.pdf' },
    { id: 3, date: 1523707200, name: 'Annual bill', url: '/test3.pdf' },
    { id: 4, date: 1523707200, name: 'Monthly Installment', },
    { id: 5, date: 1523707200, name: 'Monthly Installment', },
    { id: 6, date: 1523707200, name: 'Monthly Installment', url: '/test6.pdf' },
    { id: 7, date: 1523707200, name: 'Monthly Installment', url: '/test7.pdf' },
    { id: 8, date: undefined, name: undefined, url: undefined }
];

const wrapperStyles = {
    backgroundColor: '#e6e6e6',
    padding: '20px'
};
<div style={wrapperStyles}>
    <DocumentsList pagination loading documents={documents} />
</div> 
```
