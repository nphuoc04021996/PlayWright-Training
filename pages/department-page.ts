import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';
import { Product } from '../model/product';

export class DepartmentPage extends BasePage{
    private readonly productListAsGrid: Locator;
    private readonly productListAsViewList: Locator;
    private readonly ListViewButton: Locator;
    private readonly GridViewButton: Locator;
    private readonly productInList: Locator;
    private readonly addToCartLink: string;


    constructor(page: Page) {
        super(page)
        this.productListAsGrid = page.locator("//div[@class='row products products-loop products-grid with-ajax row-count-3']");
        this.productListAsViewList = page.locator("//div[@class='row products products-loop with-ajax row-count-3 products-list']");
        this.ListViewButton = page.locator('.switch-list');
        this.GridViewButton = page.locator('.switch-grid');
        this.productInList = page.locator("//div[@class='content-product ']");
        this.addToCartLink = "xpath=.//div[@class='product-excerpt']/following-sibling::a[.='Add to cart']";
    }

    async checkItemListasGrid(){
        await expect(this.productListAsGrid).toBeVisible(); 
    }

    async checkItemListasList(){
        await expect(this.productListAsViewList).toBeVisible(); 
    }

    async switchToListView(){
        await this.ListViewButton.click();
    }

    async switchToGridView(){
        await this.GridViewButton.click();
    }   

    async randomNumberinList(): Promise<number>{
        return Math.floor(Math.random() * await this.productInList.count());
    }

    async getProductDataByIndex(index: number): Promise<Product> {
        const product = this.productInList.nth(index);
        const name = await product.locator("h2.product-title a").innerText();
        const price = await product.locator(".price .woocommerce-Price-amount").last().innerText();
        const category = await product.locator(".products-page-cats a").innerText();
        const rate = await product.locator(".star-rating strong.rating").innerText();
        const description = await product.locator(".product-excerpt").innerText();
        return new Product(name, price, rate, category, description);
    }

    async selectRandomItemInList(): Promise<Product>{
        const index = await this.randomNumberinList();
        const productData = await this.getProductDataByIndex(index);
        const product = this.productInList.nth(index);
        const addToCartButton = product.locator("xpath=.//div[@class='product-excerpt']/following-sibling::a[.='Add to cart']");
        await addToCartButton.click();
        return productData;
    }
}