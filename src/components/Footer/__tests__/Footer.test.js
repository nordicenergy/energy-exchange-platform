import React from 'react';
import Footer from '../Footer';
import { mount } from 'enzyme';

const props = {
    navItems: [
        {
            active: true,
            label: 'item1',
            href: '#item1'
        },
        {
            label: 'item2',
            href: '#item2'
        }
    ],
    addressLabel: 'Company Address',
    onSelect: jest.fn()
};

function renderComponent(props) {
    return mount(<Footer {...props} />);
}

describe('<Footer /> Component', () => {
    it(`should contains following controls:
        - <footer> with class 'app-footer';
        - <a> elements with correct labels;
        - <address> with provided label;`, () => {
        const component = renderComponent(props);
        const text = component.debug();

        expect(text.includes('footer className="app-footer"')).toEqual(true);
        expect(component.find('address').length).toEqual(1);
        expect(text.includes('Company Address')).toEqual(true);
        expect(component.find('a').length).toEqual(2);
        expect(component.find('.footer-item--active').length).toEqual(1);
        expect(text.includes('item1')).toEqual(true);
        expect(text.includes('item1')).toEqual(true);
    });

    it('should handle on click event', () => {
        const component = renderComponent(props);
        component
            .find('a')
            .at(1)
            .simulate('click');
        expect(props.onSelect.mock.calls.length).toEqual(1);
        const [[id]] = props.onSelect.mock.calls;
        expect(id).toEqual('#item2');
        expect(component.find('.footer-item--active').length).toEqual(1);
    });

    it('should set default values at missing props and should not throw an error', () => {
        const component = renderComponent({
            navItems: props.navItems
        });
        component
            .find('a')
            .at(0)
            .simulate('click');
        expect(component.exists()).toBeTruthy();

        const anotherFooterComponent = renderComponent();
        expect(anotherFooterComponent.exists()).toBeTruthy();
    });
});
