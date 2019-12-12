import React from 'react';
import faHome from '@fortawesome/fontawesome-free-solid/faHome';
import faBook from '@fortawesome/fontawesome-free-solid/faBook';
import faSuitcase from '@fortawesome/fontawesome-free-solid/faSuitcase';
import faCalculator from '@fortawesome/fontawesome-free-solid/faCalculator';
import faUser from '@fortawesome/fontawesome-free-solid/faUser';
import faShoppingCart from '@fortawesome/fontawesome-free-solid/faShoppingCart';
import { App } from '../App';
import { Header, MenuSideBar, Footer, ContractModal } from '../../../components';
import * as usersActions from '../../../action_performers/users';
import * as appActions from '../../../action_performers/app';
import * as contractsActions from '../../../action_performers/contracts';
import * as notificationsActions from '../../../action_performers/notifications';
import { shallowWithIntl } from '../../../services/intlTestHelper';

const context = {
    intl: { formatMessage: jest.fn() },
    router: {
        history: { push: jest.fn() }
    },
    user: { contract: {} }
};

function renderComponent(props = { user: { contract: {} } }) {
    return shallowWithIntl(<App {...props} />);
}

describe('Main <App /> Component', () => {
    beforeEach(() => {
        context.router.history.push = jest.fn();
        context.intl.formatMessage = jest.fn();
        usersActions.performLogout = jest.fn();
        usersActions.performGetUserData = jest.fn();
        contractsActions.performGetSessionContract = jest.fn();
        contractsActions.performGetContracts = jest.fn();
        contractsActions.performSetSessionContract = jest.fn();
        appActions.performSetupLocale = jest.fn();
        appActions.performSetupLoaderVisibility = jest.fn();
        notificationsActions.performPushNotification = jest.fn();
    });

    afterEach(() => {
        appActions.performSetupLocale.mockClear();
    });

    it(`should contain following controls:
        - <div> with class "app";
        - <Header> component";
        - <Footer> component";
        - <MenuSideBar> component"
        - <ContractModal> component";`, () => {
        const component = renderComponent(context);
        const text = component.debug();

        expect(text.includes('div className="app"')).toEqual(true);
        expect(component.find(Header)).toHaveLength(1);
        expect(component.find(Footer)).toHaveLength(1);
        expect(component.find(MenuSideBar)).toHaveLength(1);
        expect(component.find(ContractModal)).toHaveLength(1);
    });

    it('should return correct props', () => {
        const stateMock = {
            Contracts: {
                contracts: {
                    loading: false,
                    error: null,
                    data: [{ id: 'testContractId' }]
                },
                sessionContract: {
                    loading: false,
                    error: null,
                    data: { id: 'testContractId' }
                },
                updatedSessionContract: {
                    loading: false,
                    error: 'Update Error',
                    data: { id: 'testContractId' }
                }
            },
            Users: {
                profile: {
                    data: {
                        user: { id: 1, contract: {} }
                    }
                },
                login: {},
                logout: { loading: false }
            },
            App: {
                breadCrumbs: {
                    data: []
                },
                localization: {
                    data: {
                        locale: 'en',
                        aboutUs: [],
                        faq: []
                    },
                    loading: {
                        aboutUs: false,
                        faq: false
                    }
                }
            }
        };
        const props = App.mapStateToProps(stateMock);

        expect(props).toEqual({
            breadCrumbs: [],
            contracts: [{ id: 'testContractId' }],
            errorContracts: null,
            errorSetContract: 'Update Error',
            loading: false,
            locale: 'en',
            loggingOut: false,
            sessionContract: { id: 'testContractId' },
            updatedSessionContract: { id: 'testContractId' },
            user: { id: 1, contract: {} }
        });
    });

    it('should setup correct callbacks and handle related events for Header', () => {
        const component = renderComponent({
            ...context,
            contracts: [{ id: '100020' }],
            sessionContract: { id: '100020' }
        });
        component.setContext(context);

        const header = component.find(Header).at(0);
        const confirm = component.find('Confirm');

        expect(component.state().isLogoutConfirmVisible).toEqual(false);
        header.props().onLogoutClick();
        expect(component.state().isLogoutConfirmVisible).toEqual(true);
        confirm.props().onConfirm();

        component.setProps({ loggingOut: true });
        component.setProps({ loggingOut: false });

        expect(context.router.history.push.mock.calls.length).toEqual(1);
        expect(usersActions.performLogout.mock.calls.length).toEqual(1);
        const [[route]] = context.router.history.push.mock.calls;
        expect(route).toEqual('/login');
    });

    it('should correctly handle cases when working contracts are absent', () => {
        const component = renderComponent({ ...context, contracts: [], sessionContract: { id: '100020' } });
        component.setContext(context);
        expect(contractsActions.performSetSessionContract).toHaveBeenCalledTimes(0);

        expect(component.find('ContractModal').props().show).toEqual(true);
        expect(component.find('ContractModal').props().labels).toEqual({
            contractMessage: 'To continue, please select a contract.',
            noContractMessage:
                'At present, no contract data can be displayed. Please contact the administrator or try again later.',
            selectLabel: 'Select contract'
        });

        component.setProps({
            contracts: [{ id: '100020' }],
            sessionContract: null,
            user: { id: 'testId', contract: {} }
        });
        expect(component.find('ContractModal').props().show).toEqual(true);
        component
            .find('ContractModal')
            .props()
            .onSelect({ value: '100020' });
        expect(contractsActions.performSetSessionContract).toHaveBeenCalledWith('testId', '100020');

        component.setProps({ contracts: [{ id: '100020' }], sessionContract: { id: '100020' } });
        expect(component.find('ContractModal').props().show).toEqual(false);
    });

    it('should correctly handle logout cases when working contracts are absent', () => {
        const component = renderComponent({ ...context, contracts: [], sessionContract: { id: '100020' } });
        component.setContext(context);

        expect(component.state().isLogoutConfirmVisible).toEqual(false);
        component
            .find(Header)
            .at(0)
            .props()
            .onLogoutClick();
        expect(component.state().isLogoutConfirmVisible).toEqual(false);

        component.setProps({ loggingOut: true });
        component.setProps({ loggingOut: false });

        expect(context.router.history.push.mock.calls.length).toEqual(1);
        expect(usersActions.performLogout.mock.calls.length).toEqual(1);
        const [[route]] = context.router.history.push.mock.calls;
        expect(route).toEqual('/login');
    });

    it('should correctly handle logout cases when session contract is absent', () => {
        const component = renderComponent({ ...context, contracts: [{ id: '100020' }], sessionContract: null });
        component.setContext(context);

        expect(component.state().isLogoutConfirmVisible).toEqual(false);
        component
            .find(Header)
            .at(0)
            .props()
            .onLogoutClick();
        expect(component.state().isLogoutConfirmVisible).toEqual(false);

        component.setProps({ loggingOut: true });
        component.setProps({ loggingOut: false });

        expect(context.router.history.push.mock.calls.length).toEqual(1);
        expect(usersActions.performLogout.mock.calls.length).toEqual(1);
        const [[route]] = context.router.history.push.mock.calls;
        expect(route).toEqual('/login');
    });

    it(`should correctly show 'No contracts message' on mobile view when working contracts are absent`, () => {
        const componentWithContracts = renderComponent({ ...context, contracts: [{ id: '100020' }] });
        componentWithContracts.setContext(context);
        expect(componentWithContracts.find('.config-contract-select')).toHaveLength(2);
        expect(componentWithContracts.find('.contract-config-select-no-contracts-alert')).toHaveLength(0);

        const componentWithoutContracts = renderComponent({ ...context, contracts: [] });
        componentWithoutContracts.setContext(context);
        expect(componentWithoutContracts.find('.config-contract-select')).toHaveLength(1);
        expect(componentWithoutContracts.find('.contract-config-select-no-contracts-alert')).toHaveLength(1);
        expect(componentWithoutContracts.find('.contract-config-select-no-contracts-alert').text()).toEqual(
            'No contracts'
        );
    });

    it('should setup correct callbacks and handle related events for MenuSideBar', () => {
        const component = renderComponent(context);
        component.setContext(context);

        const menu = component.find(MenuSideBar).at(0);
        menu.props().onSelect('/item1');

        expect(context.router.history.push.mock.calls.length).toEqual(1);
        const [[route]] = context.router.history.push.mock.calls;
        expect(route).toEqual('/item1');

        expect(menu.props().items).toEqual([
            { active: true, icon: faHome, id: '', label: 'Overview', path: '/', subItemActive: false },
            { active: false, icon: faBook, id: 'documents', label: 'My Documents', path: '/documents' },
            {
                active: false,
                icon: faCalculator,
                id: 'submit_meter',
                label: 'Submit Meter Readings',
                path: '/submit_meter'
            },
            {
                active: false,
                subItemActive: false,
                icon: faShoppingCart,
                id: 'buy_energy',
                label: 'Buy energy',
                path: '/buy_energy',
                disabled: true
            },
            {
                active: false,
                icon: faSuitcase,
                id: 'direct_trading',
                label: 'Direct Trading',
                path: '/direct_trading',
                disabled: true
            },
            { active: false, icon: faUser, id: 'profile', label: 'Profile', path: '/profile' }
        ]);
    });

    it('should setup correct callbacks and handle related events for Footer anchors', () => {
        const component = renderComponent(context);
        component.setContext(context);

        const footer = component.find(Footer).at(0);
        footer.props().onSelect('/item1');

        expect(context.router.history.push.mock.calls.length).toEqual(1);
        const [[route]] = context.router.history.push.mock.calls;
        expect(route).toEqual('/item1');

        expect(footer.props().navItems).toEqual([
            { active: false, href: '/about', label: 'About Us' },
            { active: false, href: '/termsandconditions', label: 'Terms & Conditions' },
            { active: false, href: '/faq', label: 'FAQ' }
        ]);
    });

    it('should not perform logout if user click cancel', () => {
        const component = renderComponent({
            ...context,
            contracts: [{ id: '100020' }],
            sessionContract: { id: '100020' }
        });
        component.setContext(context);

        const header = component.find(Header).at(0);
        const confirm = component.find('Confirm');

        expect(component.state().isLogoutConfirmVisible).toEqual(false);
        header.props().onLogoutClick();
        expect(component.state().isLogoutConfirmVisible).toEqual(true);
        confirm.props().onCancel();
        expect(component.state().isLogoutConfirmVisible).toEqual(false);

        expect(context.router.history.push).not.toHaveBeenCalled();
        expect(usersActions.performLogout).not.toHaveBeenCalled();
    });

    it('should navigate to necessary route', () => {
        const component = renderComponent(context);
        component.setContext(context);

        const header = component.find(Header).at(0);
        header.props().onBreadCrumbsClick('/test');

        expect(context.router.history.push).toHaveBeenCalledWith('/test');
    });

    it('should call performSetupLocale when locale was changed', () => {
        const app = renderComponent();

        app
            .find('Header')
            .props()
            .onLocaleChange('de');
        expect(appActions.performSetupLocale).toHaveBeenCalledWith('de');
    });

    it('should provide possibility to de-emphasize content area and revert this option', () => {
        const component = renderComponent();
        expect(component.update().find('.covered-by-menu')).toHaveLength(0);
        expect(component.update().find('.covered-by-config-sidebar')).toHaveLength(0);
        expect(component.find('.content--de-emphasized')).toHaveLength(0);

        component
            .find(Header)
            .at(0)
            .props()
            .onToggleMenuBar();
        expect(component.update().find('.covered-by-menu')).toHaveLength(1);
        expect(component.update().find('.content--de-emphasized')).toHaveLength(1);

        component
            .find('.content')
            .at(0)
            .props()
            .onClick({
                target: {
                    classList: {
                        contains: className => 'content--de-emphasized' === className
                    }
                }
            });
        expect(component.update().find('.covered-by-menu')).toHaveLength(0);
        expect(component.update().find('.content--de-emphasized')).toHaveLength(0);

        component
            .find(Header)
            .at(0)
            .props()
            .onToggleConfigSideBar();
        expect(component.update().find('.covered-by-config-sidebar')).toHaveLength(1);
        expect(component.update().find('.content--de-emphasized')).toHaveLength(1);

        component
            .find('.content')
            .at(0)
            .props()
            .onClick({
                target: {
                    classList: {
                        contains: className => 'content--de-emphasized' === className
                    }
                }
            });
        expect(component.update().find('.covered-by-config-sidebar')).toHaveLength(0);
        expect(component.update().find('.content--de-emphasized')).toHaveLength(0);
    });

    it('should call performSetupLoaderVisibility when receive new loading property', () => {
        const app = renderComponent();

        app.setProps({ loading: true });
        expect(appActions.performSetupLoaderVisibility).toHaveBeenCalledWith(expect.anything(), true);
        app.setProps({ loading: false });
        expect(appActions.performSetupLoaderVisibility).toHaveBeenCalledWith(expect.anything(), true);
        expect(appActions.performSetupLoaderVisibility).toHaveBeenCalledTimes(2);
    });

    it('should call contracts action performers when receive new user data', () => {
        const app = renderComponent();
        expect(usersActions.performGetUserData).toHaveBeenCalledTimes(1);
        expect(contractsActions.performGetSessionContract).toHaveBeenCalledTimes(0);
        expect(contractsActions.performGetContracts).toHaveBeenCalledTimes(0);
        expect(contractsActions.performSetSessionContract).toHaveBeenCalledTimes(0);

        app.setProps({ user: { id: 'testId', contract: {} } });
        expect(contractsActions.performGetSessionContract).toHaveBeenCalledWith('testId');
        expect(contractsActions.performGetContracts).toHaveBeenCalledWith('testId');
        expect(contractsActions.performSetSessionContract).toHaveBeenCalledTimes(0);

        app.setProps({ contracts: [{ id: '0123' }, { id: '0124' }], sessionContract: { id: '0123' } });
        expect(app.find('Header').props().selectedContractId).toEqual('0123');
        expect(app.find('Header').props().contracts).toEqual([{ id: '0123' }, { id: '0124' }]);

        app
            .find('Header')
            .props()
            .onContractChange('0123');
        expect(contractsActions.performSetSessionContract).toHaveBeenCalledTimes(0);

        app
            .find('Header')
            .props()
            .onContractChange('0124');
        expect(contractsActions.performSetSessionContract).toHaveBeenCalledWith('testId', '0124');

        expect(contractsActions.performGetSessionContract).toHaveBeenCalledTimes(1);
        app.setProps({ updatedSessionContract: { id: '0124' } });
        expect(usersActions.performGetUserData).toHaveBeenCalledTimes(2);

        app.setProps({ user: { id: 'testId', contract: { statusCode: 5000 } } });
        expect(contractsActions.performGetSessionContract).toHaveBeenCalledTimes(2);
    });

    it('should correctly handle errors using notifications', () => {
        const app = renderComponent();
        expect(notificationsActions.performPushNotification).toHaveBeenCalledTimes(0);
        app.setProps({ errorContracts: { message: 'Internal Server Error' } });
        expect(notificationsActions.performPushNotification).toHaveBeenCalledWith({
            message:
                'An error occurred while getting contracts data. Please try to refresh page later or contact administrator.',
            type: 'error'
        });
        app.setProps({ errorSetContract: { message: 'Internal Server Error' } });
        expect(notificationsActions.performPushNotification).toHaveBeenCalledTimes(2);
        expect(notificationsActions.performPushNotification).toHaveBeenCalledWith({
            message:
                'An error occurred while getting contracts data. Please try to refresh page later or contact administrator.',
            type: 'error'
        });
    });

    it('should navigate to overview page', () => {
        const app = renderComponent(context);
        app.setContext(context);
        app
            .find('Header')
            .props()
            .onLogoClick();
        expect(context.router.history.push).toHaveBeenCalledWith('/');
    });

    it('should set class to main element for fix height when is meter reading page', () => {
        Object.defineProperty(window.location, 'pathname', {
            writable: true,
            value: '/submit_meter'
        });

        const app = renderComponent(context);
        app.setContext(context);

        expect(app.find('#main-container').hasClass('main-container--fixed-height')).toBeTruthy();
    });
});
