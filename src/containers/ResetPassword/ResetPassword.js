import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Validator from 'async-validator';

import { ResetPasswordForm, Logo, Illustration } from '../../components';
import { ResetPassword as messages } from '../../services/translations/messages';
import { performResetUserPassword, performVerifyResetPasswordToken } from '../../action_performers/users';
import { performPushNotification } from '../../action_performers/notifications';
import { performSetupLoaderVisibility } from '../../action_performers/app';

import AppPage from '../__shared__/AppPage';

import './ResetPassword.css';

export class ResetPassword extends AppPage {
    static mapStateToProps(state) {
        return {
            loading: state.Users.verifiedPasswordToken.loading || state.Users.resetPassword.loading,
            tokenVerification: state.Users.verifiedPasswordToken.data,
            resetPasswordData: state.Users.resetPassword.data,
            error: state.Users.verifiedPasswordToken.error || state.Users.resetPassword.error
        };
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            errors: {}
        };
    }

    componentDidMount() {
        const { match: { params } = {} } = this.props;
        performVerifyResetPasswordToken(params.resetToken);
    }

    componentDidUpdate(prevProps) {
        const { formatMessage } = this.context.intl;
        const { loading, resetPasswordData, tokenVerification, error } = this.props;
        const loaded = prevProps.loading !== loading && !loading;
        const passwordWasUpdated = prevProps.resetPasswordData !== resetPasswordData && resetPasswordData.updated;
        const invalidResetToken = prevProps.tokenVerification !== tokenVerification && !tokenVerification.valid;

        if (loaded && invalidResetToken) {
            performPushNotification({
                type: 'error',
                message: formatMessage(messages.invalidResetPasswordToken)
            });
            this.openLoginPage();
        }

        if (loaded && passwordWasUpdated) {
            performPushNotification({
                message: formatMessage(messages.passwordWasUpdated),
                type: 'success'
            });
            this.openLoginPage();
        }

        if (error !== prevProps.error && error) {
            performPushNotification({
                type: 'error',
                message: formatMessage(messages.invalidResetPasswordToken)
            });
            this.openLoginPage();
        }

        if (prevProps.loading !== loading) {
            performSetupLoaderVisibility(this.pageId, loading);
        }
    }

    prepareValidator() {
        const { formatMessage } = this.context.intl;
        const validationSchema = {
            password: [
                {
                    type: 'string',
                    required: true,
                    pattern: /^(?=.*[A-Za-z])(?=.*[0-9])(?=.{8,})/,
                    message: formatMessage(messages.invalidPasswordError)
                }
            ],
            confirm: [
                {
                    type: 'string',
                    required: true,
                    message: formatMessage(messages.invalidConfirmError)
                }
            ]
        };

        return new Validator(validationSchema);
    }

    updatePassword(newPassword, confirm) {
        const { match: { params } = {} } = this.props;
        const { formatMessage } = this.context.intl;
        const validator = this.prepareValidator();

        validator.validate({ password: newPassword, confirm }, errors => {
            if (errors) {
                return this.setState({
                    errors: errors.reduce(
                        (errorsState, { field, message }) => ({
                            ...errorsState,
                            [field]: message
                        }),
                        {}
                    )
                });
            }

            if (newPassword !== confirm) {
                return this.setState({
                    errors: {
                        confirm: formatMessage(messages.invalidConfirmError)
                    }
                });
            }

            performResetUserPassword(params.resetToken, newPassword);
        });
    }

    openLoginPage() {
        const { history } = this.context.router;
        history.push('/login');
    }

    render() {
        const { errors } = this.state;

        return (
            <div className="reset-password-container">
                <div className="reset-password-container-layout">
                    <div className="reset-password-container-hero">
                        <Illustration className="illustration--reset-password" />
                    </div>
                    <div className="reset-password-container-form">
                        <Logo className="logo--reset-password" />
                        <ResetPasswordForm
                            labels={this.prepareLabels(messages)}
                            errors={errors}
                            onSubmit={(newPassword, confirm) => this.updatePassword(newPassword, confirm)}
                            onLoginLinkClick={() => this.openLoginPage()}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

ResetPassword.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.shape({
            push: PropTypes.func.isRequired
        }).isRequired
    }),
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    })
};
ResetPassword.propTypes = {
    loading: PropTypes.bool,
    data: PropTypes.shape({})
};
ResetPassword.defaultProps = {
    loading: false,
    data: {}
};

export default connect(ResetPassword.mapStateToProps)(ResetPassword);
