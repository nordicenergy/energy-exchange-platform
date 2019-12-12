import puppeteer from 'puppeteer';
import config from '../config';
const { host, headless, timeout, desktopOptions, mobileOptions, tabletOptions, tvOptions } = config;

import createLoginPage from './login';
import createOverviewPage from './overview';
import createShowTransactionsPage from './showTransactions';
import createBuyEnergyPage from './buyEnergy';
import createSellEnergyPage from './sellEnergy';
import createProfilePage from './profile';
import createMyProducerPage from './myProducer';
import createProducerPage from './producer';
import createDirectTradingPage from './directTrading';
import createTradingPage from './trading';

async function factory() {
    try {
        const { VIEWPORT } = process.env;
        const deviceOptions =
            VIEWPORT === 'mobile'
                ? mobileOptions
                : VIEWPORT === 'tablet' ? tabletOptions : VIEWPORT === 'tv' ? tvOptions : desktopOptions;

        const browserOptions = Object.assign({ headless }, deviceOptions);
        const browser = await initBrowser(browserOptions);

        const pageInstance = await browser.newPage();
        await pageInstance.setViewport(deviceOptions);
        await pageInstance.setDefaultNavigationTimeout(timeout);
        const pageOptions = { url: host };

        return {
            createLoginPage: createLoginPage.bind(null, pageInstance, pageOptions),
            createOverviewPage: createOverviewPage.bind(null, pageInstance, pageOptions),
            createShowTransactionsPage: createShowTransactionsPage.bind(null, pageInstance, pageOptions),
            createSellEnergyPage: createSellEnergyPage.bind(null, pageInstance, pageOptions),
            createBuyEnergyPage: createBuyEnergyPage.bind(null, pageInstance, pageOptions),
            createProfilePage: createProfilePage.bind(null, pageInstance, pageOptions),
            createMyProducerPage: createMyProducerPage.bind(null, pageInstance, pageOptions),
            createProducerPage: createProducerPage.bind(null, pageInstance, pageOptions),
            createDirectTradingPage: createDirectTradingPage.bind(null, pageInstance, pageOptions),
            createTradingPage: createTradingPage.bind(null, pageInstance, pageOptions),
            destruct: () => browser.close()
        };
    } catch (e) {
        console.error(e);
    }
}

async function initBrowser({ height, width, headless }) {
    return await puppeteer.launch({
        headless,
        slowMo: 80,
        timeout,
        args: [`--window-size=${width},${height}`]
    });
}

export default factory;
