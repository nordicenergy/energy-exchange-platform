import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import faShoppingCart from '@fortawesome/fontawesome-free-solid/faShoppingCart';

import { BackLink, ProducerCardsPanel, ProducersFilter } from '../../components';
import { PATHS, PLANT_TYPES, PRODUCER_STATUSES } from '../../constants';
import { convertPlantType, convertProducerStatus } from '../../services/translations/enums';
import { BuyEnergy as messages, Breadcrumbs as breadcrumbs } from '../../services/translations/messages';
import { performGetCurrentProducer, performGetProducers } from '../../action_performers/producers';
import { performSetupLoaderVisibility } from '../../action_performers/app';
import { performPushNotification } from '../../action_performers/notifications';

import AppPage from '../__shared__/AppPage';
import availableWithValidContract from '../__shared__/decorators/availableWithValidContract';

import './BuyEnergy.css';

const FILTER_OPTIONS = [
    {
        name: 'wind',
        label: convertPlantType(PLANT_TYPES.wind),
        type: PLANT_TYPES.wind
    },
    {
        name: 'solar',
        label: convertPlantType(PLANT_TYPES.solar),
        type: PLANT_TYPES.solar
    },
    {
        name: 'biomass',
        label: convertPlantType(PLANT_TYPES.biomass),
        type: PLANT_TYPES.biomass
    }
];

export class BuyEnergy extends AppPage {
    constructor(props, context) {
        super(props, context);

        this.state = {
            filter: null,
            page: 0
        };
    }

    static mapStateToProps({ Users, Producers, App }) {
        return {
            user: Users.profile.data.user,
            error: Producers.currentProducer.error || Producers.producers.error,
            loading: Producers.currentProducer.loading || Users.profile.loading,
            currentProducer: Producers.currentProducer.data,
            producersLoading: Producers.producers.loading,
            producers: Producers.producers.data.entries,
            hasNextProducers: Producers.producers.data.total > Producers.producers.data.entries.length,
            locale: App.localization.data.locale
        };
    }

    componentDidMount() {
        performGetProducers();
        performGetCurrentProducer();
        this.setupBuyEnergyBreadcrumbs();

        const loadCondition = () => {
            const { hasNextProducers, producersLoading } = this.props;
            return hasNextProducers && !producersLoading;
        };
        const loadCallback = () => {
            this.setState(prevState => ({
                page: prevState.page + 1
            }));
        };
        this.setupScrollHandler(loadCondition, loadCallback);
    }

    componentDidUpdate(prevProps, prevState) {
        const { formatMessage } = this.context.intl;
        const { error: oldError } = prevProps;
        const { loading, user, producersLoading, error: newError, locale } = this.props;
        const shouldShowFullScreenLoader = loading || (producersLoading && this.state.page === 0);

        if (prevState.page !== this.state.page || prevState.filter !== this.state.filter) {
            performGetProducers({ page: this.state.page, filter: this.state.filter });
        }

        if (locale !== prevProps.locale) {
            this.setupBuyEnergyBreadcrumbs();
        }

        if (!loading && !producersLoading && user && user.id && prevProps.user !== user) {
            performGetCurrentProducer();
        }

        if (!loading && !producersLoading && newError && newError !== oldError) {
            performPushNotification({ message: formatMessage(messages.loadingErrorMessage), type: 'error' });
        }

        if (prevProps.loading !== loading || prevProps.producersLoading !== producersLoading) {
            performSetupLoaderVisibility(this.pageId, shouldShowFullScreenLoader);
        }
    }

    componentWillUnmount() {
        this.removeScrollHandler();
        this.scrollToTop();
    }

    prepareFilterOptions() {
        const { formatMessage } = this.context.intl;
        return FILTER_OPTIONS.map(option => ({
            name: option.name,
            label: formatMessage(option.label),
            type: option.type
        }));
    }

    prepareProducers() {
        const { formatMessage } = this.context.intl;
        const { producers } = this.props;
        return producers.map(producer => {
            const plantType = formatMessage(convertPlantType(producer.plantType));
            const status =
                producer.status === PRODUCER_STATUSES.soldOut
                    ? formatMessage(convertProducerStatus(producer.status))
                    : null;

            return { ...producer, status, plantType };
        });
    }

    setupBuyEnergyBreadcrumbs() {
        const { formatMessage } = this.context.intl;
        this.setupBreadcrumbs([
            {
                ...PATHS.buyEnergy,
                icon: faShoppingCart,
                label: formatMessage(breadcrumbs.buyEnergy)
            }
        ]);
    }

    handleBackLinkClick(event) {
        event.preventDefault();
        const { history } = this.context.router;
        history.push(PATHS.overview.path);
    }

    handleFilterChange(filter) {
        this.setState({ filter, page: 0 });
    }

    handleProducerClick(producerId) {
        const { history } = this.context.router;
        history.push(`${PATHS.buyEnergy.path}/${PATHS.producer.id}/${producerId}`);
    }

    render() {
        const { formatMessage } = this.context.intl;
        const { currentProducer, producersLoading } = this.props;
        const { filter, page } = this.state;
        const shouldShowListLoader = producersLoading && page >= 1;

        return (
            <section className="buy-energy-page">
                <header className="buy-energy-page-header">
                    <h1>
                        <BackLink onClick={event => this.handleBackLinkClick(event)} />
                        <span>{formatMessage(messages.pageTitle)}</span>
                    </h1>
                    <h2>
                        {formatMessage(messages.selectedProducerLabel)} <strong>{currentProducer.name}</strong>
                    </h2>
                </header>
                <ProducersFilter
                    labels={{
                        helpMessage: formatMessage(messages.filterLabel),
                        defaultOption: formatMessage(messages.filterOptionAll)
                    }}
                    options={this.prepareFilterOptions()}
                    value={filter}
                    onChange={filter => this.handleFilterChange(filter)}
                />
                <ProducerCardsPanel
                    className="buy-energy-page-producers"
                    loading={shouldShowListLoader}
                    producers={this.prepareProducers()}
                    selectedProducerId={currentProducer.id}
                    onProducerClick={producerId => {
                        this.handleProducerClick(producerId);
                    }}
                />
            </section>
        );
    }
}

BuyEnergy.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.shape({
            push: PropTypes.func.isRequired
        })
    }),
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired
};
BuyEnergy.propTypes = {
    user: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    currentProducer: PropTypes.object.isRequired,
    producersLoading: PropTypes.bool.isRequired,
    producers: PropTypes.arrayOf(PropTypes.object).isRequired,
    hasNextProducers: PropTypes.bool.isRequired,
    locale: PropTypes.string
};
BuyEnergy.defaultProps = { user: {} };

export default connect(BuyEnergy.mapStateToProps)(availableWithValidContract(BuyEnergy));
