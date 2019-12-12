import { dispatcher } from '../../store';

import {
    performGetAvailableAddresses,
    performGetRecentTransactions,
    performGetOpenTradePositions,
    performPerformTransaction,
    performGetLedgerNetworks,
    performRegisterLedgerAddress
} from '../transactions';
import { getOpenTradePositions, performExactTransaction, registerLedgerAddress } from '../../services/api/transactions';
import { LEDGERS } from '../../services/web3';

describe('Transactions action performers', () => {
    beforeEach(() => {
        dispatcher.dispatchPromise = jest.fn();
    });

    it('should call dispatch method for getting recent transactions', () => {
        performGetRecentTransactions('testId', 1);

        const [firstCall] = dispatcher.dispatchPromise.mock.calls;
        const [method, type, loadingFunc, meta] = firstCall;
        const loading = loadingFunc({
            Transactions: { recentTransactions: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise.mock.calls.length).toEqual(1);
        expect(method.name).toEqual('getRecentTransactions');
        expect(type).toEqual('GET_RECENT_TRANSACTIONS');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual(['testId', 1]);
    });

    it('should call dispatch method for getting available addresses', () => {
        performGetAvailableAddresses();

        const [firstCall] = dispatcher.dispatchPromise.mock.calls;
        const [method, type, loadingFunc, meta] = firstCall;
        const loading = loadingFunc({
            Transactions: { availableAddresses: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise.mock.calls.length).toEqual(1);
        expect(method.name).toEqual('bound getUserAddresses');
        expect(type).toEqual('GET_AVAILABLE_ADDRESSES');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual(undefined);
    });

    it('should call dispatch method for getting open trade positions', () => {
        performGetOpenTradePositions(1, LEDGERS.ropsten);

        const [firstCall] = dispatcher.dispatchPromise.mock.calls;
        const [method, type, loadingFunc, meta] = firstCall;
        const loading = loadingFunc({
            Transactions: { openTradePositions: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise.mock.calls.length).toEqual(1);
        expect(method.name).toEqual('getOpenTradePositions');
        expect(type).toEqual('GET_OPEN_TRADE_POSITIONS');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual([1, LEDGERS.ropsten]);
    });

    it('should call dispatch method for performing transaction', () => {
        const tradePositionDummy = {
            producerId: 19,
            producerAddress: '0x63d8d1489508E9b6B1661Ce1DfEBBBdDc424193A',
            offerAddressUrl: 'https://ropsten.etherscan.io/address/0x63d8d1489508E9b6B1661Ce1DfEBBBdDc424193A',
            offerAddress: '0x63d8d1489508E9b6B1661Ce1DfEBBBdDc424193A',
            producerUrl: '/buy_energy/producer/19',
            producerName: 'Photovoltaik-Anlage in Mariendorf',
            offerIssued: 'May 05, 2018 12:00',
            offerIssuedTimestamp: 1525478400,
            validOn: '--',
            energyOffered: '--',
            energyAvailable: '39,9',
            energyAvailableFloat: 39.9,
            price: '3,20',
            priceFloat: 3.2
        };
        performPerformTransaction(tradePositionDummy, 'contractAddressTest', 'ledgerTest');

        const [firstCall] = dispatcher.dispatchPromise.mock.calls;
        const [method, type, loadingFunc, meta] = firstCall;
        const loading = loadingFunc({
            Transactions: { performedTransaction: { loading: 'TEST' } }
        });

        const [tradePosition, contractAddress, ledger] = meta;

        expect(dispatcher.dispatchPromise.mock.calls.length).toEqual(1);
        expect(method.name).toEqual('performExactTransaction');
        expect(type).toEqual('PERFORM_TRANSACTION');
        expect(loading).toEqual('TEST');
        expect(tradePosition).toEqual(tradePositionDummy);
        expect(contractAddress).toEqual('contractAddressTest');
        expect(ledger).toEqual('ledgerTest');
    });

    it('should call dispatch method for getting ledger networks', () => {
        performGetLedgerNetworks();

        const [firstCall] = dispatcher.dispatchPromise.mock.calls;
        const [method, type, loadingFunc, meta] = firstCall;
        const loading = loadingFunc({
            Transactions: { ledgerNetworks: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise.mock.calls.length).toEqual(1);
        expect(method.name).toEqual('getLedgerNetworks');
        expect(type).toEqual('GET_LEDGER_NETWORKS');
        expect(loading).toEqual('TEST');
        expect(meta).toBeUndefined();
    });

    it('should call dispatch method for getting ledger networks', () => {
        performRegisterLedgerAddress('ledgerTest', 'ledgerAddressTest');

        const [firstCall] = dispatcher.dispatchPromise.mock.calls;
        const [method, type, loadingFunc, meta] = firstCall;
        const loading = loadingFunc({
            Transactions: { ledgerStatus: { loading: 'TEST' } }
        });

        const [ledger, ledgerAddress] = meta;

        expect(dispatcher.dispatchPromise.mock.calls.length).toEqual(1);
        expect(method.name).toEqual('registerLedgerAddress');
        expect(type).toEqual('REGISTER_LEDGER');
        expect(loading).toEqual('TEST');
        expect(ledger).toBe('ledgerTest');
        expect(ledgerAddress).toBe('ledgerAddressTest');
    });
});
