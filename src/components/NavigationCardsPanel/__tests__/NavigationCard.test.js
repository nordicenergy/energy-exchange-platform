import React from 'react';
import NavigationCard from '../NavigationCard';
import { mount } from 'enzyme';
import MyProducerIcon from '../MyProducerIcon';
import BuyEnergyIcon from '../BuyEnergyIcon';
import SellEnergyIcon from '../SellEnergyIcon';

function renderComponent(props) {
    return mount(<NavigationCard {...props} />);
}

describe('<NavigationCard /> Component', () => {
    it(`should contains following controls:
        - <svg /> element;
        - card title element with class "nav-card-title";`, () => {
        const props = {
            title: 'My Producer',
            type: 'my_producer',
            onCardClickHandler: () => {}
        };
        const component = renderComponent(props);

        expect(component.find('svg')).toHaveLength(1);
        expect(component.find('p.nav-card-title')).toHaveLength(1);
        expect(component.find('p.nav-card-title').text()).toEqual('My Producer');
    });

    it('should display MyProducerIcon', () => {
        const props = {
            title: 'My Producer',
            type: 'my_producer',
            onCardClickHandler: () => {}
        };
        const component = renderComponent(props);
        expect(component.find(MyProducerIcon)).toHaveLength(1);
    });

    it('should display BuyEnergyIcon', () => {
        const props = {
            title: 'Buy Energy',
            type: 'buy_energy',
            onCardClickHandler: () => {}
        };
        const component = renderComponent(props);
        expect(component.find(BuyEnergyIcon)).toHaveLength(1);
    });

    it('should display SellEnergyIcon', () => {
        const props = {
            title: 'Sell Energy',
            type: 'sell_energy',
            onCardClickHandler: () => {}
        };
        const component = renderComponent(props);
        expect(component.find(SellEnergyIcon)).toHaveLength(1);
    });

    it(`should call onCardClickHandler`, () => {
        const onCardClickHandler = jest.fn();
        const props = {
            title: 'My Producer',
            type: 'my_producer',
            onCardClickHandler
        };
        const component = renderComponent(props);

        component.find('.nav-card-container').simulate('click');
        expect(onCardClickHandler).toHaveBeenCalled();
    });

    it(`should call onCardClickHandler only on enter key press`, () => {
        const onCardClickHandler = jest.fn();
        const props = {
            title: 'My Producer',
            type: 'my_producer',
            onCardClickHandler
        };
        const component = renderComponent(props);

        component.find('.nav-card-container').simulate('keyUp', { key: 'Enter' });
        expect(onCardClickHandler).toHaveBeenCalledTimes(1);
        component.find('.nav-card-container').simulate('keyUp', { key: 'Tab' });
        expect(onCardClickHandler).toHaveBeenCalledTimes(1);
    });
});
