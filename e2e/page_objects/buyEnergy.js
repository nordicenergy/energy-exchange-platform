import AbstractPageObject from './common/abstract';
import createProducerPage from './producer';
import createOverviewPage from './overview';

export class BuyEnergyPage extends AbstractPageObject {
    async open() {
        await this.page.goto(`${this.options.url}/buy_energy`);
        await this.page.waitForSelector('.buy-energy-page');
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
        return createOverviewPage(this.page, this.options);
    }

    async openFirstProducer() {
        await this.page.waitForSelector('.producer-cards-list .producer-cards-list-item');
        await this.page.click('.producer-cards-list .producer-cards-list-item:first-child');
        await this.page.waitForSelector('.producer-page');
        return createProducerPage(this.page, this.options);
    }
}

async function createBuyEnergyPage(browserPage, options) {
    return new BuyEnergyPage(browserPage, options);
}

export default createBuyEnergyPage;
