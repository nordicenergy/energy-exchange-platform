export const initialState = {
    recentTransactions: {
        data: { currentBalance: {}, transactions: [], numberOfTransactions: 0 },
        error: null,
        loading: false
    },
    availableAddresses: {
        data: {
            addresses: []
        },
        error: null,
        loading: false
    },
    openTradePositions: {
        data: [],
        error: null,
        loading: false
    },
    performedTransaction: {
        data: {},
        error: null,
        loading: false
    },
    ledgerNetworks: {
        data: {},
        error: null,
        loading: false
    },
    ledgerStatus: {
        data: {},
        error: null,
        loading: false
    }
};

export function transactionsReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_RECENT_TRANSACTIONS': {
            const { payload, meta } = action;
            const [, page] = meta;

            return {
                ...state,
                recentTransactions: {
                    data: payload
                        ? {
                              ...payload,
                              transactions: page
                                  ? [...state.recentTransactions.data.transactions, ...payload.transactions]
                                  : payload.transactions
                          }
                        : state.recentTransactions.data,
                    loading: action.loading,
                    error: action.error
                }
            };
        }
        case 'GET_AVAILABLE_ADDRESSES': {
            return {
                ...state,
                availableAddresses: {
                    data: action.payload ? action.payload : state.availableAddresses.data,
                    loading: action.loading,
                    error: action.error
                }
            };
        }
        case 'GET_OPEN_TRADE_POSITIONS': {
            return {
                ...state,
                openTradePositions: {
                    data: action.payload ? action.payload : state.openTradePositions.data,
                    loading: action.loading,
                    error: action.error
                }
            };
        }
        case 'PERFORM_TRANSACTION': {
            return {
                ...state,
                performedTransaction: {
                    data: action.payload ? action.payload : state.performedTransaction.data,
                    loading: action.loading,
                    error: action.error
                }
            };
        }
        case 'GET_LEDGER_NETWORKS':
            return {
                ...state,
                ledgerNetworks: {
                    data: action.payload ? action.payload : state.ledgerNetworks.data,
                    loading: action.loading,
                    error: action.error
                }
            };
        case 'REGISTER_LEDGER':
            return {
                ...state,
                ledgerStatus: {
                    data: { status: action.payload ? action.payload : state.ledgerStatus.data.status },
                    loading: action.loading,
                    error: action.error
                }
            };
        default:
            return state;
    }
}
