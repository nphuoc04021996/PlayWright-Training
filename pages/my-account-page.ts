import { Locator, Page } from '@playwright/test';
import { BasePage } from "./base-page";

export class MyAccountPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly orderHistoryLink: Locator;

    constructor(readonly page: Page) {
        super(page);
        this.usernameInput = page.getByRole('textbox', { name: 'Username or email address *' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
        this.loginButton = page.getByRole('button', { name: 'Log in' });
        this.orderHistoryLink = page.getByRole('link', { name: ' Orders' });
    }

    async fillAccountLoginForm(username: string, password: string){
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
    }

    async submitLoginForm(){
        await this.loginButton.click();
    }

    async login(username: string, password: string): Promise<void> {
        await this.fillAccountLoginForm(username, password);
        await this.submitLoginForm();
    }

    async gotoOrderHistory(): Promise<void> {
        await this.orderHistoryLink.click();
    }
}