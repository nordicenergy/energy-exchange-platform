import React from 'react';
import { shallow } from 'enzyme';
import TradePosition from '../TradePosition';
import { Button } from '../../../.';

const tradePositionDummy = {
    offerAddressUrl: 'http://offer.address.test/0x123f681646d4a755815f9cb19e1acc8565a0c2ac',
    offerAddress: '0x123f681646d4a755815f9cb19e1acc8565a0c2ac',
    producerUrl: 'http://producer.test/1',
    producerName: 'Bio-Erdgas-Anlage in der ehemaligen Schultheiss',
    offerIssued: 'May 06, 2018 3:00',
    validOn: 'May 25, 2018',
    energyOffered: 3800,
    energyAvailable: 3500,
    price: 3.5
};
function renderComponent({ tradePosition = tradePositionDummy, ...otherProps } = {}, mountFn = shallow) {
    return mountFn(<TradePosition tradePosition={tradePosition} {...otherProps} />);
}

describe('<TradePosition /> component', () => {
    it('should renders without errors', () => {
        const tradePosition = renderComponent();

        expect(tradePosition.find('.trade-position-entry a')).toHaveLength(2);
        expect(
            tradePosition
                .find('.trade-position-entry a')
                .at(0)
                .props().href
        ).toBe(tradePositionDummy.offerAddressUrl);
        expect(
            tradePosition
                .find('.trade-position-entry a')
                .at(1)
                .props().href
        ).toBe(tradePositionDummy.producerUrl);
        expect(tradePosition.find('.trade-position-entry strong')).toHaveLength(5);
        expect(tradePosition.find('.trade-position-tx--performed')).toHaveLength(0);
        expect(tradePosition.find(Button)).toHaveLength(1);
    });

    it('should replace empty producer name with placeholder placeholder', () => {
        const tradePosition = renderComponent({
            tradePosition: { ...tradePositionDummy, producerUrl: '', producerName: '' }
        });

        expect(
            tradePosition
                .find('.trade-position-entry > strong')
                .at(0)
                .text()
        ).toBe('Unknown');
    });

    it('should call onPerform callback', () => {
        const onPerformStub = jest.fn();
        const tradePosition = renderComponent({
            tradePosition: tradePositionDummy,
            onPerform: onPerformStub
        });
        tradePosition
            .find('Button')
            .props()
            .onClick();
        expect(onPerformStub).toHaveBeenCalledWith(tradePositionDummy);
    });

    it('should call onPerform which is provided by default', () => {
        const tradePosition = renderComponent({
            tradePosition: tradePositionDummy
        });
        const testValue = tradePosition
            .find('Button')
            .props()
            .onClick();
        expect(testValue).toEqual(tradePositionDummy);
    });

    it('should position as marked when transaction was performed', () => {
        const tradePosition = renderComponent({
            tradePosition: { ...tradePositionDummy, txHash: '0x1234', txHashUrl: 'http://eth.scan.com/0x1234' }
        });
        expect(tradePosition.find(Button)).toHaveLength(0);
        expect(tradePosition.find('.trade-position-tx--performed')).toHaveLength(1);
        expect(tradePosition.find('.trade-position-entry')).toHaveLength(8);
    });
});
