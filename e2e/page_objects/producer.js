import AbstractPageObject from './common/abstract';
import createBuyEnergyPage from './buyEnergy';

export class ProducerPage extends AbstractPageObject {
    async open(id) {
        await this.page.goto(`${this.options.url}/buy_energy/producer/${id}`);
        await this.page.waitForSelector('.producer-page .producer-information-label');
        return this;
    }

    async clickOnLevelUpInBreadcrumbs() {
        const viewport = await this.page.viewport();
        const breadcrumbsSelector = viewport.isMobile
            ? 'a.back-link'
            : '.breadcrumbs .breadcrumb-item:nth-child(0n+2) a';

        await this.page.waitForSelector(breadcrumbsSelector);
        await this.page.click(breadcrumbsSelector);
        await this.page.waitForSelector('.buy-energy-page');
        return createBuyEnergyPage(this.page, this.options);
    }

    async openProducerList() {
        await this.page.waitForSelector('.producer-page-controls button:first-child');
        await this.page.click('.producer-page-controls button:first-child');
        await this.page.waitForSelector('.buy-energy-page');
        return createBuyEnergyPage(this.page, this.options);
    }
}

async function createProducerPage(browserPage, options) {
    return new ProducerPage(browserPage, options);
}

export default createProducerPage;
