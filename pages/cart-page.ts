import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from './base-page';
import { Product } from '../model/product';

export class CartPage extends BasePage {
    private readonly cartEmptyMessage: Locator;
    private readonly cartItemsList: Locator;

    constructor(page: Page) {
        super(page);
        this.cartEmptyMessage = page.getByRole('heading', { name: 'YOUR SHOPPING CART IS EMPTY' });
        this.cartItemsList = page.getByRole('table').filter({ hasText: 'Product' });
    }

    async clearCartIfNotEmpty(): Promise<void> {
        const isCartEmpty = await this.cartEmptyMessage.isVisible();
        if (!isCartEmpty) {
            await this.deleteAllItemsInCart();
        }
    }

    async deleteAllItemsInCart(): Promise<void> {
        const rowsCounts = this.cartItemsList.locator('tbody').getByRole('row').count();
        for (let i = 0; i < await rowsCounts; i++) {
            const deleteButton = this.cartItemsList.locator('tbody').getByRole('row').nth(0).getByRole('link', { name: 'Remove' });
            await deleteButton.waitFor({ state: 'visible' });
            await deleteButton.click();
        }
    }
}