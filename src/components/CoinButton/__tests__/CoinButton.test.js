import React from 'react';
import { shallow } from 'enzyme';
import CoinButton from '../CoinButton';

function renderComponent(props = {}, mountFn = shallow) {
    return mountFn(<CoinButton {...props}>Test</CoinButton>);
}

describe('<CoinButton /> Component', () => {
    it(`should contains following controls:
        - 1 <button>;
        - 2 <span>;
        - 1 <strong>;`, () => {
        const component = renderComponent({ className: 'test-class', price: 2.5, label: 'test' });

        expect(component.hasClass('coin-button')).toBeTruthy();
        expect(component.hasClass('test-class')).toBeTruthy();
        expect(component.find('span').length).toEqual(2);
        expect(component.find('button').length).toEqual(1);
        expect(component.find('strong').length).toEqual(1);
    });

    it('should handle click event', () => {
        const onClickMock = jest.fn();
        const component = renderComponent({ onClick: onClickMock });

        component
            .find('button')
            .at(0)
            .simulate('click');
        expect(onClickMock).toHaveBeenCalled();
    });
});
