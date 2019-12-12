import React from 'react';
import { shallow } from 'enzyme';
import BackLink from '../BackLink';

function renderComponent(props = {}, mountFn = shallow) {
    return mountFn(<BackLink {...props} />);
}

describe('<BackLink /> component', () => {
    it('should renders without errors', () => {
        renderComponent();
    });

    it('should calls onClick callback', () => {
        const backLink = renderComponent({ onClick: jest.fn() });

        backLink.find('a').simulate('click');
        expect(backLink.props().onClick).toHaveBeenCalled();
    });
});
