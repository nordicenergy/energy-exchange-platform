import config from '../config';
import factory from '../page_objects';

const { timeout, credentials } = config;
let pageFactory;

describe('Walk through profile page', () => {
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
        'User can open profile page after success login',
        async () => {
            const profilePage = await pageFactory.createProfilePage();
            await profilePage.open();
        },
        timeout
    );

    test(
        'User can save profile data and see notification',
        async () => {
            const profilePage = await pageFactory.createProfilePage();
            await profilePage.open();
            await profilePage.tryToSave();
        },
        timeout
    );
});
