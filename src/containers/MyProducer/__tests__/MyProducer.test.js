import React from 'react';
import { Provider } from 'react-redux';
import faHome from '@fortawesome/fontawesome-free-solid/faHome';
import { CONTRACT_STATUSES } from '../../../constants';
import MyProducerContainer, { MyProducer } from '../MyProducer';
import { ProducerInfo, Button } from '../../../components';
import { mountWithIntl, shallowWithIntl } from '../../../services/intlTestHelper';
import configureMockStore from 'redux-mock-store';
import * as usersActions from '../../../action_performers/users';
import * as producersActions from '../../../action_performers/producers';
import * as appActions from '../../../action_performers/app';
import * as notificationActions from '../../../action_performers/notifications';

const mockStore = configureMockStore();
const store = mockStore({
    Users: {
        profile: {
            data: {
                user: {
                    id: 0,
                    firstName: 'string',
                    lastName: 'string',
                    email: 'string',
                    currentProducerId: 1,
                    lastBillAvailable: true,
                    lastBillAmount: '35.24',
                    lastBillDate: 'December;',
                    userStatus: 'string',
                    workingPrice: 2.3,
                    status: 'delivery_net',
                    statusCode: CONTRACT_STATUSES.active,
                    statusCodeTitle: 'In Supply'
                }
            }
        }
    },
    Producers: {
        producer: {
            data: {
                name: 'Producer',
                price: 2.4,
                annualProduction: 3000,
                purchased: 1300,
                capacity: 8,
                dates: 'Sep 12 - Feb 22',
                tradingStrategy: false,
                id: 1,
                complete: false,
                plantType: 'solar',
                picture: 'https://pbs.twimg.com/profile_images/929933611754708992/ioSgz49P_400x400.jpg',
                location: 'Lippendorf, Neukieritzsch',
                ethereumAddress: '123',
                description: 'desc',
                status: 'active'
            },
            loading: false,
            error: null
        },
        producerHistory: {
            data: [
                {
                    date: 'Sep 12',
                    value: 'Change amount of energy 3000 kWh'
                },
                {
                    date: 'Feb 22',
                    value: 'Price change 2.4 ct/kWh'
                },
                {
                    date: 'Feb 12',
                    value: 'Change amount of energy 2300 kWh'
                },
                {
                    date: 'Jan 14',
                    value: 'Price change 3 ct/kWh'
                }
            ],
            loading: false,
            error: null
        }
    },
    App: {
        localization: {
            data: {
                locale: 'en'
            }
        }
    }
});

const context = {
    intl: {
        formatMessage: jest.fn()
    },
    router: {
        history: { push: jest.fn() }
    }
};

const props = {
    ...MyProducer.defaultProps,
    producer: {
        id: 1,
        name: 'test'
    },
    producerHistory: [{ date: 'test', value: 'test' }],
    user: {
        id: 1,
        currentProducerId: 1
    },
    error: null
};

function renderContainer() {
    return mountWithIntl(
        <Provider store={store}>
            <MyProducerContainer context={context} />
        </Provider>
    );
}

function renderComponent() {
    return shallowWithIntl(<MyProducer {...props} />, { context });
}

describe('<MyProducer /> Component', () => {
    beforeEach(() => {
        context.router.history.push = jest.fn();
        context.intl.formatMessage = jest.fn();
        context.intl.formatMessage.mockReturnValue('test');
        producersActions.performGetProducer = jest.fn();
        producersActions.performGetProducerHistory = jest.fn();
        appActions.performSetupLoaderVisibility = jest.fn();
        appActions.performSetupBreadcrumbs = jest.fn();
        usersActions.performGetUserData = jest.fn();
        notificationActions.performPushNotification = jest.fn();
    });

    it(`should contains following controls:
        - <section> with class "my-producer-page";
        - 1 <h1>;
        - 1 <Button> component;
        - 1 <ProducerInfo> component";`, () => {
        const component = renderContainer();

        expect(component.find('section.my-producer-page')).toHaveLength(1);
        expect(component.find('h1')).toHaveLength(1);
        expect(component.find(ProducerInfo)).toHaveLength(1);
        expect(component.find(Button)).toHaveLength(1);
    });

    it('should call prepare common function', () => {
        const component = renderContainer();
        const info = component.find(ProducerInfo).at(0);
        expect(info.props()).toEqual({
            description: 'desc',
            details: {
                annualProduction: 3000,
                capacity: 8,
                energyType: 'Solar',
                location: 'Lippendorf, Neukieritzsch',
                name: 'Peter Producer',
                price: 2.4,
                purchased: 1300,
                selectedSince: 'Sep 12 - Feb 22',
                ethereumAddress: '123',
                marketPrice: 2.3,
                status: 'active'
            },
            labels: {
                annualProduction: 'Annual Production',
                capacity: 'Peak Capacity',
                energyType: 'Type of energy',
                location: 'Location',
                name: 'Name',
                price: 'Price',
                marketPrice: 'vs. market price of',
                purchased: 'Energy purchased',
                selectedSince: 'Selected since',
                ethereumAddress: 'Ethereum Address'
            },
            picture: 'https://pbs.twimg.com/profile_images/929933611754708992/ioSgz49P_400x400.jpg'
        });
    });

    it('should returns correct props map', () => {
        const stateDummy = {
            Producers: {
                producer: {
                    data: 'producer_data',
                    error: null,
                    loading: false
                },
                producerHistory: {
                    data: 'history_data',
                    error: 'test_error',
                    loading: 'test_loading'
                }
            },
            Users: {
                profile: {
                    data: { user: 'user_data' },
                    error: null,
                    loading: false
                }
            },
            App: {
                localization: {
                    data: {
                        locale: 'en'
                    }
                }
            }
        };
        const props = MyProducer.mapStateToProps(stateDummy);
        expect(props).toEqual({
            locale: 'en',
            producer: 'producer_data',
            producerHistory: 'history_data',
            user: 'user_data',
            error: 'test_error',
            loading: 'test_loading'
        });
    });

    it('should be rendered only with valid contract status', () => {
        renderContainer();
    });

    it('should perform related actions on did mount step', () => {
        renderContainer();

        expect(usersActions.performGetUserData.mock.calls.length).toEqual(1);
        expect(producersActions.performGetProducer.mock.calls.length).toEqual(1);
        const [[arg1]] = producersActions.performGetProducer.mock.calls;
        expect(arg1).toEqual(1);

        expect(appActions.performSetupBreadcrumbs.mock.calls.length).toEqual(2);
        const [, [bArg1]] = appActions.performSetupBreadcrumbs.mock.calls;
        expect(bArg1).toEqual([
            { icon: faHome, id: '', label: 'Overview', path: '/' },
            { id: 'my_producer', label: 'My Producer', path: '/my_producer' }
        ]);

        const component = renderComponent();
        expect(appActions.performSetupBreadcrumbs.mock.calls.length).toEqual(4);
        expect(usersActions.performGetUserData.mock.calls.length).toEqual(2);
        expect(producersActions.performGetProducer.mock.calls.length).toEqual(2);
        component.setProps({
            user: { currentProducerId: 2, id: 1, statusCode: CONTRACT_STATUSES.active }
        });
        expect(producersActions.performGetProducer.mock.calls.length).toEqual(3);
        component.setProps({
            user: { currentProducerId: 2, id: 2, statusCode: CONTRACT_STATUSES.active }
        });
        expect(producersActions.performGetProducer.mock.calls.length).toEqual(3);
        component.setProps({
            user: { currentProducerId: 1, id: 2, statusCode: CONTRACT_STATUSES.active }
        });
        expect(producersActions.performGetProducer.mock.calls.length).toEqual(4);

        expect(producersActions.performGetProducerHistory.mock.calls.length).toEqual(4);

        component.setContext(context);

        const openProducersList = component.find(Button).at(0);
        openProducersList.props().onClick();
        const { history } = context.router;
        expect(history.push.mock.calls.length).toEqual(1);
        const [[route]] = history.push.mock.calls;
        expect(route).toEqual('/buy_energy');

        component.setProps({ error: { message: 'Error Message' } });
        expect(notificationActions.performPushNotification.mock.calls.length).toEqual(1);
        const [[error]] = notificationActions.performPushNotification.mock.calls;
        expect(error).toEqual({ message: 'test', type: 'error' });
    });

    it('should open trading page', () => {
        const component = renderComponent();
        component.setContext(context);

        component.find('BackLink').simulate('click', { preventDefault: jest.fn() });
        expect(context.router.history.push).toHaveBeenCalledWith('/');
    });

    it('should calls performSetupLoaderVisibility when receive new loading property', () => {
        const myProducer = renderComponent();

        myProducer.setProps({ loading: true });
        expect(appActions.performSetupLoaderVisibility).toHaveBeenCalledWith(expect.anything(), true);
        myProducer.setProps({ loading: false });
        expect(appActions.performSetupLoaderVisibility).toHaveBeenCalledWith(expect.anything(), false);
        expect(appActions.performSetupLoaderVisibility).toHaveBeenCalledTimes(2);
    });

    it('should setup translated breadcrumbs when locale changed', () => {
        const myProducer = renderComponent();

        expect(appActions.performSetupBreadcrumbs).toHaveBeenCalledTimes(2);

        myProducer.setProps({
            locale: 'de'
        });

        expect(appActions.performSetupBreadcrumbs).toHaveBeenCalledTimes(3);
    });
});
