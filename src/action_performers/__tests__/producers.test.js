import { dispatcher } from '../../store';
import {
    performGetProducer,
    performGetCurrentProducer,
    performGetProducers,
    performSelectProducer,
    performGetProducerHistory,
    performGetOwnedProducerOffer,
    performAddOwnedProducerOffer,
    performGetOwnedProducerOffersHistory,
    performGetCurrentMarketPrice
} from '../producers';

describe('Producers action performers', () => {
    beforeEach(() => {
        dispatcher.dispatchPromise = jest.fn();
    });

    it('should call dispatch method for get specific producer', () => {
        performGetProducer('testId');

        const [firstCall] = dispatcher.dispatchPromise.mock.calls;
        const [method, type, loadingFunc, meta] = firstCall;
        const loading = loadingFunc({
            Producers: { producer: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('getProducer');
        expect(type).toEqual('GET_PRODUCER');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual(['testId']);
    });

    it('should call dispatch method for get current producer', () => {
        performGetCurrentProducer();

        const [method, type, loadingFunc, meta] = dispatcher.dispatchPromise.mock.calls[0];
        const loading = loadingFunc({
            Producers: { currentProducer: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('getCurrentProducer');
        expect(type).toEqual('GET_CURRENT_PRODUCER');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual([]);
    });

    it('should call dispatch method for get producers list', () => {
        const queryParamsMock = { page: 5 };

        performGetProducers(queryParamsMock);

        const [method, type, loadingFunc, meta] = dispatcher.dispatchPromise.mock.calls[0];
        const loading = loadingFunc({
            Producers: { producer: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('getProducers');
        expect(type).toEqual('GET_PRODUCERS');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual([queryParamsMock]);
    });

    it('should call dispatch method for get selecting producer', () => {
        performSelectProducer('testId');

        const [[method, type, loadingFunc, meta]] = dispatcher.dispatchPromise.mock.calls;
        const loading = loadingFunc({
            Producers: { selectedProducer: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('selectProducer');
        expect(type).toEqual('SELECT_PRODUCER');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual(['testId']);
    });

    it('should call dispatch method for getting producer history', () => {
        performGetProducerHistory('testId');

        const [[method, type, loadingFunc, meta]] = dispatcher.dispatchPromise.mock.calls;
        const loading = loadingFunc({
            Producers: { producerHistory: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('getProducerHistory');
        expect(type).toEqual('GET_PRODUCER_HISTORY');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual(['testId']);
    });

    it('should call dispatch method for getting owned producer', () => {
        performGetOwnedProducerOffer('testId');

        const [[method, type, loadingFunc, meta]] = dispatcher.dispatchPromise.mock.calls;
        const loading = loadingFunc({
            Producers: { ownedProducerOffer: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('getOwnedProducerOffer');
        expect(type).toEqual('GET_OWNED_PRODUCER_OFFER');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual(['testId']);
    });

    it('should call dispatch method for adding owned producer offer', () => {
        performAddOwnedProducerOffer('testId', { id: 'testId' });

        const [[method, type, loadingFunc, meta]] = dispatcher.dispatchPromise.mock.calls;
        const loading = loadingFunc({
            Producers: { ownedProducerOffer: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('addOwnedProducerOffer');
        expect(type).toEqual('ADD_OWNED_PRODUCER_OFFER');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual(['testId', { id: 'testId' }]);
    });

    it('should call dispatch method for getting owned producer offers history', () => {
        performGetOwnedProducerOffersHistory('testId');

        const [[method, type, loadingFunc, meta]] = dispatcher.dispatchPromise.mock.calls;
        const loading = loadingFunc({
            Producers: { ownedProducerOffersHistory: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('getOwnedProducerOffersHistory');
        expect(type).toEqual('GET_OWNED_PRODUCER_OFFERS_HISTORY');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual(['testId']);
    });

    it('should call dispatch method for getting current market price', () => {
        performGetCurrentMarketPrice();

        const [[method, type, loadingFunc, meta]] = dispatcher.dispatchPromise.mock.calls;
        const loading = loadingFunc({
            Producers: { currentMarketPrice: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('getCurrentMarketPrice');
        expect(type).toEqual('GET_CURRENT_MARKET_PRICE');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual([]);
    });
});
