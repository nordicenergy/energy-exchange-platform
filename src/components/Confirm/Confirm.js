import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import focusManager from 'focus-manager';
import { KEYBOARD_KEY_VALUES } from '../../constants';

import './Confirm.css';

export class Confirm extends React.Component {
    constructor(props) {
        super(props);

        this.escKeyDownHandler = this.escKeyDownHandler.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { show } = this.props;
        const isOpen = !prevProps.show && show;
        const isClose = prevProps.show && !show;

        if (isOpen) {
            return focusManager.capture(this.modal);
        }

        if (isClose) {
            return focusManager.release();
        }
    }

    escKeyDownHandler(event) {
        if (event.key === KEYBOARD_KEY_VALUES.ESCAPE) {
            this.props.onCancel();
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.escKeyDownHandler, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.escKeyDownHandler, false);
    }

    render() {
        const { className, labels, show, onConfirm, onCancel } = this.props;
        const classes = classNames('confirm', show && 'confirm--show', className);

        return (
            <div aria-hidden={!!show ? undefined : true} className={classes} ref={modal => (this.modal = modal)}>
                <dialog className="confirm-dialog" open={show}>
                    <strong className="confirm-dialog-message">{labels.message}</strong>
                    <div className="confirm-dialog-actions">
                        <button onClick={onConfirm}>{labels.confirmButton}</button>
                        {(onCancel || labels.cancelButton) && <button onClick={onCancel}>{labels.cancelButton}</button>}
                    </div>
                </dialog>
            </div>
        );
    }
}

Confirm.propTypes = {
    className: PropTypes.string,
    labels: PropTypes.shape({
        message: PropTypes.string,
        confirmButton: PropTypes.string,
        cancelButton: PropTypes.string
    }),
    show: PropTypes.bool,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func
};
Confirm.defaultProps = {
    show: false
};

export default Confirm;
