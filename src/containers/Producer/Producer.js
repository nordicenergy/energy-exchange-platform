import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import faShoppingCart from '@fortawesome/fontawesome-free-solid/faShoppingCart';

import { ProducerInfo, Button, BackLink, HelpIcon } from '../../components';
import { PATHS, PRODUCER_STATUSES } from '../../constants';
import { Producer as messages, Breadcrumbs as breadcrumbs } from '../../services/translations/messages';
import { convertProducerStatus } from '../../services/translations/enums';
import { performGetProducer, performSelectProducer } from '../../action_performers/producers';
import { performSetupLoaderVisibility } from '../../action_performers/app';
import { performPushNotification } from '../../action_performers/notifications';
import { performGetUserData } from '../../action_performers/users';

import AppPage from '../__shared__/AppPage';
import availableWithValidContract from '../__shared__/decorators/availableWithValidContract';
import { prepareProducerInfoProps } from './.';

import './Producer.css';

export class Producer extends AppPage {
    static mapStateToProps(state) {
        return {
            loading:
                state.Producers.producer.loading ||
                state.Users.profile.loading ||
                state.Producers.selectedProducer.loading,
            producer: state.Producers.producer.data,
            user: state.Users.profile.data.user,
            selectedProducer: state.Producers.selectedProducer.data,
            error: state.Producers.producer.error || state.Users.profile.error,
            errorSelect: state.Producers.selectedProducer.error,
            locale: state.App.localization.data.locale
        };
    }

    componentDidMount() {
        const { match: { params } = {} } = this.props;

        performGetProducer(params.producerId);
        performGetUserData();
        this.setupProducerBreadcrumbs();
    }

    componentDidUpdate(prevProps) {
        const { formatMessage } = this.context.intl;
        const { producer: prevProducer = {}, selectedProducer: prevSelectedProducer = {}, error: oldError } = prevProps;
        const { producer = {}, selectedProducer = {}, error, errorSelect, loading, locale } = this.props;

        if (prevProducer.id !== producer.id || prevProducer.name !== producer.name || locale !== prevProps.locale) {
            this.setupProducerBreadcrumbs();
        }

        if (prevSelectedProducer !== selectedProducer) {
            performPushNotification({ message: formatMessage(messages.selectMessage), type: 'success' });
            this.navigateToOverview();
        }

        if (!loading && error && error !== oldError) {
            performPushNotification({ message: formatMessage(messages.loadingErrorMessage), type: 'error' });
        }

        if (!loading && errorSelect && errorSelect !== prevProps.errorSelect) {
            performPushNotification({ message: formatMessage(messages.selectErrorMessage), type: 'error' });
        }

        if (prevProps.loading !== loading) {
            performSetupLoaderVisibility(this.pageId, loading);
        }
    }

    setupProducerBreadcrumbs() {
        const { formatMessage } = this.context.intl;
        const { producer } = this.props;
        if (producer && producer.name) {
            this.setupBreadcrumbs([
                {
                    ...PATHS.buyEnergy,
                    icon: faShoppingCart,
                    label: formatMessage(breadcrumbs.buyEnergy)
                },
                {
                    ...PATHS.producer,
                    path: PATHS.producer.path.replace(':producerId', producer.id),
                    label: producer.name
                }
            ]);
        }
    }

    backToProducers() {
        const { history } = this.context.router;
        history.push(PATHS.buyEnergy.path);
    }

    handleBackLinkClick(event) {
        event.preventDefault();
        const { history } = this.context.router;
        history.push(PATHS.buyEnergy.path);
    }

    navigateToOverview() {
        const { history } = this.context.router;
        history.push(PATHS.overview.path);
    }

    render() {
        const { formatMessage } = this.context.intl;
        const { loading, producer = {}, user = {} } = this.props;
        const producerInfoProps = prepareProducerInfoProps(formatMessage, producer, user);
        const isSoldOut = producer.status === PRODUCER_STATUSES.soldOut;

        return (
            <section className="producer-page" aria-busy={loading}>
                <section className="producer-page-info-container">
                    <h1>
                        <BackLink onClick={event => this.handleBackLinkClick(event)} />
                        <span>{producer.name}</span>
                    </h1>
                    {isSoldOut ? (
                        <div className="producer-page-status">
                            <strong aria-label="Producer Status">
                                {formatMessage(convertProducerStatus(PRODUCER_STATUSES.soldOut))}
                            </strong>
                        </div>
                    ) : null}
                    <ProducerInfo {...producerInfoProps} />
                </section>
                <section className="producer-page-controls">
                    <Button className="producer-page-back-to-producers" onClick={() => this.backToProducers()}>
                        {formatMessage(messages.showButton)}
                    </Button>
                    <Button disabled={isSoldOut} onClick={() => performSelectProducer(producer.id)}>
                        {formatMessage(messages.selectButton)}
                    </Button>
                    {isSoldOut ? (
                        <div className="producer-page-help">
                            <HelpIcon text={formatMessage(messages.producerSoldOutHelpText)} />
                        </div>
                    ) : null}
                </section>
            </section>
        );
    }
}

Producer.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.shape({
            push: PropTypes.func.isRequired
        })
    }),
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired
};

Producer.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            producerId: PropTypes.string.isRequired
        })
    }),
    loading: PropTypes.bool,
    producer: PropTypes.object,
    user: PropTypes.object,
    error: PropTypes.object,
    errorSelect: PropTypes.object,
    locale: PropTypes.string
};

Producer.defaultProps = {
    loading: false,
    producer: {},
    error: null,
    errorSelect: null,
    user: {}
};

export default connect(Producer.mapStateToProps)(availableWithValidContract(Producer));
