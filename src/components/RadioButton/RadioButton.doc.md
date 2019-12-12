```jsx
<div style={{ display: 'flex' }}>
    <div style={{ marginRight: 24 }}>
        <RadioButton name="demo" label="Male" />
    </div>
    <div style={{ marginRight: 24 }}>
        <RadioButton name="demo" label="Female" required />
    </div>
    <div style={{ marginRight: 24 }}>
        <RadioButton name="demo" label="Female" required disabled />
    </div>
</div>
```

### With help text

```jsx
<RadioButton
    name="feature"
    label="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ad animi architecto consequatur expedita facere, impedit."
    helpText="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ad animi architecto consequatur expedita facere, impedit, inventore maiores minima molestias natus odio, quaerat qui repudiandae rerum saepe sapiente suscipit vel."
/>
```

### Error state

```jsx
<RadioButton
    name="feature"
    error="Please accept the terms."
    label="Do you agree to Terms & Conditions, Revocation rights und Privacy statement?"
/>
```
