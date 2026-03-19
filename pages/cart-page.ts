import { Locator, Page, expect } from "@playwright/test";
import { Product } from '../model/product';
import { StringHelper } from "../utils/string-helper";
import { BasePage } from './base-page';

export class CartPage extends BasePage {
    private readonly cartEmptyMessage: Locator;
    private readonly cartItemsList: Locator;
    private readonly cartTable: Locator;
    private readonly clearShoppingCartLink: Locator;

    constructor(page: Page) {
        super(page);
        this.cartEmptyMessage = page.getByRole('heading', { name: 'YOUR SHOPPING CART IS EMPTY' });
        this.cartItemsList = page.getByRole('table').filter({ hasText: 'Product' });
        this.cartTable = page.locator('table.woocommerce-cart-form__contents');;
        this.clearShoppingCartLink = page.getByText('Clear shopping cart');
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

    async clearShoppingCart(): Promise<void> {
        this.clearShoppingCartLink.waitFor({ state: 'visible' });
        await this.clearShoppingCartLink.click();
        this.page.once('dialog', async dialog => {
            await dialog.accept();
    });
    }

    async getProductInTableCart(): Promise<Product[]> {
        const products: Product[] = [];
        await this.cartTable.waitFor({ state: 'visible' });
        const count = await this.cartTable.locator('tbody').getByRole('row').count();
        for (let i = 0; i < count; i++) {
            const productRow = this.cartTable.locator('tbody').getByRole('row').nth(i);
            const productName = await productRow.getByRole('cell').nth(1).locator('.product-title').innerText();
            const productPriceText = await productRow.getByRole('cell').nth(2).innerText();
            products.push({ name: productName, price: productPriceText });
        }

        return products;
    }

    async checkProductInTableCart(products: Product[]) {
        for (const product of products) {
            await this.checkProductNameInOrderDetail(product.name);
            await this.checkProductPriceOrderDetail(product.price);
        }
    }
    
    async checkProductNameInOrderDetail(productName: string): Promise<void> {
        const products = await this.getProductInTableCart();
        const productNames = products.map(p => p.name);
        expect(productNames.some(p => StringHelper.compareProductName(p, productName))).toBe(true);
    }

    async checkProductPriceOrderDetail(productPrice: string): Promise<void> {
        const products = await this.getProductInTableCart();
        const productPrices = products.map(p => p.price);
        expect(productPrices.some(p => p.includes(productPrice))).toBe(true);
    }

    async checkCartEmptyMessageDisplayed(): Promise<void> {
        await expect(this.cartEmptyMessage).toBeVisible();
    }

    private getProductRow(name: string) {
    return this.cartTable
        .locator('tbody tr')
        .filter({
            has: this.page.locator('.product-title', { hasText: name })
        }).first();
    }   

    async getQuantityOfProductInCart(name: string): Promise<string> {
        const row = this.getProductRow(name);
        const qtyInput = row.locator('input.qty');
        await qtyInput.waitFor({ state: 'visible', timeout: 10000 });
        return await qtyInput.inputValue();
    }

    async getSubtotalOfProductInCart(name: string): Promise<string> {
        const row = this.getProductRow(name);
        return (await row.getByRole('cell').nth(4).innerText()).trim();
    }

    async checkQuantityOfProductInCart(name: string, expectedQuantity: number): Promise<void> {
        const actualQuantity = parseInt(await this.getQuantityOfProductInCart(name));
        expect(actualQuantity).toBe(expectedQuantity);
    }

    async checkSubtotalOfProductInCart(name: string, expectedSubtotal: string): Promise<void> {
        const actualSubtotal = await this.getSubtotalOfProductInCart(name);
        expect(actualSubtotal).toContain(expectedSubtotal); 
    }

    async updateQuantityOfProductInCart(name: string, quantity: number): Promise<void> {
        const row = this.getProductRow(name);
        await Promise.all([
            this.page.waitForResponse(res =>
                res.url().includes('wc-ajax=get_refreshed_fragments')
            ),
           row.locator('input.qty').fill(quantity.toString()),
           row.locator('input.qty').press('Enter')
        ]);
    }

    async plusQuantityOfProductInCart(name: string): Promise<void> {
        const row = this.getProductRow(name);
        const plusButton = row.locator('.plus');
        await Promise.all([
            this.page.waitForResponse(res =>
                res.url().includes('wc-ajax=get_refreshed_fragments')
            ),
           plusButton.click()
        ]);
    }

    async minusQuantityOfProductInCart(name: string): Promise<void> {
        const row = this.getProductRow(name);
        const minusButton = row.locator('.minus');
        await Promise.all([
            this.page.waitForResponse(res =>
                res.url().includes('wc-ajax=get_refreshed_fragments')
            ),           minusButton.click()
        ]);
    }

    async calculateSubtotalByProductName(name: string, quantity: number): Promise<string> {
        const row = this.getProductRow(name);
        const priceText = await row.locator('.product-price').innerText();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const subtotal = price * quantity;
        return "$" + subtotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

}
