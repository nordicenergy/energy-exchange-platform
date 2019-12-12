import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import faHome from '@fortawesome/fontawesome-free-solid/faHome';

import { RecentTransactions, BackLink } from '../../components';
import { PATHS } from '../../constants';
import { formatFloat } from '../../services/formatter';
import { convertTransactionStatus } from '../../services/translations/enums';
import { ShowTransactions as messages, Breadcrumbs as breadcrumbs } from '../../services/translations/messages';
import { performGetUserData } from '../../action_performers/users';
import { performGetRecentTransactions } from '../../action_performers/transactions';
import { performSetupLoaderVisibility } from '../../action_performers/app';
import { performPushNotification } from '../../action_performers/notifications';

import AppPage from '../__shared__/AppPage';
import availableWithValidContract from '../__shared__/decorators/availableWithValidContract';

import './ShowTransactions.css';

export class ShowTransactions extends AppPage {
    constructor(props, context) {
        super(props, context);
        this.identifier = Symbol('ShowTransactions');
        this.state = { page: 0 };
    }

    static mapStateToProps(state) {
        const { data: txData } = state.Transactions.recentTransactions;

        return {
            loading: state.Users.profile.loading,
            transactionsLoading: state.Transactions.recentTransactions.loading,
            hasNextTransactions: txData.numberOfTransactions > txData.transactions.length,
            recentTransactions: state.Transactions.recentTransactions.data,
            user: state.Users.profile.data.user,
            error: state.Transactions.recentTransactions.error || state.Users.profile.error,
            locale: state.App.localization.data.locale
        };
    }

    componentDidMount() {
        performGetUserData();
        this.setupShowTransactionsBreadcrumbs();

        const loadCondition = () => {
            const { hasNextTransactions, transactionsLoading } = this.props;
            return hasNextTransactions && !transactionsLoading;
        };
        const loadCallback = () => {
            this.setState(state => ({
                page: state.page + 1
            }));
        };
        this.setupScrollHandler(loadCondition, loadCallback);
    }

    componentDidUpdate(prevProps, prevState) {
        const { formatMessage } = this.context.intl;
        const { user, loading, error, locale } = this.props;

        if (user !== prevProps.user || prevState.page !== this.state.page) {
            performGetRecentTransactions(this.props.user.id, this.state.page);
        }

        if (locale !== prevProps.locale) {
            this.setupShowTransactionsBreadcrumbs();
        }

        if (!loading && error && error !== prevProps.error) {
            performPushNotification({ message: formatMessage(messages.loadingErrorMessage), type: 'error' });
        }

        if (prevProps.loading !== loading) {
            performSetupLoaderVisibility(this.pageId, loading);
        }
    }

    setupShowTransactionsBreadcrumbs() {
        const { formatMessage } = this.context.intl;
        this.setupBreadcrumbs([
            {
                ...PATHS.overview,
                icon: faHome,
                label: formatMessage(breadcrumbs.overview)
            },
            {
                ...PATHS.showTransactions,
                label: formatMessage(breadcrumbs.showTransactions)
            }
        ]);
    }

    componentWillUnmount() {
        this.removeScrollHandler();
        this.scrollToTop();
    }

    backToOverviewPage(event) {
        event.preventDefault();
        const { history } = this.context.router;
        history.push(PATHS.overview.path);
    }

    render() {
        const { formatMessage } = this.context.intl;
        const labels = this.prepareLabels(messages);
        const {
            recentTransactions: { transactions = [], currentBalance = 0 },
            transactionsLoading,
            loading
        } = this.props;
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

        return (
            <section className="show-transaction-page" aria-busy={loading}>
                <h1>
                    <BackLink onClick={event => this.backToOverviewPage(event)} />
                    <span>{labels.header}</span>
                </h1>
                <section>
                    <RecentTransactions
                        transactions={formattedTransactions}
                        currentBalance={currentBalance}
                        labels={labels}
                        loading={transactionsLoading}
                        pagination
                    />
                </section>
            </section>
        );
    }
}

ShowTransactions.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.shape({
            push: PropTypes.func.isRequired
        }).isRequired
    }),
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired
};
ShowTransactions.propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.object,
    recentTransactions: PropTypes.object,
    user: PropTypes.object,
    locale: PropTypes.string
};
ShowTransactions.defaultProps = {
    loading: false,
    recentTransactions: {},
    user: {},
    error: null
};

export default connect(ShowTransactions.mapStateToProps)(availableWithValidContract(ShowTransactions));
