import { Locator, Page } from '@playwright/test';
import type { Product } from '../model/product';

export abstract class BasePage {
    private randomIndexes: number[] = [];
    readonly page: Page;
    readonly loginAndSignupLink: Locator;
    readonly cartLink: Locator;
    readonly searchBox: Locator;
    readonly searchButton: Locator;
    readonly wishlistLink: Locator;
    readonly homeTab: Locator;
    readonly shopTab: Locator;
    readonly alldepartmentsSelect: Locator;
    readonly departmentOptionList: Locator;
    readonly productListInCartMiniContent: Locator;
    readonly checkoutButtonInCartMiniContent: Locator;
    readonly productCards: Locator;
    readonly myAccountLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginAndSignupLink = page.getByRole('link', { name: 'Log in / Sign up' });
        this.cartLink = page.getByRole('link').filter({ hasText: '$' });
        this.searchBox = page.getByRole('textbox', { name: 'Search input' });
        this.searchButton = page.getByRole('search').getByRole('button');
        this.wishlistLink = page.getByRole('link', { name: 'Wishlist' });
        this.homeTab = page.getByRole('link', { name: 'Home' });
        this.shopTab = page.locator('#menu-main-menu-1').getByRole('link', { name: 'Shop' });
        this.alldepartmentsSelect = page.getByText('All departments');
        this.departmentOptionList = page.locator('ul#menu-all-departments-1').getByRole('link');
        this.productListInCartMiniContent = page.locator('.et_element.et_b_header-cart > .et-mini-content').first().getByRole('listitem');
        this.checkoutButtonInCartMiniContent = page.getByRole('link', { name: 'Checkout' });
        this.productCards = page.locator("div.content-product");
        this.myAccountLink = page.locator('a[href*="my-account"]').first();
    }

    async gotoLoginOrSignup() {
        await this.loginAndSignupLink.click();
    }

    async gotoMypage() {
        await this.myAccountLink.click();
    }

    async selectDepartment(departmentName: string){
        await this.alldepartmentsSelect.hover();
        await this.departmentOptionList.filter({ hasText: `${departmentName}` }).click();
    }

    async gotoHomeTab(){
        await this.homeTab.click();
    }

    async getProductListDataInCartMiniContent(): Promise<Product[]> {
        const products: Product[] = [];
        const count = await this.productListInCartMiniContent.count();
        for (let i = 0; i < count; i++) {
            const productName = await this.productListInCartMiniContent.nth(i).getByRole('heading', { level: 4 }).innerText();
            const productPriceText = await this.productListInCartMiniContent.nth(i).locator('bdi').innerText();
            products.push({ name: productName, price: productPriceText });
        }

        return products;
    }

    async gotoShopPage() {
        await this.shopTab.waitFor({ state: 'visible' });
        await this.shopTab.click();
    }

    async gotoTheCart() {
        await this.cartLink.scrollIntoViewIfNeeded();
        await this.cartLink.hover();
        await this.checkoutButtonInCartMiniContent.waitFor({
            state: 'visible'
        });
    }

    async gotoCartPage() {
        await Promise.all([
            this.page.waitForURL('**/cart/**'),
            this.cartLink.click()
        ]);
    }

    async proceedToCheckoutFromCartMiniContent() {
        await this.checkoutButtonInCartMiniContent.scrollIntoViewIfNeeded();
        await this.checkoutButtonInCartMiniContent.click();
    }

    async checkProductInCartMiniContent(product: Product[]): Promise<boolean> {
        const products = await this.getProductListDataInCartMiniContent();
        return products.some(p => product.some(prod => prod.name === p.name && prod.price === p.price));
    }

    async randomNumberInList(): Promise<number> {
        const count = await this.productCards.count();
        if (this.randomIndexes.length === 0) {
            this.randomIndexes = Array.from({ length: count }, (_, i) => i);
            
            for (let i = this.randomIndexes.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.randomIndexes[i], this.randomIndexes[j]] = [this.randomIndexes[j], this.randomIndexes[i]];
            }
        }

        const index = this.randomIndexes.pop();
        
        if (index === undefined) return 0; 
        
        return index;
    }


    async getProductCartByIndex(index: number): Promise<Locator> {
        return this.productCards.nth(index);
    }

    async getProductLocator(card: Locator) {
        return {
            name: card.locator('.product-title a'),
            price: card.locator('.price .amount').last(),
            category: card.locator('.products-page-cats a'),
            rating: card.locator('.star-rating'),
            description: card.locator('.product-excerpt'),
            addToCartLink: card.getByRole('link', { name: /Add .* to your cart/i }).nth(1)
        };
    }

    async getProductDataByIndex(index: number): Promise<Product> {
        const productCard = await this.getProductCartByIndex(index);
        const locators = await this.getProductLocator(productCard);
        const name = await locators.name.innerText();
        const price = await locators.price.innerText();
        const category = (await locators.category.allTextContents())[0]?.trim() ?? "";

        let rate = '';

        if (await locators.rating.count() > 0) {
            const ratingLabel = await locators.rating.first().getAttribute('aria-label');
            rate = ratingLabel?.match(/Rated ([\d.]+)/)?.[1] ?? '0';
        }

        const description = await locators.description.innerText();

        return { name, price, category, rate, description };
    }

    async selectRandomItemInList(): Promise<Product>{
        const index = await this.randomNumberInList();
        const productCard = await this.getProductCartByIndex(index);
        const productLocators = await this.getProductLocator(productCard);
        const productData = await this.getProductDataByIndex(index);
        await Promise.all([
            this.page.waitForResponse(res =>
                res.url().includes('?wc-ajax=add_to_cart')
            ),
            productLocators.addToCartLink.click()
        ]);
        return productData;
    }

    async selectListItemInList(numberOfItem: number): Promise<Product[]> {
        const products: Product[] = []; 
        
        this.randomIndexes = []; 

        for (let i = 0; i < numberOfItem; i++) {
            const product = await this.selectRandomItemInList();
            products.push(product);
        }
        
        return products; 
    }
}
