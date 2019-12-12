import React from 'react';
import { mount } from 'enzyme';
import RecentTransactions from '../RecentTransactions';
import { Button, DisclosureArrow } from '../../.';
import RecentTransactionDetails from '../RecentTransactionDetails';
import Spinner from '../../Loader/Spinner';
import { formatFloat, formatCurrency } from '../../../services/formatter';

const labelsMock = {
    recentTransactionsTitle: 'Most Recent Transactions',
    recentTransactionsHeaderDate: 'Date',
    recentTransactionsHeaderTransaction: 'Transaction',
    recentTransactionsHeaderAmount: 'Amount',
    recentTransactionsMonthlyBalance: 'Monthly Balance',
    recentTransactionsMore: 'More',
    recentTransactionsDetailsFrom: 'From',
    recentTransactionsDetailsAmount: 'Amount',
    recentTransactionsDetailsPrice: 'Price per kWh',
    recentTransactionsDetailsHash: 'Blockchain-Transaction',
    recentTransactionsDetailsStatus: 'Status'
};

const transactionsDummy = [
    {
        id: '1',
        date: 1523707200,
        description: 'Bought 23 kWh Alice',
        transactionAmount: 0.81,
        details: {
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
            status: 'success',
            price: 2.5,
            amount: 7.74,
            from: 'Jhon Doe',
            url: 'https://ropsten.etherscan.io/tx/0x25a23d106b2c4299a98e553d96570941556e53fe8808476ee0fceb5d72859540'
        }
    },
    {
        id: '2',
        date: 1523707200,
        description: 'Monthly invoice',
        transactionAmount: 0.081,
        details: {
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
            status: 'success',
            price: 2.5,
            amount: 7.74,
            from: 'Jhon Doe',
            url: 'https://ropsten.etherscan.io/tx/0x25a23d106b2c4299a98e553d96570941556e53fe8808476ee0fceb5d72859540'
        }
    },
    {
        id: '3',
        date: 1523707200,
        description: 'Bought 23 kWh from Peter',
        transactionAmount: 0.8,
        details: {
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
            status: 'success',
            price: 2.5,
            amount: 7.74,
            from: 'Jhon Doe',
            url: 'https://ropsten.etherscan.io/tx/0x25a23d106b2c4299a98e553d96570941556e53fe8808476ee0fceb5d72859540'
        }
    },
    {
        id: '4',
        date: 1523707200,
        description: 'Bought 23 kWh from Peter',
        transactionAmount: 0.8,
        details: {
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
            status: 'success',
            price: 2.5,
            amount: 7.74,
            from: 'Jhon Doe',
            url: 'https://ropsten.etherscan.io/tx/0x25a23d106b2c4299a98e553d96570941556e53fe8808476ee0fceb5d72859540'
        }
    },
    {
        id: '5',
        date: 1523707200,
        description: 'Bought 23 kWh from Peter',
        transactionAmount: 0.8,
        details: {
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
            status: 'success',
            price: 2.5,
            amount: 7.74,
            from: 'Jhon Doe',
            url: 'https://ropsten.etherscan.io/tx/0x25a23d106b2c4299a98e553d96570941556e53fe8808476ee0fceb5d72859540'
        }
    },
    {
        id: '6',
        date: 1523707200,
        description: 'Bought 23 kWh from Peter',
        transactionAmount: 0.8,
        details: {
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
            status: 'success',
            price: 2.5,
            amount: 7.74,
            from: 'Jhon Doe',
            url: 'https://ropsten.etherscan.io/tx/0x25a23d106b2c4299a98e553d96570941556e53fe8808476ee0fceb5d72859540'
        }
    },
    {
        id: '7',
        date: 1523707200,
        description: 'Bought 23 kWh from Peter',
        transactionAmount: 0.8,
        details: {
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
            status: 'success',
            price: 2.5,
            amount: 7.74,
            from: 'Jhon Doe',
            url: 'https://ropsten.etherscan.io/tx/0x25a23d106b2c4299a98e553d96570941556e53fe8808476ee0fceb5d72859540'
        }
    }
];

const currentBalanceDummy = {
    balance: 10,
    date: 1523707200
};

function renderComponent(
    {
        loading = false,
        pagination = false,
        labels = labelsMock,
        transactions = transactionsDummy,
        currentBalance = currentBalanceDummy,
        onButtonClick = () => {}
    },
    renderer = mount
) {
    return renderer(
        <RecentTransactions
            loading={loading}
            pagination={pagination}
            labels={labels}
            transactions={transactions}
            currentBalance={currentBalance}
            onButtonClick={onButtonClick}
        />
    );
}

describe('<RecentTransactions /> Component', () => {
    it(`should contains following elements:
        - <caption /> element;
        - <table /> element;
        - <thead /> element;
        - <tbody /> element;
        - <Button /> component;
        - <DisclosureArrow /> components;
        - <RecentTransactionDetails /> components;`, () => {
        const component = renderComponent({});
        expect(component.find('caption')).toHaveLength(1);
        expect(component.find('.recent-transactions-caption-content')).toHaveLength(0);
        expect(component.find('.recent-transactions-balance-row')).toHaveLength(1);
        expect(component.find('thead')).toHaveLength(1);
        expect(component.find('tbody')).toHaveLength(1);
        expect(component.find('th')).toHaveLength(4);
        expect(component.find('td')).toHaveLength(25);
        expect(component.find(Button)).toHaveLength(1);
        expect(component.find(DisclosureArrow)).toHaveLength(5);
        expect(component.find(RecentTransactionDetails)).toHaveLength(5);

        expect(component.find(Spinner)).toHaveLength(0);

        const extendedComponent = renderComponent({ pagination: true, loading: true });

        expect(extendedComponent.find(Spinner)).toHaveLength(1);
        expect(extendedComponent.find('.recent-transactions-caption-content')).toHaveLength(1);
        expect(extendedComponent.find('.recent-transactions-balance-row')).toHaveLength(0);
        expect(extendedComponent.find(Button)).toHaveLength(0);
        expect(extendedComponent.find(DisclosureArrow)).toHaveLength(7);
        expect(extendedComponent.find(RecentTransactionDetails)).toHaveLength(7);
        expect(extendedComponent.find('th')).toHaveLength(4);
        expect(extendedComponent.find('td')).toHaveLength(35);
    });

    it('should render icon if transaction date is one day later than today', () => {
        const secondsInOneDay = 86400;
        const transactions = [
            { ...transactionsDummy[0], id: '11', date: new Date().getTime() / 1000 + secondsInOneDay }
        ];
        const component = renderComponent({ transactions });
        expect(component.find('.future-transaction-icon')).toHaveLength(1);
    });

    it('should display correct data in table', () => {
        const component = renderComponent({});
        const data = component.find('td');
        let count = 0;

        expect(data.at(count++).text()).toEqual('Apr 14, 2018');
        expect(data.at(count++).text()).toEqual('Bought 23 kWh Alice');
        expect(data.at(count++).text()).toEqual(`${formatCurrency(0.81)} €`);
        expect(data.at(count++).text()).toEqual(''); // Action Expand / Collapse
        expect(data.at(count++).text()).toContain(
            `FromJhon DoeStatussuccessAmount${formatFloat(7.74)} kWhPrice per kWh${formatFloat(
                2.5
            )} ctBlockchain-Transaction9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743`
        );

        expect(data.at(count++).text()).toEqual('Apr 14, 2018');
        expect(data.at(count++).text()).toEqual('Monthly invoice');
        expect(data.at(count++).text()).toEqual(`${formatCurrency(0.081)} €`);
        expect(data.at(count++).text()).toEqual(''); // Action Expand / Collapse
        expect(data.at(count++).text()).toContain(
            `FromJhon DoeStatussuccessAmount${formatFloat(7.74)} kWhPrice per kWh${formatFloat(
                2.5
            )} ctBlockchain-Transaction9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743`
        );

        expect(data.at(count++).text()).toEqual('Apr 14, 2018');
        expect(data.at(count++).text()).toEqual('Bought 23 kWh from Peter');
        expect(data.at(count++).text()).toEqual(`${formatCurrency(0.8)} €`);
        expect(data.at(count++).text()).toEqual(''); // Action Expand / Collapse
        expect(data.at(count++).text()).toContain(
            `FromJhon DoeStatussuccessAmount${formatFloat(7.74)} kWhPrice per kWh${formatFloat(
                2.5
            )} ctBlockchain-Transaction9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743`
        );

        expect(component.find('.recent-transactions-balance-date').text()).toEqual('Apr 14, 2018');
        expect(component.find('.recent-transactions-balance-amount').text()).toEqual(
            `Monthly Balance: ${formatCurrency(currentBalanceDummy.balance)} €`
        );
    });

    it('should call onButtonClick handler', () => {
        const onButtonClick = jest.fn();
        const component = renderComponent({ onButtonClick }, mount);
        component.find(Button).simulate('click');
        expect(onButtonClick).toHaveBeenCalled();
    });

    it('should provide possibility to expand / collapse row', () => {
        const component = renderComponent({}, mount);
        component
            .find(DisclosureArrow)
            .at(3)
            .simulate('click');
        expect(component.state()).toEqual({ expanded: [undefined, undefined, undefined, true] });
        component
            .find(DisclosureArrow)
            .at(3)
            .simulate('click');
        component
            .find(DisclosureArrow)
            .at(2)
            .simulate('click');
        expect(component.state()).toEqual({ expanded: [undefined, undefined, true, false] });
    });

    it('should provide possibility to expand / collapse row only on enter key press', () => {
        const component = renderComponent({}, mount);
        component
            .find(DisclosureArrow)
            .at(3)
            .simulate('keyUp', { key: 'Enter' });
        expect(component.state()).toEqual({ expanded: [undefined, undefined, undefined, true] });
        component
            .find(DisclosureArrow)
            .at(3)
            .simulate('keyUp', { key: 'Enter' });
        component
            .find(DisclosureArrow)
            .at(2)
            .simulate('keyUp', { key: 'Enter' });
        expect(component.state()).toEqual({ expanded: [undefined, undefined, true, false] });

        component
            .find(DisclosureArrow)
            .at(2)
            .simulate('keyUp', { key: 'Tab' });
        expect(component.state()).toEqual({ expanded: [undefined, undefined, true, false] });
    });

    it('should provide possibility to expand / collapse row only on enter key press on row', () => {
        const component = renderComponent({}, mount);
        component
            .find('.recent-transactions-row')
            .at(3)
            .simulate('keyUp', { key: 'Enter' });
        expect(component.state()).toEqual({ expanded: [undefined, undefined, undefined, true] });
    });
});
