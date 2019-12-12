import config from '../config';
import factory from '../page_objects';

const { timeout, credentials } = config;
let pageFactory;

describe('Walk through show my producer page', () => {
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
        'User can open show my producer page after success login',
        async () => {
            const myProducerPage = await pageFactory.createMyProducerPage();
            await myProducerPage.open();
        },
        timeout
    );

    test(
        'User can back to overview page through breadcrumbs',
        async () => {
            const myProducerPage = await pageFactory.createMyProducerPage();
            await myProducerPage.open();
            await myProducerPage.clickOnLevelUpInBreadcrumbs();
        },
        timeout
    );

    test.skip(
        'User can open producer list',
        async () => {
            const myProducerPage = await pageFactory.createMyProducerPage();
            await myProducerPage.open();
            await myProducerPage.openProducerList();
        },
        timeout
    );
});
