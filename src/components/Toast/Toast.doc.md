#### Toast component

```jsx
<Toast message="Successfully!" onCloseClick={() => alert('close')} />
```

#### Toast with error

```jsx
<Toast type="error" message="Internal server error!" />
```

#### Toast with long message

```jsx
const message =
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, expedita facilis incidunt itaque iure reprehenderit voluptatem? Aliquid architecto autem, beatae deserunt dolorum eligendi et exercitationem minima placeat quis sunt voluptatum!';
<Toast message={message} />;
```
