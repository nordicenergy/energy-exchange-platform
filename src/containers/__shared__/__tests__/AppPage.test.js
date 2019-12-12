import React from 'react';
import AppPage from '../AppPage';
import { mount } from 'enzyme';

describe('<AppPage />', () => {
    it('should call scrollToTop method on componentWillUnmount lifecycle method', () => {
        AppPage.prototype.scrollToTop = jest.fn();
        AppPage.prototype.render = jest.fn();
        const component = mount(<AppPage />);
        component.unmount();
        expect(AppPage.prototype.scrollToTop).toHaveBeenCalled();
    });

    it('should set default scrollhandler and should not throw an error', () => {
        const component = mount(<AppPage />);
        component.instance().scrollHandler();
        expect(component.exists()).toBeTruthy();
    });
});
