import {Page, Locator} from '@playwright/test';
import { format } from 'util';

export abstract class BasePage {
    readonly page: Page;
    readonly loginAndSignupLink: Locator;
    readonly accountLink: Locator;
    readonly cartLink: Locator;
    readonly searchBox: Locator;
    readonly searchButton: Locator;
    readonly categorySelect: Locator;
    readonly wishlistLink: Locator;
    readonly homeTab: Locator;
    readonly allDepartementsSelect: Locator;
    readonly departementsOption: string;

    constructor(page: Page) {
        this.page = page;
        this.loginAndSignupLink = page.getByRole('link', { name: 'Log in / Sign up' });
        this.accountLink = page.getByRole('link');
        this.cartLink = page.getByRole('link', { name: /\d+\s?\$\d{1,3}(,\d{3})*(\.\d{2})?/ });
        this.searchBox = page.getByRole('textbox', { name: 'Search input' });
        this.searchButton = page.getByRole('button');
        this.categorySelect = page.locator('select#category');
        this.wishlistLink = page.getByRole('link', { name: 'Wishlist' });
        this.homeTab = page.getByRole('link', { name: 'Home' });
        this.allDepartementsSelect = page.getByText('All departments');
        this.departementsOption = "//ul[@id='menu-all-departments-1']/li/a[text()='%s']";
    }

    async gotoMyAccountPage() {
        await this.loginAndSignupLink.click();
    }

    async selectDepartment(departmentName: string){
        await this.allDepartementsSelect.click();
        await this.page.locator(format(this.departementsOption,departmentName)).waitFor({state:'visible'});
        await this.page.locator(format(this.departementsOption,departmentName)).click();
    }

    async gotoCartPage() {
        await this.cartLink.click();
    }
}