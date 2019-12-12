import React from 'react';
import { shallow } from 'enzyme';
import SortOption, { ORDER_DESC, ORDER_ASC, NO_ORDER } from '../SortOption';

function renderComponent({ label = 'Price', value = 'price', ...otherProps } = {}, mountFn = shallow) {
    return mountFn(<SortOption value={value} label={label} {...otherProps} />);
}

describe('<SortOption /> component', () => {
    it('should renders without errors', () => {
        renderComponent();
    });

    it('should change icon when option was clicked', () => {
        const sortOption = renderComponent();

        expect(sortOption.html().includes('svg-inline--fa')).toBeFalsy();

        sortOption.simulate('click');
        sortOption.update();
        expect(sortOption.html().includes('fa-sort-amount-down')).toBeTruthy();

        sortOption.simulate('click');
        sortOption.update();
        expect(sortOption.html().includes('fa-sort-amount-up')).toBeTruthy();

        sortOption.simulate('click');
        sortOption.update();
        expect(sortOption.html().includes('svg-inline--fa')).toBeFalsy();
    });

    it('should calls onChange callback', () => {
        const onChangeStub = jest.fn();
        const sortOption = renderComponent({ onChange: onChangeStub });

        sortOption.simulate('click');
        sortOption.update();
        sortOption.simulate('click');
        sortOption.update();
        sortOption.simulate('click');
        sortOption.update();

        expect(onChangeStub).toHaveBeenCalledTimes(3);
        const [[firstCallArg], [secondCallArg], [thirdCallArg]] = onChangeStub.mock.calls;
        expect(firstCallArg).toEqual({ price: ORDER_DESC });
        expect(secondCallArg).toEqual({ price: ORDER_ASC });
        expect(thirdCallArg).toEqual({ price: NO_ORDER });
    });
});
