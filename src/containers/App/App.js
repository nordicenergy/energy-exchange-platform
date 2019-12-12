import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSignOutAlt from '@fortawesome/fontawesome-free-solid/faSignOutAlt';
import faEllipsisV from '@fortawesome/fontawesome-free-solid/faEllipsisV';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import faHome from '@fortawesome/fontawesome-free-solid/faHome';
import faBook from '@fortawesome/fontawesome-free-solid/faBook';
import faBars from '@fortawesome/fontawesome-free-solid/faBars';
import faSuitcase from '@fortawesome/fontawesome-free-solid/faSuitcase';
import faCalculator from '@fortawesome/fontawesome-free-solid/faCalculator';
import faUser from '@fortawesome/fontawesome-free-solid/faUser';
import faShoppingCart from '@fortawesome/fontawesome-free-solid/faShoppingCart';

import { MenuSideBar, Header, Footer, Confirm, ContractModal, SelectField, Button } from '../../components';
import { PATHS, LOCALES, DEFAULT_LOCALE } from '../../constants';
import { App as messages } from '../../services/translations/messages';
import { performSetupLocale, performSetupLoaderVisibility } from '../../action_performers/app';
import { performPushNotification } from '../../action_performers/notifications';
import {
    performGetSessionContract,
    performSetSessionContract,
    performGetContracts
} from '../../action_performers/contracts';
import { performLogout, performGetUserData } from '../../action_performers/users';

import contractStatusMixin from '../__shared__/mixins/contractStatus';

import './App.css';

const APP_ID = Symbol('app-id');

export class App extends contractStatusMixin(React.PureComponent) {
    static mapStateToProps({ Users, App, Contracts }) {
        return {
            loggingOut: Users.logout.loading,
            user: Users.profile.data.user,
            breadCrumbs: App.breadCrumbs.data,
            loading:
                App.localization.loading.faq ||
                App.localization.loading.aboutUs ||
                Users.profile.loading ||
                Contracts.contracts.loading ||
                Contracts.sessionContract.loading ||
                Contracts.updatedSessionContract.loading,
            locale: App.localization.data.locale,
            contracts: Contracts.contracts.data,
            sessionContract: Contracts.sessionContract.data,
            updatedSessionContract: Contracts.updatedSessionContract.data,
            errorContracts: Users.profile.error || Contracts.contracts.error || Contracts.sessionContract.error,
            errorSetContract: Contracts.updatedSessionContract.error
        };
    }

    constructor(props, context) {
        super(props, context);
        this.state = { isLogoutConfirmVisible: false, isMenuBarOpen: false, isConfigSideBarOpen: false };
        this.appId = APP_ID;
    }

    componentDidMount() {
        performGetUserData();
    }

    componentDidUpdate(prevProps) {
        const { formatMessage } = this.context.intl;
        const { loggingOut, loading, user, updatedSessionContract, errorContracts, errorSetContract } = this.props;
        const loggedOut = prevProps.loggingOut !== loggingOut && !loggingOut;

        if (loggedOut) {
            this.navigateTo('/login');
        }

        if (
            prevProps.updatedSessionContract !== updatedSessionContract &&
            updatedSessionContract &&
            updatedSessionContract.id
        ) {
            performGetUserData(user.id);
        }

        if (prevProps.user !== user && user && user.id) {
            performGetContracts(user.id);
            performGetSessionContract(user.id);
        }

        if (errorContracts && errorContracts !== prevProps.errorContracts) {
            performPushNotification({ message: formatMessage(messages.loadingContractsErrorMessage), type: 'error' });
        }

        if (errorSetContract && errorSetContract !== prevProps.errorSetContract) {
            performPushNotification({ message: formatMessage(messages.setContractErrorMessage), type: 'error' });
        }

        if (prevProps.loading !== loading) {
            performSetupLoaderVisibility(this.appId, loading);
        }
    }

    logout() {
        const { contracts, sessionContract } = this.props;

        if (!contracts.length || !sessionContract) {
            return performLogout();
        }

        this.setState(() => ({
            isLogoutConfirmVisible: true
        }));
    }

    handleLogoutCancel() {
        this.setState(() => ({
            isLogoutConfirmVisible: false
        }));
    }

    handleDeEmphasizedContentClick(target) {
        const { isMenuBarOpen, isConfigSideBarOpen } = this.state;
        const isContentDeEmphasized = target.classList && target.classList.contains('content--de-emphasized');
        if (isMenuBarOpen && isContentDeEmphasized) {
            this.setState({ isMenuBarOpen: false });
        }

        if (isConfigSideBarOpen && isContentDeEmphasized) {
            this.setState({ isConfigSideBarOpen: false });
        }
    }

    navigateTo(route) {
        this.context.router.history.push(route);
    }

    setupContract(contractId) {
        const { sessionContract, user } = this.props;
        const userId = user && user.id;
        const newContractSelected = !sessionContract || contractId !== sessionContract.id;
        if (userId && newContractSelected) {
            performSetSessionContract(userId, contractId);
        }
    }

    render() {
        const { locale, contracts, sessionContract, loading, user } = this.props;
        const { isLogoutConfirmVisible, isConfigSideBarOpen, isMenuBarOpen } = this.state;
        const { pathname } = window.location;
        const { formatMessage } = this.context.intl;
        const [, headRoute = '', subRoute] = pathname.split('/');
        const isSubmitMeterPageOpen = headRoute === PATHS.submit_meter.id;

        const icons = {
            '': faHome,
            documents: faBook,
            submit_meter: faCalculator,
            buyEnergy: faShoppingCart,
            directTrading: faSuitcase,
            profile: faUser
        };

        const menuItems = [
            {
                id: PATHS.overview.id,
                icon: icons[''],
                label: formatMessage(messages.overview),
                active:
                    headRoute === PATHS.overview.id ||
                    headRoute === PATHS.sellEnergy.id ||
                    headRoute === PATHS.myProducer.id ||
                    headRoute === PATHS.showTransactions.id,
                path: PATHS.overview.path,
                subItemActive:
                    headRoute === PATHS.sellEnergy.id ||
                    headRoute === PATHS.myProducer.id ||
                    headRoute === PATHS.showTransactions.id
            },
            {
                id: PATHS.documents.id,
                icon: icons.documents,
                label: formatMessage(messages.documents),
                active: headRoute === PATHS.documents.id,
                path: PATHS.documents.path
            },
            {
                id: PATHS.submit_meter.id,
                icon: icons.submit_meter,
                label: formatMessage(messages.submitMeter),
                active: isSubmitMeterPageOpen,
                path: PATHS.submit_meter.path
            },
            {
                id: PATHS.buyEnergy.id,
                icon: icons.buyEnergy,
                label: formatMessage(messages.buyEnergy),
                active: headRoute === PATHS.buyEnergy.id || headRoute === PATHS.producer.id,
                path: PATHS.buyEnergy.path,
                subItemActive: headRoute === PATHS.buyEnergy.id && subRoute === PATHS.producer.id,
                disabled: !this.validateContractStatus(user.contract.statusCode)
            },
            {
                id: PATHS.directTrading.id,
                icon: icons.directTrading,
                label: formatMessage(messages.directTrading),
                active: headRoute === PATHS.directTrading.id,
                path: PATHS.directTrading.path,
                disabled: true
            },
            {
                id: PATHS.profile.id,
                icon: icons.profile,
                label: formatMessage(messages.profile),
                active: headRoute === PATHS.profile.id,
                path: PATHS.profile.path
            }
        ];

        const footerItems = [
            {
                href: PATHS.about.path,
                label: formatMessage(messages.about),
                active: pathname === PATHS.about.path
            },
            {
                href: PATHS.termsAndConditions.path,
                label: formatMessage(messages.termsAndConditions),
                active: pathname === PATHS.termsAndConditions.path
            },
            {
                href: PATHS.faq.path,
                label: formatMessage(messages.faq),
                active: pathname === PATHS.faq.path
            }
        ];

        const haveNoWorkingContracts = !contracts.length || !sessionContract || !sessionContract.id;

        return (
            <div className="app">
                <ContractModal
                    labels={{
                        contractMessage: formatMessage(messages.contractMessage),
                        noContractMessage: formatMessage(messages.noContractMessage),
                        selectLabel: formatMessage(messages.selectContractMessage)
                    }}
                    contracts={contracts}
                    onSelect={({ value }) => this.setupContract(value)}
                    show={!loading && haveNoWorkingContracts}
                />
                <Confirm
                    labels={{
                        message: formatMessage(messages.logoutConfirmMessage),
                        confirmButton: formatMessage(messages.logoutConfirmButton),
                        cancelButton: formatMessage(messages.logoutCancelButton)
                    }}
                    show={isLogoutConfirmVisible}
                    onConfirm={() => performLogout()}
                    onCancel={() => this.handleLogoutCancel()}
                />
                <Header
                    logoutLabel={formatMessage(messages.logoutLabel)}
                    onLogoutClick={() => this.logout(formatMessage(messages.logoutConfirm))}
                    menuBarIcon={isMenuBarOpen ? faTimes : faBars}
                    menuBarLabel={formatMessage(messages.menuBarLabel)}
                    onToggleMenuBar={() => this.setState({ isMenuBarOpen: !isMenuBarOpen, isConfigSideBarOpen: false })}
                    breadCrumbs={this.props.breadCrumbs}
                    onBreadCrumbsClick={route => this.navigateTo(route)}
                    onLogoClick={() => this.navigateTo(PATHS.overview.path)}
                    locales={LOCALES}
                    locale={locale || DEFAULT_LOCALE}
                    onLocaleChange={locale => performSetupLocale(locale)}
                    contracts={contracts}
                    selectedContractId={(sessionContract && sessionContract.id) || ''}
                    onContractChange={contractId => this.setupContract(contractId)}
                    contractLabel={formatMessage(messages.contractLabel)}
                    noContractsMessage={formatMessage(messages.noContractsMessage)}
                    configSideBarIcon={isConfigSideBarOpen ? faTimes : faEllipsisV}
                    configSideLabel={formatMessage(messages.configSideBarLabel)}
                    onToggleConfigSideBar={() =>
                        this.setState({
                            isConfigSideBarOpen: !isConfigSideBarOpen,
                            isMenuBarOpen: false
                        })
                    }
                />
                <div
                    className={classNames({
                        content: true,
                        'covered-by-menu': isMenuBarOpen,
                        'covered-by-config-sidebar': isConfigSideBarOpen,
                        'content--de-emphasized': isMenuBarOpen || isConfigSideBarOpen
                    })}
                    onClick={event => this.handleDeEmphasizedContentClick(event.target)}
                >
                    <div
                        aria-live="polite"
                        className={classNames({
                            'menu-container': true,
                            'menu-container--opened': isMenuBarOpen
                        })}
                    >
                        <MenuSideBar
                            items={menuItems}
                            onSelect={id => {
                                this.setState({ isMenuBarOpen: false });
                                this.navigateTo(id);
                            }}
                        />
                    </div>
                    <div
                        role="article"
                        id="main-container"
                        className={classNames({ 'main-container--fixed-height': isSubmitMeterPageOpen })}
                    >
                        <main>{this.props.children}</main>
                        <Footer
                            addressLabel={formatMessage(messages.address)}
                            navItems={footerItems}
                            onSelect={href => this.navigateTo(href)}
                        />
                    </div>
                    <div
                        aria-live="polite"
                        aria-hidden={!!isConfigSideBarOpen ? undefined : true}
                        className={classNames({
                            'right-config-sidebar': true,
                            'right-config-sidebar--opened': isConfigSideBarOpen
                        })}
                    >
                        <div className="config-items">
                            {!!contracts.length ? (
                                <SelectField
                                    className="config-contract-select"
                                    name="current-contract"
                                    label={formatMessage(messages.selectContractMessage)}
                                    options={contracts.map(({ id }) => ({ value: id, label: `#${id}` }))}
                                    value={(sessionContract && sessionContract.id) || ''}
                                    onChange={({ value }) => this.setupContract(value)}
                                    supportEmptyValue
                                />
                            ) : (
                                <p className="contract-config-select-no-contracts-alert">
                                    {formatMessage(messages.noContractsMessage)}
                                </p>
                            )}
                            <SelectField
                                className="config-contract-select"
                                name="current-locale"
                                label={formatMessage(messages.selectLocaleMessage)}
                                options={LOCALES}
                                value={locale || DEFAULT_LOCALE}
                                onChange={({ value }) => performSetupLocale(value)}
                                supportEmptyValue
                            />
                            <div className="config-logout-btn">
                                <Button
                                    type="primary"
                                    onClick={() => this.logout(formatMessage(messages.logoutConfirm))}
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} />
                                    <span>{formatMessage(messages.logoutLabel)}</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

App.contextTypes = {
    router: PropTypes.object,
    intl: PropTypes.object
};
App.propTypes = {
    loggingOut: PropTypes.bool,
    user: PropTypes.object,
    locale: PropTypes.string,
    contracts: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string
        })
    ),
    sessionContract: PropTypes.shape({
        id: PropTypes.string
    }),
    loading: PropTypes.bool
};
App.defaultProps = {
    user: {},
    contracts: [],
    loading: false
};

export default connect(App.mapStateToProps)(App);
