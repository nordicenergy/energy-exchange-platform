import {
    getProducer,
    getCurrentProducer,
    getProducers,
    selectProducer,
    getProducerHistory,
    getOwnedProducerOffer,
    addOwnedProducerOffer,
    getOwnedProducerOffersHistory,
    getCurrentMarketPrice
} from '../services/api/producers';

import { dispatcher } from '../store';

export function performGetProducer(id) {
    dispatcher.dispatchPromise(getProducer, 'GET_PRODUCER', state => state.Producers.producer.loading, [id]);
}

export function performGetCurrentProducer() {
    dispatcher.dispatchPromise(
        getCurrentProducer,
        'GET_CURRENT_PRODUCER',
        state => state.Producers.currentProducer.loading,
        []
    );
}

export function performGetProducers(queryParams) {
    dispatcher.dispatchPromise(getProducers, 'GET_PRODUCERS', state => state.Producers.producer.loading, [queryParams]);
}

export function performSelectProducer(id) {
    dispatcher.dispatchPromise(selectProducer, 'SELECT_PRODUCER', state => state.Producers.selectedProducer.loading, [
        id
    ]);
}

export function performGetProducerHistory(producerId) {
    dispatcher.dispatchPromise(
        getProducerHistory,
        'GET_PRODUCER_HISTORY',
        state => state.Producers.producerHistory.loading,
        [producerId]
    );
}

export function performGetOwnedProducerOffer(userId) {
    dispatcher.dispatchPromise(
        getOwnedProducerOffer,
        'GET_OWNED_PRODUCER_OFFER',
        state => state.Producers.ownedProducerOffer.loading,
        [userId]
    );
}

export function performAddOwnedProducerOffer(producerId, offer) {
    dispatcher.dispatchPromise(
        addOwnedProducerOffer,
        'ADD_OWNED_PRODUCER_OFFER',
        state => state.Producers.ownedProducerOffer.loading,
        [producerId, offer]
    );
}

export function performGetOwnedProducerOffersHistory(userId) {
    dispatcher.dispatchPromise(
        getOwnedProducerOffersHistory,
        'GET_OWNED_PRODUCER_OFFERS_HISTORY',
        state => state.Producers.ownedProducerOffersHistory.loading,
        [userId]
    );
}

export function performGetCurrentMarketPrice() {
    dispatcher.dispatchPromise(
        getCurrentMarketPrice,
        'GET_CURRENT_MARKET_PRICE',
        state => state.Producers.currentMarketPrice.loading,
        []
    );
}
