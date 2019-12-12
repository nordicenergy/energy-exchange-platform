With contracts:
```jsx
initialState = { isOpen: false };


const props = {
    show: state.isOpen,
    contracts: [{id: '10020'}, {id: '10044'}, {id: '10025'}]
};


<div>
    <button onClick={() => setState({ isOpen: true })} style={{ padding: '2rem' }}>Show contract modal</button>
    <ContractModal
        {...props}
        onSelect={() => setState({ isOpen: false })}
    />
</div>
```

Without contracts:
```
initialState = { isOpen: false };


const props = {
    show: state.isOpen,
    onClick: () => setState({ isOpen: false }),
    contracts: []
};


<div>
    <button onClick={() => setState({ isOpen: true })} style={{ padding: '2rem' }}>Show contract modal</button>
    <ContractModal
        {...props}
        onSelect={() => setState({ isOpen: false })}
    />
</div>

```
