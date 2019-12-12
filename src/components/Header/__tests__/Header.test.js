import React from 'react';
import { faTimes } from '@fortawesome/fontawesome-free-solid';
import Header from '../Header';
import HeaderButton from '../HeaderButton';
import Logo from '../../Logo';
import { mount } from 'enzyme';

const localesDummy = ['en', 'de'];
const localeDummy = 'en';

const breadCrumbsClickStub = jest.fn();
const logoutClickStub = jest.fn();
const localeChangeStub = jest.fn();
const menuBarToggleStub = jest.fn();
const configSideBarToggleStub = jest.fn();
const logoClickStub = jest.fn();

function renderComponent(
    {
        onLogoClick = logoClickStub,
        onBreadCrumbsClick = breadCrumbsClickStub,
        onLogoutClick = logoutClickStub,
        locales = localesDummy,
        locale = localeDummy,
        onLocaleChange = localeChangeStub,
        onToggleMenuBar = menuBarToggleStub,
        configSideBarIcon = faTimes,
        configSideBarLabel = 'Test Sidebar Label',
        onToggleConfigSideBar = configSideBarToggleStub,
        ...otherProps
    } = {},
    mountFn = mount
) {
    return mountFn(
        <Header
            onBreadCrumbsClick={onBreadCrumbsClick}
            onLogoutClick={onLogoutClick}
            locales={locales}
            locale={locale}
            onLocaleChange={onLocaleChange}
            onToggleMenuBar={onToggleMenuBar}
            configSideBarIcon={configSideBarIcon}
            configSideBarLabel={configSideBarLabel}
            onToggleConfigSideBar={onToggleConfigSideBar}
            onLogoClick={onLogoClick}
            {...otherProps}
        />
    );
}

describe('<Header /> Component', () => {
    afterEach(() => {
        breadCrumbsClickStub.mockClear();
        logoutClickStub.mockClear();
        localeChangeStub.mockClear();
        menuBarToggleStub.mockClear();
        logoClickStub.mockClear();
        configSideBarToggleStub.mockClear();
    });

    it(`should contains following controls:
        - header with class "header-desktop";
        - Logo;
        - LanguageSelect;
        - ContractSelect;
        - HeaderButton`, () => {
        const header = renderComponent({});

        expect(header.find('ContractSelect')).toHaveLength(1);
        expect(header.find('LanguageSelect')).toHaveLength(1);
        expect(header.find('HeaderButton')).toHaveLength(3);
        expect(header.find('Logo')).toHaveLength(1);
        expect(header.find('header.header-desktop')).toHaveLength(1);
    });

    it('should handle breadcrumbs click event', () => {
        const header = renderComponent();
        header
            .find('Breadcrumbs')
            .props()
            .onClick('/test');
        expect(breadCrumbsClickStub).toHaveBeenCalledWith('/test');
    });

    it('should handle locale change event', () => {
        const header = renderComponent();
        header
            .find('LanguageSelect')
            .props()
            .onChange('de');
        expect(localeChangeStub).toHaveBeenCalledWith('de');
    });

    it('should handle logout clicking', () => {
        const header = renderComponent();
        header
            .find('HeaderButton')
            .at(1)
            .find('button')
            .simulate('click');
        expect(logoutClickStub).toHaveBeenCalled();
    });

    it('should handle menu bar toggling', () => {
        const header = renderComponent();
        header
            .find('HeaderButton')
            .at(0)
            .find('button')
            .simulate('click');
        expect(menuBarToggleStub).toHaveBeenCalled();
    });

    it('should handle config side bar toggling', () => {
        const header = renderComponent();
        header
            .find('HeaderButton')
            .at(2)
            .find('button')
            .simulate('click');
        expect(configSideBarToggleStub).toHaveBeenCalled();
    });

    it('should handle logo clicking', () => {
        const header = renderComponent();
        header
            .find('Logo')
            .props()
            .onClick();
        expect(logoClickStub).toHaveBeenCalled();
    });

    it('should setup default event handlers', () => {
        const header = mount(<Header />);
        expect(header.find(Header)).toHaveLength(1);
        header
            .find('Logo')
            .props()
            .onClick();
        header
            .find('HeaderButton')
            .at(0)
            .find('button')
            .simulate('click');
        header
            .find('HeaderButton')
            .at(1)
            .find('button')
            .simulate('click');
        header
            .find('HeaderButton')
            .at(2)
            .find('button')
            .simulate('click');
        header
            .find('LanguageSelect')
            .props()
            .onChange('de');
        header
            .find('Breadcrumbs')
            .props()
            .onClick('/test');
    });
});
