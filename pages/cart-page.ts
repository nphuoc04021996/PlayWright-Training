import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from './base-page';
import { Product } from '../model/product';

export class CartPage extends BasePage {
    private readonly productTable: Locator;
    private readonly productRow: string;
    private readonly productPrice: string;
    private readonly productName: string;
    private readonly proceedToCheckout: Locator;
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly countryCombobox: Locator;
    
    constructor(page: Page) {
        super(page);
        this.productTable = page.getByRole('table');
        this.productRow = 'tr.woocommerce-cart-form__cart-item';
        this.productName = '.product-title';
        this.productPrice = '.product-price .amount';
        this.proceedToCheckout = page.getByRole('link', { name: 'Proceed to checkout' });
        this.firstName = page.getByRole('textbox', { name: 'First name *' })
        this.lastName = page.getByRole('textbox', { name: 'Last name *' });
        this.countryCombobox = page.getByRole('combobox', { name: 'Country / Region' });
    }

    async getFirstProduct() {
        const firstRow = this.productTable.locator(this.productRow).first();
        const name = await firstRow.locator(this.productName).textContent();
        const price = await firstRow.locator(this.productPrice).innerText();
        return new Product(name ?? "", price);
    }

    async checkProductInCart(product: Product) {
       return await expect((await this.getFirstProduct()).getName == product.getName && (await this.getFirstProduct()).getPrice == product.getPrice).toBe(true)
    }

    async proceedCheckout() {
        await this.proceedToCheckout.click();
    }



}