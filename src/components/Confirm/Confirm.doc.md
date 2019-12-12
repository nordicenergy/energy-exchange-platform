```jsx
class ConfirmDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }

    toggleConfirmVisibility() {
        this.setState(prevState => ({
            show: !prevState.show
        }));
    }

    render() {
        return (
            <div>
                <button onClick={() => this.toggleConfirmVisibility()}>Show confirm</button>
                <Confirm
                    labels={{
                        message: "Are you sure that you'd like to logout from the system?",
                        confirmButton: 'Yes',
                        cancelButton: 'No'
                    }}
                    show={this.state.show}
                    onConfirm={() => this.toggleConfirmVisibility()}
                    onCancel={() => this.toggleConfirmVisibility()}
                />
            </div>
        );
    }
}

<ConfirmDemo />;
```
