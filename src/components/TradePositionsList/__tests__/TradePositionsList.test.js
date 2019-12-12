import React from 'react';
import { shallow } from 'enzyme';
import TradePositionsList from '../TradePositionsList';

const tradePositionsDummy = [
    {
        offerAddressUrl: 'http://offer.address.test/0x123f681646d4a755815f9cb19e1acc8565a0c2ac',
        offerAddress: '0x123f681646d4a755815f9cb19e1acc8565a0c2ac',
        producerUrl: 'http://producer.test/1',
        producerName: 'Bio-Erdgas-Anlage in der ehemaligen Schultheiss',
        offerIssued: 'May 06, 2018 3:00',
        validOn: 'May 25, 2018',
        energyOffered: 3800,
        energyAvailable: 3500,
        price: 3.5
    },
    {
        offerAddressUrl: 'http://offer.address.test/0x123f681646d4a755815f9cb19e1acc8565a0c2ac',
        offerAddress: '0x123f681646d4a755815f9cb19e1acc8565a0c2ac',
        producerUrl: 'http://producer.test/1',
        producerName: 'Bio-Erdgas-Anlage in der ehemaligen Schultheiss',
        offerIssued: 'May 06, 2018 3:00',
        validOn: 'May 25, 2018',
        energyOffered: 3800,
        energyAvailable: 3500,
        price: 3.5
    },
    {
        offerAddressUrl: 'http://offer.address.test/0x123f681646d4a755815f9cb19e1acc8565a0c2ac',
        offerAddress: '0x123f681646d4a755815f9cb19e1acc8565a0c2ac',
        producerUrl: 'http://producer.test/1',
        producerName: 'Bio-Erdgas-Anlage in der ehemaligen Schultheiss',
        offerIssued: 'May 06, 2018 3:00',
        validOn: 'May 25, 2018',
        energyOffered: 3800,
        energyAvailable: 3500,
        price: 3.5
    }
];
const sortOptionsDummy = [
    { value: 'a', label: 'Test A' },
    { value: 'b', label: 'Test B' },
    { value: 'c', label: 'Test C' }
];
function renderComponent({ tradePositions = tradePositionsDummy, ...otherProps } = {}, mountFn = shallow) {
    return mountFn(<TradePositionsList tradePositions={tradePositions} {...otherProps} />);
}

describe('<TradePositionsList /> component', () => {
    it(`should renders:
    - h3 title;
    - <BackLink />
    - toolbar form;
    - <TextField />;
    - <DateField />;
    - 3 <TradePosition />;`, () => {
        const tradePositionsList = renderComponent();

        expect(tradePositionsList.find('.trade-positions-list-layout > h3')).toHaveLength(1);
        expect(tradePositionsList.find('.trade-positions-list-layout > form')).toHaveLength(1);
        expect(tradePositionsList.find('BackLink')).toHaveLength(1);
        expect(tradePositionsList.find('TextField')).toHaveLength(1);
        expect(tradePositionsList.find('DateField')).toHaveLength(1);
        expect(tradePositionsList.find('TradePosition')).toHaveLength(3);
    });

    it('should renders with <SortToolbar />', () => {
        const tradePositionsList = renderComponent({ sortOptions: sortOptionsDummy });

        expect(tradePositionsList.find('SortToolbar')).toHaveLength(1);
    });

    it('should calls onBackClick callback', () => {
        const onBackClickStub = jest.fn();
        const tradePositionsList = renderComponent({ onBackClick: onBackClickStub });

        tradePositionsList
            .find('BackLink')
            .props()
            .onClick();
        expect(onBackClickStub).toHaveBeenCalled();
    });

    it('should calls onTradeVolumeChange callback', () => {
        const onTradeVolumeChangeStub = jest.fn();
        const eventDummy = new Event('input');
        const tradePositionsList = renderComponent({ onTradeVolumeChange: onTradeVolumeChangeStub });

        tradePositionsList
            .find('TextField')
            .props()
            .onChange(eventDummy);
        expect(onTradeVolumeChangeStub).toHaveBeenCalledWith(eventDummy);
    });

    it('should calls onTradeVolumeChange callback', () => {
        const onDateFilterChangeStub = jest.fn();
        const payloadDummy = { name: undefined, value: Date.now() };
        const tradePositionsList = renderComponent({ onDateFilterChange: onDateFilterChangeStub });

        tradePositionsList
            .find('DateField')
            .props()
            .onChange(payloadDummy);
        expect(onDateFilterChangeStub).toHaveBeenCalledWith(payloadDummy);
    });

    it('should calls onTradeVolumeChange callback', () => {
        const onSortParametersChangeStub = jest.fn();
        const parametersDummy = { name: undefined, value: Date.now() };
        const tradePositionsList = renderComponent({
            sortOptions: sortOptionsDummy,
            onSortParametersChange: onSortParametersChangeStub
        });

        tradePositionsList
            .find('SortToolbar')
            .props()
            .onChange(parametersDummy);
        expect(onSortParametersChangeStub).toHaveBeenCalledWith(parametersDummy);
    });

    it('should calls default onTradeVolumeChange if callback is not provided', () => {
        const tradePositionsList = renderComponent({ sortOptions: sortOptionsDummy });

        const testValue = tradePositionsList
            .find('SortToolbar')
            .props()
            .onChange('test');
        expect(testValue).toBe('test');
    });

    it('should call onPerformTransaction callback', () => {
        const tradePositionDummy = {
            producerId: 19,
            producerAddress: '0x63d8d1489508E9b6B1661Ce1DfEBBBdDc424193A',
            offerAddressUrl: 'https://ropsten.etherscan.io/address/0x63d8d1489508E9b6B1661Ce1DfEBBBdDc424193A',
            offerAddress: '0x63d8d1489508E9b6B1661Ce1DfEBBBdDc424193A',
            producerUrl: '/buy_energy/producer/19',
            producerName: 'Photovoltaik-Anlage in Mariendorf',
            offerIssued: 'May 05, 2018 12:00',
            offerIssuedTimestamp: 1525478400,
            validOn: '--',
            energyOffered: '--',
            energyAvailable: '39,9',
            energyAvailableFloat: 39.9,
            price: '3,20',
            priceFloat: 3.2
        };
        const onPerformTransactionStub = jest.fn();
        const tradePositionsList = renderComponent({
            onPerformTransaction: onPerformTransactionStub
        });
        tradePositionsList
            .find('TradePosition')
            .at(0)
            .props()
            .onPerform(tradePositionDummy);
        expect(onPerformTransactionStub).toHaveBeenCalledWith(tradePositionDummy);
    });

    it('should call default onPerformTransaction if callback is not provided', () => {
        const tradePositionsList = renderComponent();
        const testValue = tradePositionsList
            .find('TradePosition')
            .at(0)
            .props()
            .onPerform('test');
        expect(testValue).toBe('test');
    });
});
