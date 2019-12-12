import Axios from 'axios';
import { SESSION_API_URL, PATHS, LIMIT, BLOCKCHAIN_SCANNER_URLS } from '../../constants';
import web3Service, { LEDGERS, META_MASK_NETWORKS } from '../web3';
import { formatCurrency, formatDateTime, formatFloat } from '../formatter';

export function getRecentTransactions(userId, page = 0) {
    const currentBalance = {};

    return Axios.get(`${SESSION_API_URL}/user/${userId}/transactions/getBalance`)
        .then(response => {
            const { balance, lastUpdatedAt } = response.data;
            currentBalance.balance = balance || 0;
            currentBalance.date = lastUpdatedAt || Date.now();

            return Axios.get(`${SESSION_API_URL}/user/${userId}/transactions/getHistory`, {
                params: { limit: LIMIT, offset: page * LIMIT }
            });
        })
        .then(response => {
            response.data.currentBalance = currentBalance;
            const { transactions = [] } = response.data;
            // TODO: for current moment on client side we display 'success' status for all cases but show hash url only for real success tx`s
            transactions.forEach(tx => {
                tx.details = {
                    hash: tx.blockchainStatus === 'success' ? tx.transactionHash : null,
                    status: 'success',
                    price: tx.price || 0,
                    amount: tx.energyAmount || 0,
                    from: tx.producerName || '--',
                    fromUrl: tx.producerID
                        ? `${PATHS.buyEnergy.path}/${PATHS.producer.id}/${tx.producerID}`
                        : '#producer',
                    url: tx.detailsLink || '#details'
                };
            });
            response.data.transactions = transactions;
            return response;
        });
}

export function getOpenTradePositions(userId, ledger) {
    const intermediateData = { producers: [] };
    const result = { data: [] };
    let networkName;

    return Axios.get(`${SESSION_API_URL}/producers/direct`, {
        params: { limit: 1000, offset: 0 }
    })
        .then(response => {
            if (response.data && Array.isArray(response.data.producers)) {
                const { producers } = response.data;
                intermediateData.producers = producers;
                return web3Service.getCurrentBids(ledger);
            }
            return [];
        })
        .then((bids = {}) => {
            const lastTransactionLimit = 1;
            const { data = [] } = bids;

            networkName = Object.keys(LEDGERS).find(key => LEDGERS[key] === ledger);
            const scannerURL = `${BLOCKCHAIN_SCANNER_URLS[networkName]}/address`;

            result.data = data.map(bid => {
                const { producers } = intermediateData;
                const producer = producers.find(({ dlAddress }) => dlAddress === bid.producer);
                const producerAddress = producer ? producer.dlAddress : '';
                const producerId = producer ? producer.id : 0;
                return {
                    producerId,
                    producerAddress,
                    offerAddressUrl: networkName ? `${scannerURL}/${bid.producer}` : '',
                    offerAddress: bid.producer,
                    producerUrl: producer ? `${PATHS.buyEnergy.path}/${PATHS.producer.id}/${producer.id}` : null,
                    producerName: (producer && producer.name) || '',
                    offerIssued: formatDateTime(bid.day),
                    offerIssuedTimestamp: parseInt(bid.day, 10),
                    validOn: '--',
                    energyOffered: '--',
                    energyAvailable: formatFloat(bid.energy / 100000),
                    energyAvailableFloat: parseFloat(bid.energy / 100000),
                    price: formatCurrency(bid.price / 1000),
                    priceFloat: bid.price / 1000
                };
            });
            return Axios.get(`${SESSION_API_URL}/user/${userId}/transactions/getHistory`, {
                params: { limit: lastTransactionLimit }
            });
        })
        .then(response => {
            const { transactions = [] } = response.data;
            const [transactionData] = transactions;
            // todo: find better solution to identify performed transaction
            const transactionBaseUrl = `${BLOCKCHAIN_SCANNER_URLS[networkName]}/tx`;
            result.data = result.data.map(tradePosition => {
                if (
                    tradePosition.producerId === transactionData.producerID &&
                    tradePosition.priceFloat === transactionData.price &&
                    tradePosition.energyAvailableFloat === transactionData.energyAmount
                ) {
                    return {
                        ...tradePosition,
                        txHash: transactionData.transactionHash,
                        txHashUrl: `${transactionBaseUrl}/${transactionData.transactionHash}`
                    };
                }
                return tradePosition;
            });

            return result;
        });
}

export function registerLedgerAddress(ledger, ledgerAddress) {
    return Axios.put(`${SESSION_API_URL}/trading/buyEnergy/registerAddress`, { ledger, ledgerAddress }).then(
        response => {
            const { data = {} } = response;
            const { ledgerStatus } = data;
            return { data: ledgerStatus };
        }
    );
}

export function performExactTransaction(tradePosition, contractAddress, ledger, ledgerAddress) {
    const result = {};
    return web3Service
        .performTransaction(tradePosition, contractAddress, ledger, ledgerAddress)
        .then((transaction = {}) => {
            const { data: transactionData } = transaction;
            const networkName = Object.keys(LEDGERS).find(key => LEDGERS[key] === ledger);
            const scannerURL = `${BLOCKCHAIN_SCANNER_URLS[networkName]}/tx`;

            result.data = {
                txHash: transactionData.txHash,
                txHashUrl: networkName ? `${scannerURL}/${transactionData.txHash}` : ''
            };
            const priceFloat = parseFloat(tradePosition.price.split(',').join('.'));
            return Axios.put(`${SESSION_API_URL}/trading/buyEnergy/transaction`, {
                producerID: tradePosition.producerId,
                ledger,
                hash: transactionData.txHash,
                energy: tradePosition.energyAvailableFloat,
                price: priceFloat,
                dayTimestamp: transactionData.txTimestamp,
                committedAt: tradePosition.offerIssuedTimestamp
            });
        })
        .then(() => {
            return result;
        });
}

export function getLedgerNetworks() {
    const ledgerNetworks = {};
    return Axios.get(`${SESSION_API_URL}/trading/ledgers`)
        .then(response => {
            const { data = {} } = response;
            data.ledgers.forEach(ledger => {
                if (Object.keys(ledgerNetworks).indexOf(ledger.id) === -1) {
                    ledgerNetworks[ledger.id] = {
                        addresses: []
                    };
                }
                ledgerNetworks[ledger.id].addresses.push(ledger.contractAddress);
            });

            return web3Service.getNetworkId();
        })
        .then((network = {}) => {
            const { data: { id: networkId } = {} } = network;
            const networkName = Object.keys(META_MASK_NETWORKS).find(key => META_MASK_NETWORKS[key] === networkId);
            ledgerNetworks.selectedLedgerNetwork = networkName ? LEDGERS[networkName] : '';
            return {
                data: ledgerNetworks
            };
        });
}
