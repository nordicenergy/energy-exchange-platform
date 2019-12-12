import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Validator from 'async-validator';

import { LoginForm, Logo, Illustration } from '../../components';
import { Login as messages } from '../../services/translations/messages';
import { performLogin } from '../../action_performers/users';
import { performSetupLoaderVisibility } from '../../action_performers/app';
import { performPushNotification } from '../../action_performers/notifications';

import AppPage from '../__shared__/AppPage';

import './Login.css';

export class Login extends AppPage {
    static mapStateToProps(state) {
        return {
            loading: state.Users.login.loading,
            login: state.Users.login.data,
            error: state.Users.login.error
        };
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            errors: {}
        };
    }

    componentDidUpdate(prevProps) {
        const { formatMessage } = this.context.intl;
        const { loading, login, error } = this.props;
        const loaded = prevProps.loading !== loading && !loading;

        if (loaded && login.authentication && login.authentication.authenticationToken) {
            this.handleSuccessfulAuthentication();
        }

        if (error !== prevProps.error && error) {
            performPushNotification({ message: formatMessage(messages.authErrorMessage), type: 'error' });
        }

        if (prevProps.loading !== loading) {
            performSetupLoaderVisibility(this.pageId, loading);
        }
    }

    handleSuccessfulAuthentication() {
        const { history, route } = this.context.router;
        const matches = route.location.search.match(/next=([^&]*)/);
        const nextUrl = matches ? decodeURIComponent(matches[1]) : '/';

        history.push(nextUrl);
    }

    prepareValidator() {
        const { formatMessage } = this.context.intl;
        const validationSchema = {
            username: {
                type: 'string',
                required: true,
                message: formatMessage(messages.emptyUsernameError)
            },
            password: {
                type: 'string',
                required: true,
                message: formatMessage(messages.emptyPasswordError)
            }
        };

        return new Validator(validationSchema);
    }

    sendCredentials(credentials) {
        const validator = this.prepareValidator();

        validator.validate(credentials, errors => {
            if (errors) {
                this.setState({
                    errors: errors.reduce(
                        (errorsState, { field, message }) => ({
                            ...errorsState,
                            [field]: message
                        }),
                        {}
                    )
                });
            } else {
                this.setState({ errors: {} });
                performLogin(credentials);
            }
        });
    }

    openResetPasswordPage() {
        const { history } = this.context.router;
        history.push('/restore-password');
    }

    render() {
        const { router } = this.context;
        const { loading } = this.props;
        const { errors } = this.state;
        const username = router.getQueryParam('username');

        return (
            <div role="main" className="login-container" aria-busy={loading}>
                <div className="login-container-layout">
                    <div className="login-container-hero">
                        <Illustration className="illustration--login" />
                    </div>
                    <div className="login-container-form">
                        <Logo className="logo--login" />
                        <LoginForm
                            labels={this.prepareLabels(messages)}
                            errors={errors}
                            defaultUsername={username}
                            onForgotPasswordLinkClick={() => {
                                this.openResetPasswordPage();
                            }}
                            onSubmit={credentials => {
                                this.sendCredentials(credentials);
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

Login.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.shape({
            push: PropTypes.func.isRequired
        }).isRequired,
        route: PropTypes.shape({
            location: PropTypes.object.isRequired
        }).isRequired
    }),
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired
};
Login.propTypes = {
    loading: PropTypes.bool,
    location: PropTypes.object,
    data: PropTypes.shape({}),
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};
Login.defaultProps = {
    loading: false,
    data: {},
    error: null
};

export default connect(Login.mapStateToProps)(Login);
