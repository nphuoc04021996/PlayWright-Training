import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class DepartmentPage extends BasePage{
    private readonly productListAsGrid: Locator;
    private readonly productListAsViewList: Locator;
    private readonly listViewButton: Locator;
    private readonly gridViewButton: Locator;
    private readonly addToCartLinkTest: Locator;


    constructor(page: Page) {
        super(page)
        this.productListAsGrid = page.locator(".products-grid");
        this.productListAsViewList = page.locator(".products-list");
        this.listViewButton = page.locator('.switch-list');
        this.gridViewButton = page.locator('.switch-grid');
        this.addToCartLinkTest = page.locator('div.content-product').nth(6).getByRole('link', { name: /Add .* to your cart/i });
    }

    async checkItemListAsGrid(){
        await expect(this.productListAsGrid).toBeVisible(); 
    }

    async checkItemListAsList(){
        await expect(this.productListAsViewList).toBeVisible(); 
    }

    async switchToListView(){
        await this.listViewButton.click();
    }

    async switchToGridView(){
        await this.gridViewButton.click();
    }   
}