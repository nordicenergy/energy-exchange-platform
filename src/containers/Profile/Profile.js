
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Validator from 'async-validator';
import IBAN from 'iban';
import pick from 'lodash.pick';

import { ProfileForm } from '../../components';
import { Profile as messages } from '../../services/translations/messages';
import { PAYMENT_METHODS } from '../../constants';
import { performGetUserData, performUpdateUserData } from '../../action_performers/users';
import { performSetupLoaderVisibility } from '../../action_performers/app';
import { performPushNotification } from '../../action_performers/notifications';

import AppPage from '../__shared__/AppPage';

import './Profile.css';

export class Profile extends AppPage {
    constructor(props, context) {
        super(props, context);
        this.state = {
            errors: {},
            updated: false
        };
    }

    static mapStateToProps(state) {
        return {
            profile: state.Users.profile.data.user,
            updatedProfile: state.Users.updatedProfile.data.user,
            loading: state.Users.profile.loading || state.Users.updatedProfile.loading,
            loadingError: state.Users.profile.error,
            updatingError: state.Users.updatedProfile.error
        };
    }

    componentDidMount() {
        performGetUserData();
    }

    componentDidUpdate({ loading, updatedProfile, loadingError, updatingError }) {
        const { formatMessage } = this.context.intl;
        const loaded = this.props.loading !== loading && loading;

        if (
            !this.props.loadingError &&
            !this.props.updatingError &&
            loaded &&
            updatedProfile !== this.props.updatedProfile
        ) {
            performPushNotification({ type: 'success', message: formatMessage(messages.profileUpdatedMessage) });
            performGetUserData();
        }

        if (this.props.loadingError && this.props.loadingError !== loadingError) {
            performPushNotification({ type: 'error', message: formatMessage(messages.profileLoadingErrorMessage) });
        }

        if (this.props.updatingError && this.props.updatingError !== updatingError) {
            performPushNotification({
                type: 'error',
                message: `${formatMessage(messages.profileUpdatedErrorMessage)}: [${this.props.updatingError.message}]`
            });
        }

        if (loading !== this.props.loading) {
            performSetupLoaderVisibility(this.pageId, this.props.loading);
        }
    }

    prepareValidator(formData) {
        const { profile } = this.props;

        const validationSchema = {
            firstName: { required: true, message: messages.emptyFirstName },
            lastName: { required: true, message: messages.emptyLastName },
            city: { required: true, message: messages.emptyCity },
            street: { required: true, message: messages.emptyStreet },
            streetNumber: { required: true, message: messages.emptyStreetNumber },
            postcode: { required: true, message: messages.emptyPostcode },
            email: [{ required: true, message: messages.emptyEmail }, { type: 'email', message: messages.invalidEmail }]
        };

        if (formData.contract.paymentMethod === PAYMENT_METHODS.debit) {
            validationSchema.contract = {
                type: 'object',
                fields: {
                    IBAN: [
                        { required: true, message: messages.emptyIban },
                        {
                            validator(rule, value, callback) {
                                const errors = [];

                                if (value && !IBAN.isValid(value)) {
                                    errors.push(new Error(`Invalid IBAN value: ${value}`));
                                }

                                callback(errors);
                            },
                            message: messages.invalidIban
                        }
                    ]
                }
            };
            validationSchema.sepaApproval = {
                validator(rule, value, callback) {
                    const errors = [];

                    if (!value) {
                        errors.push(new Error('SEPA approval is not accepted'));
                    }

                    callback(errors);
                },
                message: messages.sepaApprovalValidator
            };
        }

        if (profile.email !== formData.email) {
            validationSchema.oldPassword = { required: true, message: messages.emptyPasswordForEmailUpdating };
        }

        if (formData.newPassword || formData.confirmNewPassword) {
            validationSchema.oldPassword = { required: true, message: messages.emptyOldPassword };
            validationSchema.newPassword = { required: true, message: messages.emptyPassword };
            validationSchema.confirmNewPassword = [
                { required: true, message: messages.emptyConfirmPassowrd },
                {
                    validator(rule, value, callback, source) {
                        const errors = [];

                        if (value !== source.newPassword) {
                            errors.push(new Error('Confirm and new password values are mismatch'));
                        }

                        callback(errors);
                    },
                    message: messages.passwordsMismatch
                }
            ];
        }

        return new Validator(validationSchema);
    }

    updateProfile(formData) {
        const allowedUserProperties = [
            'email',
            'firstName',
            'lastName',
            'birthday',
            'country',
            'postcode',
            'city',
            'street',
            'streetNumber',
            'oldPassword'
        ];

        const allowedContractProperties = ['paymentMethod', 'IBAN'];

        const validator = this.prepareValidator(formData);

        validator.validate(formData, errors => {
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
                if (formData.newPassword) {
                    allowedUserProperties.push('newPassword');
                }
                performUpdateUserData({
                    ...pick(formData, allowedUserProperties),
                    ...pick(formData.contract, allowedContractProperties)
                });
                this.setState({ errors: {} });
            }
        });
    }

    translatedErrors() {
        const { formatMessage } = this.context.intl;
        const { errors = {} } = this.state;

        return Object.keys(errors).reduce(
            (errorsMap, key) => ({
                ...errorsMap,
                [key]: formatMessage(errors[key])
            }),
            {}
        );
    }

    render() {
        const { locale, formatMessage } = this.context.intl;
        const labels = this.prepareLabels(messages);

        return (
            <section className="profile-page">
                <header className="profile-page-header">
                    <h1>{formatMessage(messages.header)}</h1>
                </header>
                <div className="profile-page-form">
                    <ProfileForm
                        locale={locale}
                        labels={labels}
                        profile={this.props.profile}
                        errors={this.translatedErrors()}
                        onSubmit={formData => this.updateProfile(formData)}
                    />
                </div>
            </section>
        );
    }
}

Profile.contextTypes = {
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired
};

Profile.propTypes = {
    loading: PropTypes.bool,
    profile: PropTypes.object,
    updatedProfile: PropTypes.object,
    loadingError: PropTypes.object,
    updatingError: PropTypes.object
};
Profile.defaultProps = {
    loading: false,
    profile: {},
    updatedProfile: {},
    loadingError: null,
    updatingError: null
};

export default connect(Profile.mapStateToProps)(Profile);
