import React from 'react';
import NotFoundPage, { About } from '../NotFoundPage';
import { mountWithIntl } from '../../../services/intlTestHelper';

const context = {
    intl: {
        formatMessage: jest.fn()
    }
};

function renderComponent(mountFn = mountWithIntl) {
    return mountFn(<NotFoundPage context={context} />);
}

describe('<NotFoundPage /> Component', () => {
    it(`should contains following controls:
        - 1 <h1> with correct text;`, () => {
        const component = renderComponent();

        expect(component.find('h1')).toHaveLength(1);
        expect(component.find('h1').text()).toBe('Page Not Found');
    });
});
