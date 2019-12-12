import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Validator from 'async-validator';

import { MeterReadingForm, MeterReadingsHistory } from '../../components';
import { SubmitMeterReadings as messages } from '../../services/translations/messages';
import {
    performGetMeterReadingsHistory,
    performGetMeterNumber,
    performSubmitMeterReading
} from '../../action_performers/consumption';
import { performSetupLoaderVisibility } from '../../action_performers/app';
import { performPushNotification } from '../../action_performers/notifications';

import AppPage from '../__shared__/AppPage';

import contractStatusMixin from '../__shared__/mixins/contractStatus';

import './SubmitMeter.css';

export class SubmitMeter extends contractStatusMixin(AppPage) {
    constructor(props, context) {
        super(props, context);

        this.state = {
            errors: {},
            page: 0
        };
    }

    static mapStateToProps(state) {
        const { data: readingsData } = state.Consumption.meterReadingsHistory;

        return {
            user: state.Users.profile.data.user,
            meterReadingsHistory: readingsData,
            meterReadingsHistoryLoading: state.Consumption.meterReadingsHistory.loading,
            hasNextReadingsHistory: readingsData.count > readingsData.readings.length,
            meterNumber: state.Consumption.meterNumber.data.meterNumber,
            submittedMeterReading: state.Consumption.submittedMeterReading,
            sessionContract: state.Contracts.sessionContract.data,
            loading:
                state.Consumption.submittedMeterReading.loading ||
                state.Consumption.meterNumber.loading ||
                state.Contracts.sessionContract.loading ||
                state.Users.profile.loading,
            error: state.Consumption.meterReadingsHistory.error || state.Consumption.meterNumber.error,
            errorSubmit: state.Consumption.submittedMeterReading.error
        };
    }

    componentDidMount() {
        performGetMeterReadingsHistory(this.state.page);
        performGetMeterNumber();

        const loadCondition = () => {
            const { hasNextReadingsHistory, meterReadingsHistoryLoading } = this.props;
            return hasNextReadingsHistory && !meterReadingsHistoryLoading;
        };
        const loadCallback = () => {
            this.setState(state => ({ page: state.page + 1 }));
        };

        this.setScrollContainer('reading-history-container');
        this.setupScrollHandler(loadCondition, loadCallback);

        this.handleIncorrectContractStatus();
    }

    componentDidUpdate(prevProps, prevState) {
        const { formatMessage } = this.context.intl;
        const { loading, user, error, errorSubmit, submittedMeterReading, sessionContract } = this.props;
        const isUserChanged = !loading && user && user.id && user !== prevProps.user;

        if (isUserChanged) {
            performGetMeterNumber();
        }

        if (isUserChanged || prevState.page !== this.state.page) {
            performGetMeterReadingsHistory(this.state.page);
        }

        if (!loading && !error && !errorSubmit && submittedMeterReading.data !== prevProps.submittedMeterReading.data) {
            performPushNotification({ message: formatMessage(messages.successMessage), type: 'success' });
        }

        if (!loading && error && error !== prevProps.error) {
            performPushNotification({ message: formatMessage(messages.loadingErrorMessage), type: 'error' });
        }

        if (!loading && errorSubmit && errorSubmit !== prevProps.errorSubmit) {
            performPushNotification({
                type: 'error',
                message: `${formatMessage(messages.submitErrorMessage)}: [${errorSubmit.message}]`
            });
        }

        if (prevProps.loading !== loading) {
            performSetupLoaderVisibility(this.pageId, loading);
        }

        if (prevProps.sessionContract !== sessionContract) {
            this.handleIncorrectContractStatus();
        }
    }

    componentWillUnmount() {
        this.removeScrollHandler();
    }

    prepareValidator() {
        const { formatMessage } = this.context.intl;
        const validationSchema = {
            meterReadings: {
                type: 'number',
                required: true,
                transform(value) {
                    return (value && Number(value)) || value;
                },
                message: formatMessage(messages.meterReadingNumber)
            },
            date: {
                required: true,
                message: formatMessage(messages.dateRequired)
            }
        };

        return new Validator(validationSchema);
    }

    handleIncorrectContractStatus() {
        const { formatMessage } = this.context.intl;
        const { sessionContract } = this.props;

        if (sessionContract && !this.validateContractStatusKeyForSaveMeterReadings(sessionContract.status)) {
            performPushNotification({
                type: 'error',
                message: formatMessage(messages.incorrectContractStatus)
            });
        }
    }

    submitMeterReading(meterReading) {
        const validator = this.prepareValidator();

        validator.validate(meterReading, errors => {
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
            performSubmitMeterReading(meterReading);
            this.setState({ errors: {} });
        });
    }

    render() {
        const { formatMessage, locale } = this.context.intl;
        const labels = this.prepareLabels(messages);
        const {
            props: {
                loading,
                meterReadingsHistoryLoading,
                meterNumber,
                submittedMeterReading,
                meterReadingsHistory,
                sessionContract
            },
            state: { errors }
        } = this;

        const historyData = meterReadingsHistory.readings || [];
        const isMeterReadingSuccessfullySubmit = !submittedMeterReading.loading && !submittedMeterReading.error;
        const isContractStatusValid =
            sessionContract && this.validateContractStatusKeyForSaveMeterReadings(sessionContract.status);

        return (
            <section className="submit-meter-readings-page" aria-busy={loading}>
                <section>
                    <h1>{formatMessage(messages.header)}</h1>
                    <MeterReadingForm
                        isSuccessfullySubmitted={isMeterReadingSuccessfullySubmit}
                        errors={errors}
                        labels={labels}
                        locale={locale}
                        disabled={!isContractStatusValid}
                        numberOfMeter={meterNumber}
                        onSubmit={meterReading => this.submitMeterReading(meterReading)}
                    />
                </section>
                <aside id="reading-history-container">
                    <MeterReadingsHistory
                        data={historyData}
                        title={labels.historyCaption}
                        noDataMessage={labels.noData}
                        loading={meterReadingsHistoryLoading}
                    />
                </aside>
            </section>
        );
    }
}

SubmitMeter.contextTypes = {
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired
};

SubmitMeter.propTypes = {
    meterReadingsHistory: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.object),
        count: PropTypes.number
    }).isRequired,
    loading: PropTypes.bool,
    user: PropTypes.object,
    sessionContract: PropTypes.object,
    meterNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    submittedMeterReading: PropTypes.shape({
        data: PropTypes.object,
        loading: PropTypes.bool,
        error: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    }).isRequired,
    meterReadingsHistoryLoading: PropTypes.bool,
    hasNextReadingsHistory: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    errorSubmit: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default connect(SubmitMeter.mapStateToProps)(SubmitMeter);
