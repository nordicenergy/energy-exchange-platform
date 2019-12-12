import AbstractPageObject from './common/abstract';
import createOverviewPage from './overview';
import createBuyEnergyPage from './buyEnergy';

export class MyProducerPage extends AbstractPageObject {
    async open() {
        await this.page.goto(`${this.options.url}/my_producer`);
        await this.page.waitForSelector('.my-producer-page .producer-information-label');
        return this;
    }

    async clickOnLevelUpInBreadcrumbs() {
        const viewport = await this.page.viewport();
        const breadcrumbsSelector = viewport.isMobile
            ? 'a.back-link'
            : '.breadcrumbs .breadcrumb-item:first-child .icon-breadcrumb';

        await this.page.waitForSelector(breadcrumbsSelector);
        await this.page.click(breadcrumbsSelector);
        await this.page.waitForSelector('.overview-page');
        return createOverviewPage(this.page, this.options);
    }

    async openProducerList() {
        await this.page.waitForSelector('.my-producer-page-controls button:first-child');
        await this.page.click('.my-producer-page-controls button:first-child');
        await this.page.waitForSelector('.buy-energy-page');
        return createBuyEnergyPage(this.page, this.options);
    }
}

async function createMyProducerPage(browserPage, options) {
    return new MyProducerPage(browserPage, options);
}

export default createMyProducerPage;
