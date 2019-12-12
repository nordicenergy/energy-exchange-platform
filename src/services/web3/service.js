// TODO temporary web3 was excluded to reduce size of js bundle, after enabling direct trading we can add web3 again
/** import Web3 from 'web3'; **/
import moment from 'moment';
import { BUY_ENERGY_METHOD, GAS_PRICE, GAS, LEDGERS, TIMEOUT, NETWORK_ERROR, TIMEOUT_ERROR } from './constants';

import ropstenContract from './contracts/ropsten';
import liveContract from './contracts/live';

class Web3Service {
    constructor() {
        this.isMetaMaskPluginInstalled = false;

        // MetaMask automatically create web3 namespace with their provider if it was installed
        // https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#partly_sunny-web3---ethereum-browser-environment-check

        // eslint-disable-next-line
        if (typeof web3 !== 'undefined') {
            // eslint-disable-next-line
            this.web3 = this.isMetaMaskPluginInstalled = true; // TODO new Web3(web3.currentProvider);
        } else {
            // TODO TBD: implement logic for custom provider
            // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }
    }

    buyEnergy(contract, ledgerAddress, producerAddress, transactionDate, price, energy, gasPrice) {
        return new Promise(async (resolve, reject) => {
            try {
                const costSender = contract.methods[BUY_ENERGY_METHOD](producerAddress, transactionDate, price, energy);

                const result = await costSender.send({
                    from: ledgerAddress,
                    gas: GAS,
                    gasPrice: gasPrice || GAS_PRICE
                });
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    hasMetaMaskProvider() {
        return this.isMetaMaskPluginInstalled;
    }

    getUserAddresses() {
        return new Promise(async (resolve, reject) => {
            const handler = setTimeout(() => reject(TIMEOUT_ERROR), TIMEOUT);
            try {
                const addresses = await this.web3.eth.getAccounts();

                clearTimeout(handler);
                resolve(wrapResult({ addresses }));
            } catch (error) {
                clearTimeout(handler);
                reject(wrapError(error));
            }
        });
    }

    getCurrentBids(ledger, contract) {
        return new Promise(async (resolve, reject) => {
            const handler = setTimeout(() => reject(TIMEOUT_ERROR), TIMEOUT);

            try {
                const { data } = contract ? { data: contract } : await this.getContract(ledger);
                const events =
                    data && data.getPastEvents
                        ? await data.getPastEvents('BidMade', {
                            fromBlock: 0,
                            toBlock: 'pending'
                        })
                        : [];
                clearTimeout(handler);
                resolve(wrapResult(events.map(({ returnValues = {} }) => ({ ...returnValues }))));
            } catch (error) {
                clearTimeout(handler);
                reject(wrapError(error));
            }
        });
    }

    getContract(ledger, address, abi) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!address) {
                    // TODO temporary fallback on blockchain side
                    switch (ledger) {
                        case LEDGERS.main:
                            address = liveContract.address;
                            abi = liveContract.abi;
                            break;

                        case LEDGERS.ropsten:
                            address = ropstenContract.address;
                            abi = ropstenContract.abi;
                            break;
                        default:
                            return reject(NETWORK_ERROR);
                    }
                }

                if (!this.web3.utils.isAddress(address)) {
                    return reject(wrapError(new Error(`Invalid address: ${address}`)));
                }

                const contract = new this.web3.eth.Contract(abi, address);

                resolve(wrapResult(contract));
            } catch (error) {
                reject(error);
            }
        });
    }

    getNetworkId() {
        return new Promise(async (resolve, reject) => {
            const handler = setTimeout(() => reject(TIMEOUT_ERROR), TIMEOUT);

            try {
                const id = await this.web3.eth.net.getId();
                clearTimeout(handler);
                resolve({
                    data: { id }
                });
            } catch (error) {
                clearTimeout(handler);
                reject(wrapError(error));
            }
        });
    }

    performTransaction(tradePosition, contractAddress, ledger, ledgerAddress) {
        const { energyAvailableFloat, price, producerAddress } = tradePosition;
        const energyPriceUnitsMultiplier = 1000;
        const energyUnitsMultiplier = 1000000;
        const todayDate = moment.utc().startOf('day');
        const tomorrowDate = todayDate.add(1, 'days').unix();
        const formattedPrice = parseFloat(price.split(',').join('.')) * energyPriceUnitsMultiplier;
        const formattedEnergy = energyAvailableFloat * energyUnitsMultiplier;

        return new Promise(async (resolve, reject) => {
            try {
                let abi;

                switch (ledger) {
                    case LEDGERS.ropsten:
                        abi = ropstenContract.abi;
                        break;
                    case LEDGERS.main:
                        abi = liveContract.abi;
                        break;
                    default:
                        return reject(NETWORK_ERROR);
                }

                const { data: contract } = await this.getContract(ledger, contractAddress, abi);
                const transactionResponse = await this.buyEnergy(
                    contract,
                    ledgerAddress,
                    producerAddress,
                    tomorrowDate,
                    formattedPrice,
                    formattedEnergy
                );
                resolve(
                    wrapResult({
                        txHash: transactionResponse.transactionHash,
                        txTimestamp: tomorrowDate
                    })
                );
            } catch (error) {
                reject(wrapError(error));
            }
        });
    }
}

function wrapError(error) {
    return { response: { data: error } };
}

function wrapResult(data) {
    return { data };
}

const web3Service = new Web3Service();

export default web3Service;
