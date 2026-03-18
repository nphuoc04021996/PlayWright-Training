import { Locator, Page, expect } from '@playwright/test';
import type { Product } from "../model/product";
import { BasePage } from "./base-page";

export class ShopPage extends BasePage {
    private readonly listViewButton: Locator;
    private readonly sortBySelect: Locator;

    constructor(page: Page) {
        super(page);
        this.listViewButton = page.locator('.switch-list');
        this.sortBySelect = page.getByRole('combobox', { name: 'Shop order' });
    }

    async switchToListView(){
        await this.listViewButton.click();
    }

    async sortItemBy(option: string): Promise<void> {
        await this.sortBySelect.selectOption({ label: option });
    }

    async getListitemShopPage(): Promise<Product[]> {
        const count = await this.productCards.count();
        const promises = Array.from({ length: count }, (_, i) => this.getProductDataByIndex(i));
        const allProductData = await Promise.all(promises);
        return allProductData;
    };

    async checkProductsSortOrder(productList: Product[], direction: 'asc' | 'desc') {
        const prices = productList.map(p => parseFloat(p.price));
        const sorted = [...prices].sort((a, b) => direction === 'asc' ? a - b : b - a);
        expect(prices).toEqual(sorted);
    }

    async selectRandomItemDetail(): Promise<void> {
        const index = await this.randomNumberInList();
        const productCard = await this.getProductCartByIndex(index);
        const productLocators = await this.getProductLocator(productCard);
        await productLocators.name.click()
    }

    
}

