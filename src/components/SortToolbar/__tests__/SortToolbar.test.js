import React from 'react';
import { shallow } from 'enzyme';
import SortToolbar from '../SortToolbar';

const sortOptionsDummy = [
    { value: 'a', label: 'Test A' },
    { value: 'b', label: 'Test B' },
    { value: 'c', label: 'Test C' }
];
function renderComponent({ sortOptions = sortOptionsDummy, ...otherProps } = {}, mountFn = shallow) {
    return mountFn(<SortToolbar sortOptions={sortOptions} {...otherProps} />);
}

describe('<SortToolbar /> component', () => {
    it(`should renders:
        - <strong /> with "sort-toolbar-title" class;
        - 3 <SortOption />`, () => {
        const sortToolbar = renderComponent();

        expect(sortToolbar.find('.sort-toolbar-title').text()).toBe('Sort by');
        expect(sortToolbar.find('SortOption')).toHaveLength(3);
    });

    it('should calls onChange callback', () => {
        const onChangeStub = jest.fn();
        const sortToolbar = renderComponent({ onChange: onChangeStub });

        sortToolbar
            .find('SortOption')
            .at(1)
            .props()
            .onChange({ b: 'desc' });
        sortToolbar
            .find('SortOption')
            .at(1)
            .props()
            .onChange({ b: 'asc' });
        sortToolbar
            .find('SortOption')
            .at(1)
            .props()
            .onChange({ b: null });

        expect(onChangeStub).toHaveBeenCalledTimes(3);
        const [[firstCallArg], [secondCallArg], [thirdCallArg]] = onChangeStub.mock.calls;
        expect(firstCallArg).toEqual({ b: 'desc' });
        expect(secondCallArg).toEqual({ b: 'asc' });
        expect(thirdCallArg).toEqual({});
    });
});
