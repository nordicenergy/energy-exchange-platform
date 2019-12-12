import React from 'react';
import { shallow } from 'enzyme';
import EmptyRecentTransactions from '../EmptyRecentTransactions';

function renderComponent(props = {}, mountFn = shallow) {
    return mountFn(<EmptyRecentTransactions />);
}

describe('<EmptyRecentTransactions /> component', () => {
    it('should render with necessary components', () => {
        const emptyRecentTransactions = renderComponent();

        expect(emptyRecentTransactions.find('.empty-recent-transactions-title')).toHaveLength(1);
        expect(emptyRecentTransactions.find('.empty-recent-transactions-icon')).toHaveLength(1);
        expect(emptyRecentTransactions.find('.empty-recent-transactions-message')).toHaveLength(1);
    });
});
