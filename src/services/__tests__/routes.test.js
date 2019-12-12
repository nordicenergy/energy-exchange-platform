import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Routes } from '../routes';
import PropTypes from 'prop-types';
import { initialState as AppInitialState } from '../../reducers/app';
import { initialState as ProducersInitialState } from '../../reducers/producers';
import { initialState as UsersInitialState } from '../../reducers/users';
import { initialState as ContractsInitialState } from '../../reducers/contracts';
import { initialState as TransactionsInitialState } from '../../reducers/transactions';
import { initialState as NotificationsInitialState } from '../../reducers/notifications';
import { App, Login, RestorePassword } from '../../containers';
import configureMockStore from 'redux-mock-store';
import { mountWithIntl } from '../intlTestHelper';

const context = {
    intl: {
        formatMessage: () => {}
    },
    router: {
        history: { push: () => {} }
    }
};

const mockStore = configureMockStore();
const store = mockStore({
    Notifications: NotificationsInitialState,
    Producer: ProducersInitialState,
    Users: UsersInitialState,
    Transactions: TransactionsInitialState,
    App: AppInitialState,
    Contracts: ContractsInitialState
});

const childContextTypes = {
    intl: PropTypes.shape({
        formatMessage: PropTypes.func
    }),
    router: PropTypes.shape({
        history: PropTypes.shape({
            push: PropTypes.func
        })
    })
};

function mountRoutes(route) {
    return mountWithIntl(
        <Provider store={store}>
            <MemoryRouter initialEntries={[route]}>
                <Routes context={context} />
            </MemoryRouter>
        </Provider>,
        { context, childContextTypes }
    );
}

describe('Router service', () => {
    beforeEach(() => {
        window.sessionStorage.getItem = jest.fn().mockImplementation(() => 'token');
    });

    afterEach(() => {
        window.sessionStorage.getItem.mockClear();
    });

    it('should render <App /> component', () => {
        const wrapper = mountRoutes('/');
        expect(wrapper.find(App)).toHaveLength(1);
    });

    it('should redirect to <Login /> component if token is undefined', () => {
        window.sessionStorage.getItem = jest.fn().mockImplementation(() => undefined);
        const wrapper = mountRoutes('/');
        expect(wrapper.find(Login)).toHaveLength(1);
        expect(wrapper.find(App)).toHaveLength(0);
    });

    it('should render <Login /> component', () => {
        window.sessionStorage.getItem = jest.fn().mockImplementation(() => undefined);
        const wrapper = mountRoutes('/login');
        expect(wrapper.find(Login)).toHaveLength(1);
    });

    it('should redirect to <App /> component if token is defined', () => {
        const wrapper = mountRoutes('/login');
        expect(wrapper.find(Login)).toHaveLength(0);
        expect(wrapper.find(App)).toHaveLength(1);
    });

    it('should render <RestorePassword /> component', () => {
        window.sessionStorage.getItem = jest.fn().mockImplementation(() => undefined);
        const wrapper = mountRoutes('/restore-password');
        expect(wrapper.find(RestorePassword)).toHaveLength(1);
    });
});
