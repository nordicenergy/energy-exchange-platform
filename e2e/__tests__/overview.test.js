import config from '../config';
import factory from '../page_objects';

const { timeout, credentials } = config;
let pageFactory;

describe('Walk through overview page', () => {
    beforeAll(async () => {
        pageFactory = await factory();
        const loginPage = await pageFactory.createLoginPage();
        await loginPage.open();
        await loginPage.login(credentials.username, credentials.password);
    }, timeout);

    afterAll(() => {
        pageFactory.destruct();
    });

    test(
        'User can open overview page after success login',
        async () => {
            const overviewPage = await pageFactory.createOverviewPage();
            await overviewPage.open();
        },
        timeout
    );

    test(
        'User can open "Show Transactions" page for more details about recent transactions',
        async () => {
            const overviewPage = await pageFactory.createOverviewPage();
            await overviewPage.open();
            await overviewPage.clickMoreOnRecentTransactions();
        },
        timeout
    );

    test(
        'User can check information about his energy producer',
        async () => {
            const overviewPage = await pageFactory.createOverviewPage();
            await overviewPage.open();
            await overviewPage.clickMyProducer();
        },
        timeout
    );

    test(
        'User can buy energy',
        async () => {
            const overviewPage = await pageFactory.createOverviewPage();
            await overviewPage.open();
            await overviewPage.clickBuyEnergy();
        },
        timeout
    );

    test(
        'User can sell energy',
        async () => {
            const overviewPage = await pageFactory.createOverviewPage();
            await overviewPage.open();
            await overviewPage.clickSellEnergy();
        },
        timeout
    );
});
