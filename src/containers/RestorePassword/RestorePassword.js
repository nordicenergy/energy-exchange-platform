import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Validator from 'async-validator';

import { RestorePasswordForm, Logo, Illustration } from '../../components';
import { RestorePassword as messages } from '../../services/translations/messages';
import { performCreateResetPasswordToken } from '../../action_performers/users';
import { performPushNotification } from '../../action_performers/notifications';
import { performSetupLoaderVisibility } from '../../action_performers/app';

import AppPage from '../__shared__/AppPage';

import './RestorePassword.css';

export class RestorePassword extends AppPage {
    static mapStateToProps(state) {
        return {
            loading: state.Users.createdPasswordToken.loading,
            data: state.Users.createdPasswordToken.data,
            error: state.Users.createdPasswordToken.error
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
        const { loading, data, error } = this.props;
        const loaded = prevProps.loading !== loading && !loading;
        const tokenWasCreated = prevProps.data !== data && data.created;

        if (loaded && tokenWasCreated) {
            performPushNotification({
                message: formatMessage(messages.tokenWasCreated),
                type: 'success'
            });
            this.openLoginPage();
        }

        if (error !== prevProps.error && error) {
            performPushNotification({ message: formatMessage(messages.createErrorMessage), type: 'error' });
        }

        if (prevProps.loading !== loading) {
            performSetupLoaderVisibility(this.pageId, loading);
        }
    }

    prepareValidator() {
        const { formatMessage } = this.context.intl;
        const validationSchema = {
            email: [
                {
                    required: true,
                    message: formatMessage(messages.emptyEmailError)
                },
                {
                    type: 'email',
                    message: formatMessage(messages.invalidEmailError)
                }
            ]
        };

        return new Validator(validationSchema);
    }

    sendEmailWithResetPasswordLink(email) {
        const validator = this.prepareValidator();

        validator.validate({ email }, errors => {
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
                // Server will send email with reset password link that based on reset password token
                performCreateResetPasswordToken(email);
            }
        });
    }

    openLoginPage() {
        const { history } = this.context.router;
        history.push('/login');
    }

    render() {
        const { errors } = this.state;

        return (
            <div className="restore-password-container">
                <div className="restore-password-container-layout">
                    <div className="restore-password-container-hero">
                        <Illustration className="illustration--restore-password" />
                    </div>
                    <div className="restore-password-container-form">
                        <Logo className="logo--restore-password" />
                        <RestorePasswordForm
                            labels={this.prepareLabels(messages)}
                            errors={errors}
                            onSubmit={email => this.sendEmailWithResetPasswordLink(email)}
                            onLoginLinkClick={() => this.openLoginPage()}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

RestorePassword.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.shape({
            push: PropTypes.func.isRequired
        }).isRequired
    }),
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    })
};
RestorePassword.propTypes = {
    loading: PropTypes.bool,
    data: PropTypes.shape({}),
    error: PropTypes.object
};
RestorePassword.defaultProps = {
    loading: false,
    data: {},
    error: null
};

export default connect(RestorePassword.mapStateToProps)(RestorePassword);
