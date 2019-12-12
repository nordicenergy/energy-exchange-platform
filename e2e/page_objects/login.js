import createOverviewPage from './overview';

async function createLoginPage(browserPage, options) {
    return {
        async open() {
            await browserPage.goto(`${options.url}/login`);
            await browserPage.waitForSelector('.login-container');
            return this;
        },
        async login(username, password) {
            await browserPage.click('input[name=username]');
            await browserPage.type('input[name=username]', username);
            await browserPage.click('input[name=password]');
            await browserPage.type('input[name=password]', password);
            await browserPage.click('button');
            await browserPage.waitForSelector('.overview-page table td');
            return createOverviewPage(browserPage, options);
        },
        async clickForgotPassword() {
            await browserPage.click('a.reset-password-link');
            await browserPage.waitForSelector('.restore-password-container');
            return {}; // TODO TBD: return forgot password page
        }
    };
}

export default createLoginPage;
