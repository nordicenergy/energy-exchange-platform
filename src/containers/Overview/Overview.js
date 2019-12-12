import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import faHome from '@fortawesome/fontawesome-free-solid/faHome';

import { Alert, NavigationCardsPanel, EmptyRecentTransactions, RecentTransactions } from '../../components';
import { PATHS, CONTRACT_STATUSES } from '../../constants';
import {
    Overview as messages,
    Breadcrumbs as breadcrumbs,
    ContractStatuses as contractStatuses
} from '../../services/translations/messages';
import { formatFloat } from '../../services/formatter';
import { convertTransactionStatus } from '../../services/translations/enums';
import { performGetRecentTransactions } from '../../action_performers/transactions';
import { performGetUserData } from '../../action_performers/users';
import { performSetupLoaderVisibility } from '../../action_performers/app';
import { performPushNotification } from '../../action_performers/notifications';

import AppPage from '../__shared__/AppPage';
import contractStatusMixin from '../__shared__/mixins/contractStatus';

import './Overview.css';

const UPDATE_INTERVAL = 1000 * 60; // 1m

export class Overview extends contractStatusMixin(AppPage) {
    static mapStateToProps(state) {
        return {
            loading: state.Users.profile.loading,
            recentTransactions: state.Transactions.recentTransactions.data,
            user: state.Users.profile.data.user,
            error: state.Transactions.recentTransactions.error || state.Users.profile.error
        };
    }

    constructor(...args) {
        super(...args);
        this.intervalId = null;
    }

    componentDidMount() {
        const { formatMessage } = this.context.intl;
        this.setupBreadcrumbs([
            {
                ...PATHS.overview,
                icon: faHome,
                label: formatMessage(breadcrumbs.overview)
            }
        ]);
        performGetUserData();
    }

    componentDidUpdate(prevProps) {
        const { formatMessage } = this.context.intl;
        const { user, loading, error } = this.props;

        if (!loading && user !== prevProps.user) {
            this.stopTransactionsUpdating();
            this.startTransactionsUpdating();
        }

        if (!loading && error && error !== prevProps.error) {
            performPushNotification({ message: formatMessage(messages.loadingErrorMessage), type: 'error' });
        }

        if (prevProps.loading !== loading) {
            performSetupLoaderVisibility(this.pageId, loading);
        }
    }

    componentWillUnmount() {
        this.stopTransactionsUpdating();
    }

    startTransactionsUpdating() {
        const { user } = this.props;

        if (!this.intervalId) {
            performGetRecentTransactions(user.id);
        }

        this.intervalId = setInterval(() => {
            performGetRecentTransactions(user.id);
        }, UPDATE_INTERVAL);
    }

    stopTransactionsUpdating() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    navigateTo(route) {
        this.context.router.history.push(route);
    }

    openTransactionsPage() {
        this.navigateTo(PATHS.showTransactions.path);
    }

    renderAlert(contractHasValidStatus, labels) {
        const user = this.props.user;

        if (!user.contract.statusCode || contractHasValidStatus) {
            return null;
        }

        if (user.contract.statusCode === CONTRACT_STATUSES.waiting) {
            return <Alert className="alert--overview">{labels.contractWaitingStatusCode}</Alert>;
        }

        return <Alert className="alert--overview">{labels.contractOthersStatusCodes}</Alert>;
    }

    render() {
        const { user, recentTransactions: { transactions = [], currentBalance = 0 }, loading } = this.props;
        const { formatMessage } = this.context.intl;
        const statusMessageId = contractStatuses[`status${user.contract.statusCode}`];
        const labels = this.prepareLabels(messages, {
            statusCodeTitle: statusMessageId ? formatMessage(statusMessageId) : '?'
        });
        const formattedTransactions = transactions.map(tx => ({
            ...tx,
            description: `${labels.recentTransactionsDescriptionBought} ${formatFloat(tx.energyAmount)} kWh ${
                labels.recentTransactionsDescriptionFrom
            } "${tx.producerName}"`,
            details: {
                ...tx.details,
                status: formatMessage(convertTransactionStatus(tx.details && tx.details.status))
            }
        }));
        const contractHasValidStatus = this.validateContractStatus(user.contract.statusCode);
        const navigationCards = [
            {
                type: PATHS.myProducer.id,
                title: labels.myProducer,
                path: PATHS.myProducer.path,
                disabled: !contractHasValidStatus
            },
            {
                type: PATHS.buyEnergy.id,
                title: labels.buyEnergy,
                path: PATHS.buyEnergy.path,
                disabled: !contractHasValidStatus
            },
            {
                type: PATHS.sellEnergy.id,
                title: labels.sellEnergy,
                path: PATHS.sellEnergy.path,
                disabled: true
            }
        ];

        return (
            <section className="overview-page" aria-busy={loading}>
                {this.renderAlert(contractHasValidStatus, labels)}
                <NavigationCardsPanel
                    navigationCards={navigationCards}
                    onCardClick={route => this.navigateTo(route)}
                    labels={labels}
                />
                <div className="overview-content-container">
                    {contractHasValidStatus ? (
                        <RecentTransactions
                            transactions={formattedTransactions}
                            currentBalance={currentBalance}
                            labels={labels}
                            onButtonClick={() => this.openTransactionsPage()}
                        />
                    ) : (
                        <EmptyRecentTransactions
                            title={labels.recentTransactionsTitle}
                            message={labels.recentTransactionsEmptyMessage}
                        />
                    )}
                </div>
            </section>
        );
    }
}

Overview.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.shape({
            push: PropTypes.func.isRequired
        }).isRequired
    }),
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired
};
Overview.propTypes = {
    loading: PropTypes.bool,
    recentTransactions: PropTypes.object,
    user: PropTypes.object,
    error: PropTypes.object
};
Overview.defaultProps = {
    loading: false,
    recentTransactions: {},
    user: {},
    error: null
};

export default connect(Overview.mapStateToProps)(Overview);
