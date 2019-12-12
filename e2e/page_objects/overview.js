import AbstractPageObject from './common/abstract';
import { cardNavigationMixin } from './common/mixins';

import createShowTransactionsPage from './showTransactions';

const BasePage = cardNavigationMixin(AbstractPageObject);

export class OverviewPage extends BasePage {
    async open() {
        await this.page.goto(`${this.options.url}/`);
        await this.page.waitForSelector('.overview-page table td');
        return this;
    }

    async clickMoreOnRecentTransactions() {
        await this.page.click('.overview-content-container button');
        await this.page.waitForSelector('.show-transaction-page table td');
        return createShowTransactionsPage(this.page, this.options);
    }
}

async function createOverviewPage(browserPage, options) {
    return new OverviewPage(browserPage, options);
}

export default createOverviewPage;
