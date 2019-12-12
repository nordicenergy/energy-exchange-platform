Footer example:

```js
const initialState = { footerItems: [
    {
        href: '#item1',
        label: 'Item 1'
    },
    {
        href: '#item2',
        label: 'Item 2'
    },
    {
        href: '#item3',
        label: 'Item 3'
    }
] };


<Footer addressLabel={'Company Address Label'} navItems={state.footerItems} onSelect={(id) => {
    setState({
        footerItems: state.footerItems.map(i => {
            i.active = i.href === id;
            return i;
        })
    });
}} />
```
