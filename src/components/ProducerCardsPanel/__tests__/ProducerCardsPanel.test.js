import React from 'react';
import { shallow } from 'enzyme';
import ProducerCardsPanel from '../ProducerCardsPanel';

const producersMock = [
    { id: 0, price: 2.9, plantType: 'solar', name: 'John Doe' },
    { id: 1, price: 2, plantType: 'wind', name: 'Producer' },
    { id: 2, price: 1, plantType: 'biomass', name: 'Jeremy' },
    { id: 3, price: 5, plantType: 'wind', name: 'Blark' },
    { id: 4, price: 1, plantType: 'solar', name: 'Alice' }
];

function renderComponent({ producers = producersMock, ...otherProps } = {}, mountFn = shallow) {
    return mountFn(<ProducerCardsPanel producers={producers} {...otherProps} />);
}

describe('<ProducerCardsPanel /> component', () => {
    it('should renders without errors', () => {
        renderComponent();
    });

    it('should renders with spinner', () => {
        const producerCardsPanel = renderComponent({ loading: true });

        expect(producerCardsPanel.find('Spinner')).toHaveLength(1);
    });
});
