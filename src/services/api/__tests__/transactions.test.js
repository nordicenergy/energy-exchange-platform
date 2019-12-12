import Axios from 'axios';
import {
    getRecentTransactions,
    getOpenTradePositions,
    registerLedgerAddress,
    getLedgerNetworks,
    performExactTransaction
} from '../transactions';
import web3Service, { LEDGERS } from '../../web3';
import { BLOCKCHAIN_SCANNER_URLS } from '../../../constants';
import { formatFloat, formatDateTime } from '../../../services/formatter';

describe('Transactions API Service', () => {
    beforeEach(() => {
        Axios.get = jest.fn();
        Axios.put = jest.fn();
        web3Service.getCurrentBids = jest.fn();
        web3Service.getNetworkId = jest.fn();
        web3Service.performTransaction = jest.fn();
    });
    it('should provide method for getting recent transactions', async () => {
        Axios.get
            .mockReturnValueOnce(Promise.resolve({ data: { balance: 20, lastUpdatedAt: 12345678 } }))
            .mockReturnValue(
                Promise.resolve({
                    data: {
                        transactions: [
                            {
                                date: 1524873600,
                                blockchainStatus: 'success',
                                description:
                                    'Bought 7.13 kWh from "Bio natural gas plant in the former Schultheiss Brewery"',
                                detailsLink:
                                    'https://ropsten.etherscan.io/tx/0x4c6c11de80fa544341fc97fd4fb6755adbe6006a424f5a1029b632b7ce81ed25',
                                energyAmount: 7.13,
                                from: '0x4f80f1254B8783dDd8f81d996605fe85780BfcB4',
                                id: 99,
                                price: 2.7,
                                producerID: 9,
                                producerName: 'Bio-Erdgas-Anlage in der ehemaligen Schultheiss-Brauerei',
                                transactionAmount: 0.19,
                                transactionHash: '0x4c6c11de80fa544341fc97fd4fb6755adbe6006a424f5a1029b632b7ce81ed25'
                            }
                        ]
                    }
                })
            );

        const response = await getRecentTransactions('testId', 1);
        const [[balanceUrl], [historyUrl, historyParams]] = Axios.get.mock.calls;

        expect(balanceUrl).toEqual('/api/user/testId/transactions/getBalance');
        expect(historyUrl).toEqual('/api/user/testId/transactions/getHistory');
        expect(historyParams).toEqual({ params: { limit: 15, offset: 15 } });
        expect(response.data).toEqual({
            currentBalance: { balance: 20, date: 12345678 },
            transactions: [
                {
                    date: 1524873600,
                    description: 'Bought 7.13 kWh from "Bio-Erdgas-Anlage in der ehemaligen Schultheiss-Brauerei"',
                    details: {
                        amount: 7.13,
                        from: 'Bio-Erdgas-Anlage in der ehemaligen Schultheiss-Brauerei',
                        fromUrl: '/buy_energy/producer/9',
                        hash: '0x4c6c11de80fa544341fc97fd4fb6755adbe6006a424f5a1029b632b7ce81ed25',
                        price: 2.7,
                        status: 'success',
                        url:
                            'https://ropsten.etherscan.io/tx/0x4c6c11de80fa544341fc97fd4fb6755adbe6006a424f5a1029b632b7ce81ed25'
                    },
                    detailsLink:
                        'https://ropsten.etherscan.io/tx/0x4c6c11de80fa544341fc97fd4fb6755adbe6006a424f5a1029b632b7ce81ed25',
                    energyAmount: 7.13,
                    producerName: 'Bio-Erdgas-Anlage in der ehemaligen Schultheiss-Brauerei',
                    from: '0x0101f8cdf2c5ed1d775120a99a701bab5418add8',
                    id: 99,
                    price: 2.7,
                    producerID: 9,
                    blockchainStatus: 'success',
                    transactionAmount: 0.19,
                    transactionHash: '0x4c6c11de80fa544341fc97fd4fb6755adbe6006a424f5a1029b632b7ce81ed25'
                }
            ]
        });
    });

    it('should provide method for getting recent transactions (with failure statuses)', async () => {
        Axios.get
            .mockReturnValueOnce(Promise.resolve({ data: { balance: 20, lastUpdatedAt: 12345678 } }))
            .mockReturnValue(
                Promise.resolve({
                    data: {
                        transactions: [
                            {
                                date: 1524873600,
                                blockchainStatus: 'failure',
                                description:
                                    'Bought 7.13 kWh from "Bio-Erdgas-Anlage in der ehemaligen Schultheiss-Brauerei"',
                                detailsLink: null,
                                energyAmount: 7.13,
                                from: '0x0101f8cdf2c5ed1d775120a99a701bab5418add8',
                                id: 99,
                                price: 2.7,
                                producerID: 9,
                                producerName: 'Bio-Erdgas-Anlage in der ehemaligen Schultheiss-Brauerei',
                                transactionAmount: 0.19,
                                transactionHash: '0x4c6c11de80fa544341fc97fd4fb6755adbe6006a424f5a1029b632b7ce81ed25'
                            }
                        ]
                    }
                })
            );

        const response = await getRecentTransactions('testId', 1);
        const [[balanceUrl], [historyUrl, historyParams]] = Axios.get.mock.calls;

        expect(balanceUrl).toEqual('/api/user/testId/transactions/getBalance');
        expect(historyUrl).toEqual('/api/user/testId/transactions/getHistory');
        expect(historyParams).toEqual({ params: { limit: 15, offset: 15 } });
        expect(response.data).toEqual({
            currentBalance: { balance: 20, date: 12345678 },
            transactions: [
                {
                    date: 1524873600,
                    description: 'Bought 7.13 kWh from "Bio-Erdgas-Anlage in der ehemaligen Schultheiss-Brauerei"',
                    details: {
                        amount: 7.13,
                        from: 'Bio-Erdgas-Anlage in der ehemaligen Schultheiss-Brauerei',
                        fromUrl: '/buy_energy/producer/9',
                        hash: null,
                        price: 2.7,
                        status: 'success',
                        url: '#details'
                    },
                    detailsLink: null,
                    energyAmount: 7.13,
                    producerName: 'Bio-Erdgas-Anlage in der ehemaligen Schultheiss-Brauerei',
                    from: '0x0101f8cdf2c5ed1d775120a99a701bab5418add8',
                    id: 99,
                    price: 2.7,
                    producerID: 9,
                    blockchainStatus: 'failure',
                    transactionAmount: 0.19,
                    transactionHash: '0x4c6c11de80fa544341fc97fd4fb6755adbe6006a424f5a1029b632b7ce81ed25'
                }
            ]
        });
    });

    it('should provide method for getting trade positions', async () => {
        const bidsDummy = {
            data: [
                { producer: '0x1', day: 1526398769827, energy: 200000, price: 250 },
                { producer: '0x2', day: 1526398769800, energy: 300000, price: 350 }
            ]
        };
        const producersDummy = { data: { producers: [{ id: 123, dlAddress: '0x1', name: 'test name' }] } };
        const transactionDummy = {
            date: 1524873600,
            blockchainStatus: 'success',
            description: 'Bought 7.13 kWh from "Bio-Erdgas-Anlage in der ehemaligen Schultheiss-Brauerei"',
            detailsLink:
                'https://ropsten.etherscan.io/tx/0x4c6c11de80fa544341fc97fd4fb6755adbe6006a424f5a1029b632b7ce81ed25',
            energyAmount: 7.13,
            from: '0x0101f8cdf2c5ed1d775120a99a701bab5418add8',
            id: 99,
            price: 2.7,
            producerID: 9,
            producerName: 'Bio-Erdgas-Anlage in der ehemaligen Schultheiss-Brauerei',
            transactionAmount: 0.19,
            transactionHash: '0x4c6c11de80fa544341fc97fd4fb6755adbe6006a424f5a1029b632b7ce81ed25'
        };
        const transactionHistoryDummy = {
            data: {
                transactions: [transactionDummy]
            }
        };
        const transactionHistoryProducerMatchedDummy = {
            data: {
                transactions: [{ ...transactionDummy, producerID: 123, price: 0.25, energyAmount: 2 }]
            }
        };
        const expectedTestData = [
            {
                producerId: 123,
                producerAddress: '0x1',
                energyAvailable: '2',
                energyAvailableFloat: 2.0,
                energyOffered: '--',
                offerAddress: '0x1',
                offerIssued: formatDateTime(1526398769827),
                offerIssuedTimestamp: 1526398769827,
                price: `${formatFloat(0.25)}`,
                priceFloat: 0.25,
                producerName: 'test name',
                producerUrl: '/buy_energy/producer/123',
                validOn: '--'
            },
            {
                producerId: 0,
                producerAddress: '',
                energyAvailable: '3',
                energyAvailableFloat: 3.0,
                energyOffered: '--',
                offerAddress: '0x2',
                offerIssued: formatDateTime(1526398769800),
                offerIssuedTimestamp: 1526398769800,
                price: `${formatFloat(0.35)}`,
                priceFloat: 0.35,
                producerName: '',
                producerUrl: null,
                validOn: '--'
            }
        ];

        Axios.get
            .mockReturnValueOnce(Promise.resolve(producersDummy))
            .mockReturnValueOnce(Promise.resolve(transactionHistoryDummy))
            .mockReturnValueOnce(Promise.resolve({ data: { producers: undefined } }))
            .mockReturnValueOnce(Promise.resolve(transactionHistoryDummy))
            .mockReturnValueOnce(Promise.resolve({ data: { producers: [] } }))
            .mockReturnValueOnce(Promise.resolve(transactionHistoryDummy))
            .mockReturnValueOnce(Promise.resolve(producersDummy))
            .mockReturnValueOnce(Promise.resolve(transactionHistoryDummy))
            .mockReturnValueOnce(Promise.resolve(producersDummy))
            .mockReturnValueOnce(Promise.resolve(transactionHistoryProducerMatchedDummy));

        web3Service.getCurrentBids
            .mockReturnValueOnce(Promise.resolve(bidsDummy))
            .mockReturnValueOnce(Promise.resolve(undefined))
            .mockReturnValueOnce(Promise.resolve(bidsDummy))
            .mockReturnValueOnce(Promise.resolve(bidsDummy));

        await expect(getOpenTradePositions(1, LEDGERS.ropsten)).resolves.toEqual({
            data: expectedTestData.map(testData => ({
                ...testData,
                offerAddressUrl: `${BLOCKCHAIN_SCANNER_URLS.ropsten}/address/${testData.offerAddress}`
            }))
        });
        await expect(getOpenTradePositions(1, LEDGERS.ropsten)).resolves.toEqual({ data: [] });
        await expect(getOpenTradePositions(1, LEDGERS.ropsten)).resolves.toEqual({ data: [] });

        await expect(getOpenTradePositions(1, LEDGERS.main)).resolves.toEqual({
            data: expectedTestData.map(testData => ({
                ...testData,
                offerAddressUrl: `${BLOCKCHAIN_SCANNER_URLS.main}/address/${testData.offerAddress}`
            }))
        });

        await expect(getOpenTradePositions(1, LEDGERS.ropsten)).resolves.toEqual({
            data: [
                {
                    ...expectedTestData[0],
                    offerAddressUrl: `${BLOCKCHAIN_SCANNER_URLS.ropsten}/address/${expectedTestData[0].offerAddress}`,
                    txHash: '0x4c6c11de80fa544341fc97fd4fb6755adbe6006a424f5a1029b632b7ce81ed25',
                    txHashUrl: `${
                        BLOCKCHAIN_SCANNER_URLS.ropsten
                    }/tx/0x4c6c11de80fa544341fc97fd4fb6755adbe6006a424f5a1029b632b7ce81ed25`
                },
                {
                    ...expectedTestData[1],
                    offerAddressUrl: `${BLOCKCHAIN_SCANNER_URLS.ropsten}/address/${expectedTestData[1].offerAddress}`
                }
            ]
        });
    });

    it('should provide method for registering ledger address', async () => {
        const responseDummy = {
            data: {
                message: 'Address successfully registered',
                hash: '0x372cb3dba883f57aa4c8889ee5e58c910d6188a967e9215dedec33c4b40be410',
                ledgerStatus: 'success'
            }
        };
        Axios.put.mockReturnValueOnce(Promise.resolve(responseDummy));
        await expect(registerLedgerAddress('ledgerAddressTest', 'ethereumRopsten')).resolves.toEqual({
            data: responseDummy.data.ledgerStatus
        });
    });

    it('should provide method for performing transaction', async () => {
        const tradePositionDummy = {
            producerId: 123,
            producerAddress: '0x1',
            energyAvailable: '2',
            energyAvailableFloat: 2.0,
            energyOffered: '--',
            offerAddress: '0x1',
            offerIssued: formatDateTime(1526398769827),
            offerIssuedTimestamp: 1526398769827,
            price: '0.25',
            priceFloat: 0.25,
            producerName: 'test name',
            producerUrl: '/buy_energy/producer/123',
            validOn: '--'
        };
        const ledgerAddressDummy = 'ledgerAddressTest';
        const transactionHashDummy = 'txHashTest';

        web3Service.performTransaction.mockReturnValue(
            Promise.resolve({ data: { txHash: transactionHashDummy, txTimestamp: 1526398769227 } })
        );
        Axios.put.mockReturnValueOnce(Promise.resolve({})).mockReturnValueOnce(Promise.resolve({}));
        await expect(
            performExactTransaction(tradePositionDummy, 'contractAddressTest', LEDGERS.ropsten, ledgerAddressDummy)
        ).resolves.toEqual({
            data: {
                txHash: transactionHashDummy,
                txHashUrl: `${BLOCKCHAIN_SCANNER_URLS.ropsten}/tx/${transactionHashDummy}`
            }
        });
        const [[, options]] = Axios.put.mock.calls;
        expect(options).toEqual({
            producerID: 123,
            ledger: LEDGERS.ropsten,
            hash: transactionHashDummy,
            energy: tradePositionDummy.energyAvailableFloat,
            price: tradePositionDummy.priceFloat,
            dayTimestamp: 1526398769227,
            committedAt: tradePositionDummy.offerIssuedTimestamp
        });
        await expect(
            performExactTransaction(tradePositionDummy, 'contractAddressTest', LEDGERS.main, ledgerAddressDummy)
        ).resolves.toEqual({
            data: {
                txHash: 'txHashTest',
                txHashUrl: `${BLOCKCHAIN_SCANNER_URLS.main}/tx/${transactionHashDummy}`
            }
        });
    });

    it('should provide method for getting ledger networks', async () => {
        Axios.get
            .mockReturnValueOnce(
                Promise.resolve({
                    data: {
                        ledgers: [
                            {
                                id: 'ethereumMain',
                                contractAddress: '0xaff8701cab'
                            }
                        ]
                    }
                })
            )
            .mockReturnValueOnce(
                Promise.resolve({
                    data: {
                        ledgers: [
                            {
                                id: 'ethereumMain',
                                contractAddress: '0xaff8701cab'
                            },
                            {
                                id: 'ethereumMain',
                                contractAddress: '0xaff8701cac'
                            }
                        ]
                    }
                })
            );

        web3Service.getNetworkId
            .mockReturnValueOnce(
                Promise.resolve({
                    data: { id: 1 }
                })
            )
            .mockReturnValueOnce(
                Promise.resolve({
                    data: { id: 3 }
                })
            );

        await expect(getLedgerNetworks()).resolves.toEqual({
            data: {
                selectedLedgerNetwork: 'ethereumMain',
                ethereumMain: {
                    addresses: ['0xaff8701cab']
                }
            }
        });
        await expect(getLedgerNetworks()).resolves.toEqual({
            data: {
                selectedLedgerNetwork: 'ethereumRopsten',
                ethereumMain: {
                    addresses: ['0xaff8701cab', '0xaff8701cac']
                }
            }
        });
    });
});
