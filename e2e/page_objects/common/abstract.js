import createLoginPage from '../login';

class AbstractPageObject {
    constructor(browserPage, options) {
        this.page = browserPage;
        this.options = options;
    }
    async logout() {
        await this.page.click("button[aria-label='Logout']");
        await this.page.waitForSelector('.confirm-dialog-actions');
        await this.page.click('.confirm-dialog-actions button:first-child');
        await this.page.waitForSelector('.login-container');
        return createLoginPage(this.page, this.options);
    }
}

export default AbstractPageObject;
