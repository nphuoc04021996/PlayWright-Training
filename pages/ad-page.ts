import {Page, Locator} from '@playwright/test';

export class AdPage{
    private readonly page: Page;
    private readonly closeAdButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.closeAdButton = this.page.getByRole('button', { name: 'Close' });
    }

    async closeAdIfPresent(){
        await this.page.evaluate(() => {
        const popup = document.querySelector('[id^="pum-"]');
        if (popup) popup.remove();
    });
    }
}
