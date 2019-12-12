import AbstractPageObject from './common/abstract';

export class ShowTransactionsPage extends AbstractPageObject {
    async open() {
        await this.page.goto(`${this.options.url}/show_transactions`);
        await this.page.waitForSelector('.show-transaction-page table td');
        return this;
    }

    async clickOnLevelUpInBreadcrumbs() {
        const viewport = await this.page.viewport();
        const breadcrumbsSelector = viewport.isMobile
            ? 'a.back-link'
            : '.breadcrumbs .breadcrumb-item:first-child a.icon-breadcrumb';

        await this.page.waitForSelector(breadcrumbsSelector);
        await this.page.click(breadcrumbsSelector);
        await this.page.waitForSelector('.overview-page');
        return this;
    }
}

async function createShowTransactionsPage(browserPage, options) {
    return new ShowTransactionsPage(browserPage, options);
}

export default createShowTransactionsPage;
