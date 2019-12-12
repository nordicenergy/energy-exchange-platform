import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faChevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft';
import TextField from '../TextField';
import Button from '../Button';
import './ResetPasswordForm.css';

class ResetPasswordForm extends Component {
    constructor(props) {
        super(props);
        this.state = { password: '', confirm: '' };
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit(event) {
        event.preventDefault();

        const { onSubmit } = this.props;
        const { password, confirm } = this.state;

        onSubmit(password, confirm);
    }

    handleLoginLinkClick(event) {
        event.preventDefault();

        const { onLoginLinkClick } = this.props;
        onLoginLinkClick();
    }

    render() {
        const { labels, errors } = this.props;
        const { password, confirm } = this.state;

        return (
            <div className="reset-password-form">
                <h3 className="reset-password-form-title">{labels.formTitle}</h3>
                <form onSubmit={event => this.handleSubmit(event)} noValidate>
                    <TextField
                        className="password-field"
                        darkMode
                        label={labels.passwordField}
                        type="password"
                        name="password"
                        value={password}
                        error={errors.password}
                        onChange={event => this.handleChange(event)}
                    />
                    <TextField
                        className="confirm-field"
                        darkMode
                        label={labels.confirmField}
                        type="password"
                        name="confirm"
                        value={confirm}
                        error={errors.confirm}
                        onChange={event => this.handleChange(event)}
                    />
                    <div className="reset-password-form-actions">
                        <Button type="success">{labels.sendButton}</Button>
                        <a className="login-link" href="/login" onClick={event => this.handleLoginLinkClick(event)}>
                            <FontAwesomeIcon className="login-link-icon" icon={faChevronLeft} />
                            <span className="login-link-text">{labels.loginLink}</span>
                        </a>
                    </div>
                </form>
            </div>
        );
    }
}

ResetPasswordForm.propTypes = {
    labels: PropTypes.shape({
        formTitle: PropTypes.string,
        passwordField: PropTypes.string,
        confirmField: PropTypes.string,
        sendButton: PropTypes.string,
        loginLink: PropTypes.string
    }).isRequired,
    errors: PropTypes.shape({
        password: PropTypes.string,
        confirm: PropTypes.string
    }),
    onSubmit: PropTypes.func.isRequired,
    onLoginLinkClick: PropTypes.func.isRequired
};
ResetPasswordForm.defaultProps = {
    errors: {}
};

export default ResetPasswordForm;
