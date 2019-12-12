import config from '../config';
import factory from '../page_objects';

const { timeout, credentials } = config;
let pageFactory;

describe('Walk through direct trading page', () => {
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
        'User can open show transaction page after success login',
        async () => {
            const directTradingPage = await pageFactory.createDirectTradingPage();
            await directTradingPage.open();
        },
        timeout
    );
});
