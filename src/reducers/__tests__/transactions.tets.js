import { transactionsReducer, initialState } from '../transactions';
import { formatCurrency, formatDateTime, formatFloat } from '../../services/formatter';
import { PATHS } from '../../services/routes';

const { ACTIONS } = fixtures();

describe('Transactions reducer:', () => {
    describe('Pending cases:', () => {
        it('should handle GET_RECENT_TRANSACTIONS', () => {
            const result = transactionsReducer(initialState, ACTIONS.getRecentTransactions.pending);
            expect(result.recentTransactions.loading).toEqual(true);
            expect(result.recentTransactions.error).toEqual(null);
            expect(result.recentTransactions.data).toEqual({
                currentBalance: {},
                transactions: [],
                numberOfTransactions: 0
            });
        });
        it('should handle GET_AVAILABLE_ADDRESSES', () => {
            const result = transactionsReducer(initialState, ACTIONS.getAvailableAddresses.pending);
            expect(result.availableAddresses.loading).toEqual(true);
            expect(result.availableAddresses.error).toEqual(null);
            expect(result.availableAddresses.data).toEqual({
                addresses: []
            });
        });
        it('should handle GET_OPEN_TRADE_POSITIONS', () => {
            const result = transactionsReducer(initialState, ACTIONS.getOpenTradePositions.pending);
            expect(result.openTradePositions.loading).toEqual(true);
            expect(result.openTradePositions.error).toEqual(null);
            expect(result.openTradePositions.data).toEqual([]);
        });
        it('should handle REGISTER_LEDGER', () => {
            const result = transactionsReducer(initialState, ACTIONS.registerLedgerAddress.pending);
            expect(result.ledgerStatus.loading).toEqual(true);
            expect(result.ledgerStatus.error).toEqual(null);
            expect(result.ledgerStatus.data).toEqual({});
        });
        it('should handle PERFORM_TRANSACTION', () => {
            const result = transactionsReducer(initialState, ACTIONS.performTransaction.pending);
            expect(result.performedTransaction.loading).toEqual(true);
            expect(result.performedTransaction.error).toEqual(null);
            expect(result.performedTransaction.data).toEqual({});
        });
        it('should handle GET_LEDGER_NETWORKS', () => {
            const result = transactionsReducer(initialState, ACTIONS.getLedgerNetworks.pending);
            expect(result.ledgerNetworks.loading).toEqual(true);
            expect(result.ledgerNetworks.error).toEqual(null);
            expect(result.ledgerNetworks.data).toEqual({});
        });
    });
    describe('Error cases:', () => {
        it('should handle GET_RECENT_TRANSACTIONS', () => {
            const result = transactionsReducer(initialState, ACTIONS.getRecentTransactions.fail);
            expect(result.recentTransactions.loading).toEqual(false);
            expect(result.recentTransactions.error).toEqual('Error Message');
            expect(result.recentTransactions.data).toEqual({
                currentBalance: {},
                transactions: [],
                numberOfTransactions: 0
            });
        });
        it('should handle GET_AVAILABLE_ADDRESSES', () => {
            const result = transactionsReducer(initialState, ACTIONS.getAvailableAddresses.fail);
            expect(result.availableAddresses.loading).toEqual(false);
            expect(result.availableAddresses.error).toEqual('Error Message');
            expect(result.availableAddresses.data).toEqual({
                addresses: []
            });
        });
        it('should handle GET_OPEN_TRADE_POSITIONS', () => {
            const result = transactionsReducer(initialState, ACTIONS.getOpenTradePositions.fail);
            expect(result.openTradePositions.loading).toEqual(false);
            expect(result.openTradePositions.error).toEqual('Error Message');
            expect(result.openTradePositions.data).toEqual([]);
        });
        it('should handle REGISTER_LEDGER', () => {
            const result = transactionsReducer(initialState, ACTIONS.registerLedgerAddress.fail);
            expect(result.ledgerStatus.loading).toEqual(false);
            expect(result.ledgerStatus.error).toEqual('error message');
            expect(result.ledgerStatus.data).toEqual({});
        });
        it('should handle PERFORM_TRANSACTION', () => {
            const result = transactionsReducer(initialState, ACTIONS.performTransaction.fail);
            expect(result.performedTransaction.loading).toEqual(false);
            expect(result.performedTransaction.error).toEqual('error message');
            expect(result.performedTransaction.data).toEqual({});
        });
        it('should handle GET_LEDGER_NETWORKS', () => {
            const result = transactionsReducer(initialState, ACTIONS.getLedgerNetworks.fail);
            expect(result.ledgerNetworks.loading).toEqual(false);
            expect(result.ledgerNetworks.error).toEqual('error message');
            expect(result.ledgerNetworks.data).toEqual({});
        });
    });
    describe('Success cases:', () => {
        it('should handle GET_RECENT_TRANSACTIONS', () => {
            const result = transactionsReducer(initialState, ACTIONS.getRecentTransactions.success);
            expect(result.recentTransactions.loading).toEqual(false);
            expect(result.recentTransactions.error).toEqual(null);
            expect(result.recentTransactions.data).toEqual(ACTIONS.getRecentTransactions.success.payload);
        });
        it('should handle GET_AVAILABLE_ADDRESSES', () => {
            const result = transactionsReducer(initialState, ACTIONS.getAvailableAddresses.success);
            expect(result.availableAddresses.loading).toEqual(false);
            expect(result.availableAddresses.error).toEqual(null);
            expect(result.availableAddresses.data).toEqual(ACTIONS.getAvailableAddresses.success.payload);
        });
        it('should handle GET_OPEN_TRADE_POSITIONS', () => {
            const result = transactionsReducer(initialState, ACTIONS.getOpenTradePositions.success);
            expect(result.openTradePositions.loading).toEqual(false);
            expect(result.openTradePositions.error).toEqual(null);
            expect(result.openTradePositions.data).toEqual(ACTIONS.getOpenTradePositions.success.payload);
        });
        it('should handle REGISTER_LEDGER', () => {
            const result = transactionsReducer(initialState, ACTIONS.registerLedgerAddress.success);
            expect(result.ledgerStatus.loading).toEqual(false);
            expect(result.ledgerStatus.error).toEqual(null);
            expect(result.ledgerStatus.data).toEqual({ status: ACTIONS.registerLedgerAddress.success.payload });
        });
        it('should handle PERFORM_TRANSACTION', () => {
            const result = transactionsReducer(initialState, ACTIONS.performTransaction.success);
            expect(result.performedTransaction.loading).toEqual(false);
            expect(result.performedTransaction.error).toEqual(null);
            expect(result.performedTransaction.data).toEqual(ACTIONS.performTransaction.success.payload);
        });
        it('should handle GET_LEDGER_NETWORKS', () => {
            const result = transactionsReducer(initialState, ACTIONS.getLedgerNetworks.success);
            expect(result.ledgerNetworks.loading).toEqual(false);
            expect(result.ledgerNetworks.error).toEqual(null);
            expect(result.ledgerNetworks.data).toEqual(ACTIONS.getLedgerNetworks.success.payload);
        });
    });
});

function fixtures() {
    const ACTIONS = {
        getRecentTransactions: {
            success: {
                type: 'GET_RECENT_TRANSACTIONS',
                payload: {
                    currentBalance: {
                        balance: 20,
                        date: 1523707200
                    },
                    transactions: [
                        {
                            id: 1,
                            date: 1523707200,
                            description: 'Bought 23 kWh from Alice',
                            amount: 0.81
                        },
                        {
                            id: 2,
                            date: 1523707200,
                            description: 'Bought 23 kWh from Alice',
                            amount: 0.81
                        },
                        {
                            id: 3,
                            date: 1523707200,
                            description: 'Bought 23 kWh from Nordic Energy',
                            amount: 0.81
                        }
                    ],
                    numberOfTransactions: 3
                },
                error: null,
                loading: false,
                meta: ['testId', 0]
            },
            fail: {
                type: 'GET_RECENT_TRANSACTIONS',
                payload: null,
                error: 'Error Message',
                loading: false,
                meta: ['testId', 0]
            },
            pending: {
                type: 'GET_RECENT_TRANSACTIONS',
                payload: null,
                error: null,
                loading: true,
                meta: ['testId', 0]
            }
        },
        getAvailableAddresses: {
            success: {
                type: 'GET_AVAILABLE_ADDRESSES',
                payload: {
                    addresses: [
                        '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                        '0xDCc6960376d6C6dEa93647383FfB245CfCed97Cf'
                    ]
                },
                error: null,
                loading: false
            },
            fail: {
                type: 'GET_AVAILABLE_ADDRESSES',
                payload: null,
                error: 'Error Message',
                loading: false
            },
            pending: {
                type: 'GET_AVAILABLE_ADDRESSES',
                payload: null,
                error: null,
                loading: true
            }
        },
        getOpenTradePositions: {
            success: {
                type: 'GET_OPEN_TRADE_POSITIONS',
                payload: {
                    data: [
                        {
                            offerAddressUrl: 'scannerURL/producer',
                            offerAddress: 'producer',
                            producerUrl: 'PATHS.buyEnergyPath/producerIdPath/producerId',
                            producerName: '',
                            offerIssued: '',
                            validOn: '--',
                            energyOffered: '--',
                            energyAvailable: '',
                            price: ''
                        }
                    ]
                },
                error: null,
                loading: false
            },
            fail: {
                type: 'GET_OPEN_TRADE_POSITIONS',
                payload: null,
                error: 'Error Message',
                loading: false
            },
            pending: {
                type: 'GET_OPEN_TRADE_POSITIONS',
                payload: null,
                error: null,
                loading: true
            }
        },
        registerLedgerAddress: {
            success: {
                type: 'REGISTER_LEDGER',
                payload: 'success',
                loading: false,
                error: null
            },
            pending: {
                type: 'REGISTER_LEDGER',
                payload: null,
                loading: true,
                error: null
            },
            fail: {
                type: 'REGISTER_LEDGER',
                payload: null,
                loading: false,
                error: 'error message'
            }
        },
        performTransaction: {
            success: {
                type: 'PERFORM_TRANSACTION',
                payload: {
                    txHash: 'testHash',
                    txHashUrl: 'testHashUrl'
                },
                loading: false,
                error: null
            },
            pending: {
                type: 'PERFORM_TRANSACTION',
                payload: null,
                loading: true,
                error: null
            },
            fail: {
                type: 'PERFORM_TRANSACTION',
                payload: null,
                loading: false,
                error: 'error message'
            }
        },
        getLedgerNetworks: {
            success: {
                type: 'GET_LEDGER_NETWORKS',
                payload: {
                    selectedLedgerNetwork: 'ethereumRopsten',
                    ethereumMain: {
                        addresses: ['0xaff8701cab', '0xaff8701cac']
                    }
                },
                loading: false,
                error: null
            },
            fail: {
                type: 'GET_LEDGER_NETWORKS',
                payload: {},
                loading: false,
                error: 'error message'
            },
            pending: {
                type: 'GET_LEDGER_NETWORKS',
                payload: {},
                loading: true,
                error: null
            }
        }
    };
    return { ACTIONS };
}
