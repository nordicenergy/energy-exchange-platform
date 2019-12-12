import { combineReducers } from 'redux';
import { producersReducer } from './producers';
import { usersReducer } from './users';
import { appReducer } from './app';
import { notificationsReducer } from './notifications';
import { transactionsReducer } from './transactions';
import { documentsReducer } from './documents';
import { consumptionReducer } from './consumption';
import { contractsReducer } from './contracts';

const reducers = combineReducers({
    Users: usersReducer,
    Contracts: contractsReducer,
    Notifications: notificationsReducer,
    Transactions: transactionsReducer,
    Producers: producersReducer,
    Documents: documentsReducer,
    Consumption: consumptionReducer,
    App: appReducer
});

export default reducers;
