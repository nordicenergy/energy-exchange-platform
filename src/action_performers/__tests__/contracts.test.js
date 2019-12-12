import { dispatcher } from '../../store';
import { performGetContracts, performGetSessionContract, performSetSessionContract } from '../contracts';

describe('Contracts action performers', () => {
    beforeEach(() => {
        dispatcher.dispatchPromise = jest.fn();
    });

    it('should call dispatch method for getting contracts', () => {
        performGetContracts(3);

        const [[method, type, loadingFunc, meta]] = dispatcher.dispatchPromise.mock.calls;
        const loading = loadingFunc({
            Contracts: { contracts: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('getContracts');
        expect(type).toEqual('GET_CONTRACTS');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual([3]);
    });

    it('should call dispatch method for getting session contract', () => {
        performGetSessionContract(3);

        const [[method, type, loadingFunc, meta]] = dispatcher.dispatchPromise.mock.calls;
        const loading = loadingFunc({
            Contracts: { sessionContract: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('getSessionContract');
        expect(type).toEqual('GET_SESSION_CONTRACT');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual([3]);
    });

    it('should call dispatch method for setting session contract', () => {
        performSetSessionContract(3, 5);

        const [[method, type, loadingFunc, meta]] = dispatcher.dispatchPromise.mock.calls;
        const loading = loadingFunc({
            Contracts: { updatedSessionContract: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('setSessionContract');
        expect(type).toEqual('SET_SESSION_CONTRACT');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual([3, 5]);
    });
});
