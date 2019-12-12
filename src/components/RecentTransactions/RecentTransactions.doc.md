RecentTransactions example (without pagination):

```
const transactions = [
    {
        id: '1',
        date: 1523707200,
        description: 'Bought 23 kWh Alice',
        transactionAmount: 0.81,
        details: {
            status: "Success",
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
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
            status: "Success",
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
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
            status: "Success",
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
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
            status: "Success",
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
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
            status: "Success",
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
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
            status: "Success",
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
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
            status: "Success",
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
            price: 2.5,
            amount: 7.74,
            from: 'Jhon Doe',
            url: 'https://ropsten.etherscan.io/tx/0x25a23d106b2c4299a98e553d96570941556e53fe8808476ee0fceb5d72859540'
        }
    }
];

const currentBalanceData = {
    balance: 10,
    date: 1523707200
};

const labels = {
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
}

const wrapperStyles = {
    backgroundColor: '#e6e6e6',
    padding: '20px'
};
<div style={wrapperStyles}>
    <RecentTransactions transactions={transactions} currentBalance={currentBalanceData} labels={labels} onButtonClick={f => f} />
</div> 
```

RecentTransactions example (extended, with pagination):
```
const transactions = [
    {
        id: '1',
        date: 1523707200,
        description: 'Bought 23 kWh Alice',
        transactionAmount: 0.81,
        details: {
            status: "Success",
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
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
            status: "Success",
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
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
            status: "Success",
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
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
            status: "Success",
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
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
            status: "Success",
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
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
            status: "Success",
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
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
            status: "Success",
            hash: '9d98edfe27bb7f489fb1ced93d2b6e4093e5e40e5103356a602fecfc8d154743',
            price: 2.5,
            amount: 7.74,
            from: 'Jhon Doe',
            url: 'https://ropsten.etherscan.io/tx/0x25a23d106b2c4299a98e553d96570941556e53fe8808476ee0fceb5d72859540'
        }
    }
];

const currentBalanceData = {
    balance: 10,
    date: 1523707200
};

const labels = {
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
}

const wrapperStyles = {
    backgroundColor: '#e6e6e6',
    padding: '20px'
};
<div style={wrapperStyles}>
    <RecentTransactions pagination loading transactions={transactions} currentBalance={currentBalanceData} labels={labels} onButtonClick={f => f} />
</div> 
```
