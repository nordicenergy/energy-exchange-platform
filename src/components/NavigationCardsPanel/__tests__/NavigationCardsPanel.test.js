import React from 'react';
import NavigationCardsPanel from '../NavigationCardsPanel';
import NavigationCard from '../NavigationCard';
import { mount } from 'enzyme';

function renderComponent(props) {
    return mount(<NavigationCardsPanel {...props} />);
}

describe('<NavigationCard /> Component', () => {
    it(`should contains following controls:
        - 3 <NavigationCard/> components`, () => {
        const props = {
            navigationCards: [
                {
                    type: 'my_producer',
                    title: 'My Producer',
                    path: '/test1'
                },
                {
                    type: 'buy_energy',
                    title: 'Buy Energy',
                    path: '/test2'
                },
                {
                    type: 'sell_energy',
                    title: 'Sell Energy',
                    path: '/test3'
                }
            ],
            onCardClick: () => {}
        };
        const component = renderComponent(props);

        expect(component.find(NavigationCard)).toHaveLength(3);
        expect(component.find('p.nav-card-title')).toHaveLength(3);
        expect(
            component
                .find('p.nav-card-title')
                .at(0)
                .text()
        ).toEqual('My Producer');
        expect(
            component
                .find('p.nav-card-title')
                .at(1)
                .text()
        ).toEqual('Buy Energy');
        expect(
            component
                .find('p.nav-card-title')
                .at(2)
                .text()
        ).toEqual('Sell Energy');
    });

    it(`should call onCardClick`, () => {
        const onCardClick = jest.fn();
        const props = {
            navigationCards: [
                {
                    type: 'my_producer',
                    title: 'My Producer',
                    path: '/test1'
                }
            ],
            onCardClick
        };
        const component = renderComponent(props);

        component
            .find(NavigationCard)
            .at(0)
            .simulate('click');
        expect(onCardClick).toHaveBeenCalled();
        expect(onCardClick).toHaveBeenCalledWith('/test1');
    });
});
