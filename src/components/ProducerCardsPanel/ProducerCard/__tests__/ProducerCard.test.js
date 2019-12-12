import React from 'react';
import { shallow } from 'enzyme';
import ProducerCard from '../ProducerCard';
import { formatFloat } from '../../../../services/formatter';

const producerDummy = {
    id: 1,
    price: 2.9003,
    name: 'John Doe',
    plantType: 'solar',
    picture: 'test.png'
};
const onClickStub = jest.fn();
function renderComponent({ producer = producerDummy, onClick = onClickStub, ...otherProps } = {}, mountFn = shallow) {
    return mountFn(<ProducerCard producer={producer} onClick={onClick} {...otherProps} />);
}

describe('<ProducerCard /> component', function() {
    it(`should renders without errors and contains following elements:
        - <div.producer-card-layout> element;
        - <strong> element;
        - <span.producer-card-plant-type> element;
        - <h3> element;
        - <small> element if producer status was provided;`, () => {
        const producerCard = renderComponent();
        expect(producerCard.find('div.producer-card-layout')).toHaveLength(1);
        expect(producerCard.find('strong.producer-card-price')).toHaveLength(1);
        expect(producerCard.find('.producer-card-name h3')).toHaveLength(1);
        expect(producerCard.find('.producer-card-name small')).toHaveLength(0);
        expect(producerCard.find('.producer-card-price').text()).toEqual(`${formatFloat(producerDummy.price)} ct/kWh`);

        producerCard.setProps({ producer: { ...producerDummy, status: 'sold out' } });
        expect(producerCard.find('.producer-card-name small')).toHaveLength(1);
    });

    it('should renders with default image', () => {
        const producerCard = renderComponent();
        const producerCardWithDefaultImage = renderComponent({ producer: { ...producerDummy, picture: null } });

        expect(producerCard.find('.producer-card').props().style.backgroundImage).toBe('url(test.png)');
        expect(producerCardWithDefaultImage.find('.producer-card').props().style.backgroundImage).toBe(
            'url(defaultImage.png)'
        );
    });

    it('should renders with selected style', () => {
        const producerCard = renderComponent({ selected: true });

        expect(producerCard.hasClass('producer-card--selected')).toBeTruthy();
    });

    it('should call onClick callback', () => {
        const producerCard = renderComponent();

        producerCard.simulate('click');
        expect(onClickStub).toHaveBeenCalledWith(producerDummy.id);

        onClickStub.mockClear();
    });

    it('should not call onClick callback if onClick is not function', () => {
        const producerCard = renderComponent({ onClick: null });

        producerCard.simulate('click');
    });

    it('should call onClick callback only on enter key press', () => {
        const producerCard = renderComponent();

        producerCard.simulate('keyUp', { key: 'Enter' });
        expect(onClickStub).toHaveBeenCalledTimes(1);

        producerCard.simulate('keyUp', { key: 'Tab' });
        expect(onClickStub).toHaveBeenCalledTimes(1);

        onClickStub.mockClear();
    });
});
