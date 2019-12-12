import AbstractPageObject from './common/abstract';

export class ProfilePage extends AbstractPageObject {
    async open() {
        await this.page.goto(`${this.options.url}/profile`);
        await this.page.waitForSelector('.profile-page input[name=firstName]');
        return this;
    }

    async tryToSaveEmptyRequiredField() {
        await this.page.waitForFunction(
            '!!document.querySelector(".profile-form-container input[name=firstName]").value'
        );
        await this.page.focus('.profile-form-container input[name=firstName]');
        await this.page.keyboard.down('Shift');
        await this.page.keyboard.press('Home');
        await this.page.keyboard.up('Shift');
        await this.page.keyboard.press('Backspace');
        await this.page.click('.profile-form-container .button-container button');
        await this.page.waitForSelector('.profile-form-container .text-field-error');
        return this;
    }

    async tryToSave() {
        await this.page.waitForFunction(
            '!!document.querySelector(".profile-form-container input[name=firstName]").value'
        );
        await this.page.click('.profile-form-container .button-container button');
        await this.page.waitForSelector('.toast');
        return this;
    }
}

async function createProfilePage(browserPage, options) {
    return new ProfilePage(browserPage, options);
}

export default createProfilePage;
