import React from 'react';
import PropTypes from 'prop-types';
import faEllipsisV from '@fortawesome/fontawesome-free-solid/faEllipsisV';
import faBars from '@fortawesome/fontawesome-free-solid/faBars';
import faSignOutAlt from '@fortawesome/fontawesome-free-solid/faSignOutAlt';
import Logo from '../Logo';
import Breadcrumbs from './Breadcrumbs';
import LanguageSelect from './LanguageSelect';
import HeaderButton from './HeaderButton';
import './Header.css';
import ContractSelect from './ContractSelect/ContractSelect';

const Header = ({
    breadCrumbs,
    onBreadCrumbsClick,

    menuBarIcon,
    menuBarLabel,
    onToggleMenuBar,

    configSideBarIcon,
    configSideBarLabel,
    onToggleConfigSideBar,

    logoutLabel,
    onLogoutClick,

    locales,
    locale,
    onLocaleChange,

    contractLabel,
    noContractsMessage,
    contracts,
    selectedContractId,
    onContractChange,

    onLogoClick
}) => {
    return (
        <header className="header-desktop">
            <div aria-live="polite" className="header-menu-bars-button">
                <HeaderButton label={menuBarLabel} icon={menuBarIcon} onClickHandler={() => onToggleMenuBar()} />
            </div>
            <div className="logo-container">
                <Logo className="logo--header" size="small" onClick={() => onLogoClick()} />
            </div>
            <nav className="main-header-container">
                <Breadcrumbs items={breadCrumbs} onClick={onBreadCrumbsClick} />
                <div className="header-buttons">
                    <ContractSelect
                        label={contractLabel}
                        noContractsMessage={noContractsMessage}
                        contracts={contracts}
                        selectedContractId={selectedContractId}
                        onChange={onContractChange}
                    />
                    <LanguageSelect locales={locales} value={locale} onChange={onLocaleChange} />
                    <HeaderButton label={logoutLabel} icon={faSignOutAlt} onClickHandler={() => onLogoutClick()} />
                </div>
            </nav>
            <div aria-live="polite" className="header-config-button">
                <HeaderButton
                    label={configSideBarLabel}
                    icon={configSideBarIcon}
                    onClickHandler={() => onToggleConfigSideBar()}
                />
            </div>
        </header>
    );
};

Header.propTypes = {
    menuBarIcon: PropTypes.any,
    menuBarLabel: PropTypes.string,
    onToggleMenuBar: PropTypes.func,

    configSideBarIcon: PropTypes.any,
    configSideBarLabel: PropTypes.string,
    onToggleConfigSideBar: PropTypes.func,

    logoutLabel: PropTypes.string,
    onLogoutClick: PropTypes.func,

    breadCrumbs: PropTypes.arrayOf(PropTypes.any),
    onBreadCrumbsClick: PropTypes.func,

    locales: PropTypes.arrayOf(PropTypes.string),
    locale: PropTypes.string.isRequired,
    onLocaleChange: PropTypes.func,

    contractLabel: PropTypes.string,
    noContractsMessage: PropTypes.string,
    contracts: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string
        })
    ).isRequired,
    selectedContractId: PropTypes.string,
    onContractChange: PropTypes.func,

    onLogoClick: PropTypes.func
};

Header.defaultProps = {
    logoutLabel: 'Logout',
    onLogoutClick: f => f,

    menuBarIcon: faBars,
    menuBarLabel: 'Toggle Menu Bar',
    onToggleMenuBar: f => f,

    configSideBarIcon: faEllipsisV,
    configSideBarLabel: 'Configuration Side Bar',
    onToggleConfigSideBar: f => f,

    breadCrumbs: [],
    onBreadCrumbsClick: f => f,

    onLocaleChange: f => f,
    locales: ['EN', 'DE'],
    locale: 'EN',

    contractLabel: 'Contract',
    noContractsMessage: 'No contract',
    onContractChange: f => f,
    contracts: [],

    onLogoClick: f => f
};

export default Header;
