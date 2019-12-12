import React from 'react';
import ProducerInfo, { Placeholder } from '../ProducerInfo';
import { mount } from 'enzyme';
import { formatFloat } from '../../../services/formatter';

const props = {
    labels: {
        name: 'Name',
        price: 'Price',
        marketPrice: 'market price is',
        energyType: 'Type of energy',
        annualProduction: 'Annual Production',
        purchased: 'Energy purchased',
        capacity: 'Peak Capacity',
        selectedSince: 'Selected since',
        location: 'Location',
        ethereumAddress: 'Ethereum Address'
    },
    details: {
        name: 'Peter Producer',
        price: 2.4,
        energyType: 'Wind',
        annualProduction: 3000,
        purchased: 1300,
        capacity: 8,
        selectedSince: 'Sep 12 - Feb 22',
        ethereumAddress: '0x3E7e5d1810F825a2B27C6BEC5fCB32F3eaCd192e',
        location: 'Lippendorf, Neukieritzsch',
        marketPrice: null,
        status: 'active'
    },
    description: 'Lorem ipsum text',
    picture: 'http://via.placeholder.com/350x150'
};

function renderComponent(props) {
    return mount(<ProducerInfo {...props} />);
}

describe('<ProducerInfo /> Component', () => {
    it(`should contains following controls:
        - 2 <section>;
        - 1 <figure>;
        - 1 <a> (location link to google maps);
        - 1 <img> with correct src;
        - 8 ".producer-information-row" with correct key-values;
        - 1 ".producer-information-desc" with correct content;`, () => {
        const component = renderComponent(props);

        expect(component.find('section').length).toEqual(2);
        expect(component.find('figure').length).toEqual(1);
        expect(component.find('img').length).toEqual(1);
        expect(component.find('a').length).toEqual(1);
        expect(component.find('.producer-information-row').length).toEqual(9);

        const description = component.find('.producer-information-desc');
        expect(description.length).toEqual(1);
        expect(description.at(0).text()).toEqual(props.description);

        const anchor = component.find('a');
        expect(anchor.length).toEqual(1);
        expect(anchor.at(0).props().href).toEqual('http://maps.google.com/?q=Lippendorf, Neukieritzsch');

        const img = component.find('img');
        expect(img.length).toEqual(1);
        expect(img.at(0).props().src).toEqual(props.picture);

        const rows = component.find('.producer-information-row');
        expect(rows.at(0).text()).toEqual(`${props.labels.name}${props.details.name}`);
        expect(rows.at(1).text()).toEqual(`${props.labels.price}${formatFloat(props.details.price)} ct/kWh`);
        expect(rows.at(2).text()).toEqual(`${props.labels.energyType}${props.details.energyType}`);
        expect(rows.at(3).text()).toEqual(
            `${props.labels.annualProduction}${formatFloat(props.details.annualProduction)} kWh/day`
        );
        expect(rows.at(4).text()).toEqual(`${props.labels.purchased}${formatFloat(props.details.purchased)} kWh`);
        expect(rows.at(5).text()).toEqual(`${props.labels.capacity}${formatFloat(props.details.capacity / 1000)} MW`); // convert to MW
        expect(rows.at(6).text()).toEqual(`${props.labels.selectedSince}${props.details.selectedSince}`);
        expect(rows.at(7).text()).toEqual(`${props.labels.ethereumAddress}${props.details.ethereumAddress}`);
        expect(rows.at(8).text()).toEqual(`${props.labels.location}${props.details.location}`);
    });

    it('should render image placeholder and hide some fields in case when data is absent', () => {
        const newProps = {
            ...props,
            details: {},
            picture: ''
        };
        const component = renderComponent(newProps);

        expect(component.find('section').length).toEqual(2);
        expect(component.find('figure').length).toEqual(1);
        expect(component.find(Placeholder).length).toEqual(1);
        expect(component.find('.producer-information-row').length).toEqual(0);
    });

    it('should render market price info if it is provided', () => {
        const newProps = {
            ...props,
            details: {
                price: 2.3,
                marketPrice: 1.2
            }
        };
        const component = renderComponent(newProps);
        const { labels, details } = newProps;

        const priceRow = component.find('.producer-information-row');
        expect(priceRow.length).toEqual(1);
        expect(priceRow.at(0).text()).toContain(labels.price);
        expect(priceRow.at(0).text()).toContain(labels.marketPrice);
        expect(priceRow.at(0).text()).toContain(`${formatFloat(details.price)}`);
        expect(priceRow.at(0).text()).toContain(`${formatFloat(details.marketPrice)}`);
        expect(priceRow.at(0).text()).toEqual(
            `${labels.price}${formatFloat(details.price)} ct/kWhmarket price is ${formatFloat(
                details.marketPrice
            )} ct/kWh`
        );

        expect(component.find('.producer-information-market-value').length).toEqual(1);
        expect(component.find('small').length).toEqual(1);
        expect(component.find('strong').length).toEqual(1);
    });

    it('should use market price as price if producer has status standard', () => {
        const newProps = {
            ...props,
            details: {
                price: 2.3,
                marketPrice: 1.2,
                status: 'standard'
            }
        };
        const component = renderComponent(newProps);
        const { labels, details } = newProps;

        const priceRow = component.find('.producer-information-row');
        expect(priceRow.length).toEqual(1);
        expect(priceRow.at(0).text()).toEqual(`${labels.price}${formatFloat(details.marketPrice)} ct/kWh`);

        expect(component.find('.producer-information-market-value').length).toEqual(0);
        expect(component.find('small').length).toEqual(0);
        expect(component.find('strong').length).toEqual(0);
    });
});
