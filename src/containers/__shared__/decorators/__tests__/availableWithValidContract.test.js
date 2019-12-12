import React from 'react';
import { CONTRACT_STATUSES } from '../../../../constants';
import availableWithValidContract from '../availableWithValidContract';
import { mount } from 'enzyme';

const routerStub = {
    history: {
        push: jest.fn()
    }
};

function renderComponent(props = { user: { statusCode: CONTRACT_STATUSES.active } }) {
    const Component = availableWithValidContract(() => <div>Hi! Bruce</div>);
    return mount(<Component {...props} />, {
        context: { router: routerStub }
    });
}

describe('Higher-Order Component "availableWithValidContract"', () => {
    it('should render low order component only with valid contract', () => {
        const component = renderComponent();
        expect(component.find('div').text()).toBe('Hi! Bruce');
        expect(routerStub.history.push).toHaveBeenCalledTimes(0);
        component.setProps({ user: { contract: { statusCode: CONTRACT_STATUSES.waiting } } });
        expect(routerStub.history.push).toHaveBeenCalledTimes(1);
    });
});
