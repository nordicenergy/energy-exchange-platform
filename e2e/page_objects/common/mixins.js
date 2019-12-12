import createSellEnergyPage from '../sellEnergy';
import createMyProducerPage from '../myProducer';
import createBuyEnergyPage from '../buyEnergy';

const cardNavigationMixin = Base =>
    class extends Base {
        constructor(browserPage, options) {
            super(browserPage, options);
        }

        async clickMyProducer() {
            await this.page.click('.navigation-cards .nav-card-container:first-child');
            await this.page.waitForSelector('.my-producer-page');
            return createMyProducerPage(this.page, this.options);
        }

        async clickBuyEnergy() {
            await this.page.click('.navigation-cards .nav-card-container:nth-child(0n+2)');
            await this.page.waitForSelector('.buy-energy-page .producer-card-price');
            return createBuyEnergyPage(this.page, this.options);
        }

        async clickSellEnergy() {
            await this.page.click('.navigation-cards .nav-card-container:last-child');
            await this.page.waitForSelector('.sell-energy-page');
            return createSellEnergyPage(this.page, this.options);
        }
    };

export { cardNavigationMixin };
