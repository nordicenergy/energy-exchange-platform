import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import faHome from '@fortawesome/fontawesome-free-solid/faHome';

import { ProducerInfo, Button, BackLink } from '../../components';
import { PATHS } from '../../constants';
import { Producer as messages, Breadcrumbs as breadcrumbs } from '../../services/translations/messages';
import { performGetUserData } from '../../action_performers/users';
import { performGetProducer, performGetProducerHistory } from '../../action_performers/producers';
import { performSetupLoaderVisibility } from '../../action_performers/app';
import { performPushNotification } from '../../action_performers/notifications';

import AppPage from '../__shared__/AppPage';
import availableWithValidContract from '../__shared__/decorators/availableWithValidContract';
import { prepareProducerInfoProps } from '../Producer';

import './MyProducer.css';

export class MyProducer extends AppPage {
    static mapStateToProps(state) {
        return {
            loading:
                state.Producers.producer.loading ||
                state.Users.profile.loading ||
                state.Producers.producerHistory.loading,
            user: state.Users.profile.data.user,
            producer: state.Producers.producer.data,
            producerHistory: state.Producers.producerHistory.data,
            error: state.Producers.producer.error || state.Users.profile.error || state.Producers.producerHistory.error,
            locale: state.App.localization.data.locale
        };
    }

    componentDidMount() {
        performGetUserData();
        this.fetchProducer();
        this.setupMyProducerBreadcrumbs();
    }

    componentDidUpdate(prevProps) {
        const { formatMessage } = this.context.intl;
        const { user: prevUser = {}, error: oldError } = prevProps;
        const { user = {}, loading, error, locale } = this.props;

        if (user.currentProducerId !== prevUser.currentProducerId) {
            this.fetchProducer();
        }

        if (locale !== prevProps.locale) {
            this.setupMyProducerBreadcrumbs();
        }

        if (!loading && error && error !== oldError) {
            performPushNotification({ message: formatMessage(messages.loadingErrorMessage), type: 'error' });
        }

        if (prevProps.loading !== loading) {
            performSetupLoaderVisibility(this.pageId, loading);
        }
    }

    fetchProducer() {
        const { user = {} } = this.props;
        if (user && user.currentProducerId) {
            performGetProducer(user.currentProducerId);
            performGetProducerHistory(user.currentProducerId);
        }
    }

    setupMyProducerBreadcrumbs() {
        const { formatMessage } = this.context.intl;
        this.setupBreadcrumbs([
            { ...PATHS.overview, icon: faHome, label: formatMessage(breadcrumbs.overview) },
            {
                ...PATHS.myProducer,
                label: formatMessage(breadcrumbs.myProducer)
            }
        ]);
    }

    handleBackLinkClick(event) {
        event.preventDefault();
        const { history } = this.context.router;
        history.push(PATHS.overview.path);
    }

    openProducersPage() {
        const { history } = this.context.router;
        history.push(PATHS.buyEnergy.path);
    }

    render() {
        const { formatMessage } = this.context.intl;
        const { loading, producer = {}, user = {} } = this.props;

        const producerInfoProps = prepareProducerInfoProps(formatMessage, producer, user);

        return (
            <section className="my-producer-page" aria-busy={loading}>
                <section className="my-producer-page-info-container">
                    <h1>
                        <BackLink onClick={event => this.handleBackLinkClick(event)} />
                        <span>{formatMessage(messages.header)}</span>
                    </h1>
                    <ProducerInfo {...producerInfoProps} />
                </section>
                <section className="my-producer-page-controls">
                    <Button onClick={() => this.openProducersPage()}>{formatMessage(messages.showButton)}</Button>
                </section>
            </section>
        );
    }
}

MyProducer.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.shape({
            push: PropTypes.func.isRequired
        })
    }),
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired
};

MyProducer.propTypes = {
    loading: PropTypes.bool,
    producer: PropTypes.object,
    producerHistory: PropTypes.array,
    user: PropTypes.object,
    error: PropTypes.object,
    locale: PropTypes.string
};

MyProducer.defaultProps = {
    loading: false,
    producer: {},
    producerHistory: [],
    user: {},
    error: null
};

export default connect(MyProducer.mapStateToProps)(availableWithValidContract(MyProducer));
