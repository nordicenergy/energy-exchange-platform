import AbstractPageObject from './common/abstract';

export class DirectTradingPage extends AbstractPageObject {
    async open() {
        await this.page.goto(`${this.options.url}/direct_trading`);
        await this.page.waitForSelector('.direct-trading-page');
        return this;
    }
}

async function createDirectTradingPage(browserPage, options) {
    return new DirectTradingPage(browserPage, options);
}

export default createDirectTradingPage;
