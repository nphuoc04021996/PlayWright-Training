import { Locator, Page } from '@playwright/test';
import type { Product } from '../model/product';

// ========== Selector Constants ==========
const SELECTORS = {
    HEADER: {
        LOGIN_SIGNUP: { role: 'link', name: 'Log in / Sign up' },
        CART: { filter: { hasText: '$' } },
        WISHLIST: { role: 'link', name: 'Wishlist' },
        MY_ACCOUNT: 'a[href*="my-account"]',
    },
    NAVIGATION: {
        HOME: { role: 'link', name: 'Home' },
        SHOP: '#menu-main-menu-1',
        ALL_DEPARTMENTS: 'All departments',
        DEPARTMENTS_LIST: 'ul#menu-all-departments-1',
    },
    SEARCH: {
        INPUT: { role: 'textbox', name: 'Search input' },
        BUTTON: 'search',
    },
    CART_MINI: {
        CONTAINER: '.et_element.et_b_header-cart > .et-mini-content',
        PRODUCTS: 'listitem',
        CHECKOUT_LINK: { role: 'link', name: 'Checkout' },
    },
    PRODUCTS: {
        CARD: 'div.content-product',
        TITLE: '.product-title a',
        PRICE: '.price .amount',
        CATEGORY: '.products-page-cats a',
        RATING: '.star-rating',
        DESCRIPTION: '.product-excerpt',
    },
} as const;

// ========== Type Definitions ==========
interface ProductLocators {
    name: Locator;
    price: Locator;
    category: Locator;
    rating: Locator;
    description: Locator;
    addToCartLink: Locator;
}

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
        this.productListInCartMiniContent = page
            .locator('.et_element.et_b_header-cart > .et-mini-content')
            .first()
            .getByRole('listitem');
        this.checkoutButtonInCartMiniContent = page.getByRole('link', { name: 'Checkout' });
        this.productCards = page.locator('div.content-product');
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
        this.initializeShuffledIndexes(count);
        const index = this.randomIndexes.pop();
        return index ?? 0;
    }

    private initializeShuffledIndexes(count: number): void {
        if (this.randomIndexes.length === 0) {
            this.randomIndexes = this.createShuffledArray(count);
        }
    }

    private createShuffledArray(length: number): number[] {
        const array = Array.from({ length }, (_, i) => i);
        // Fisher-Yates shuffle algorithm
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    async getProductCartByIndex(index: number): Promise<Locator> {
        return this.productCards.nth(index);
    }

    private getProductLocator(card: Locator): ProductLocators {
        return {
            name: card.locator(SELECTORS.PRODUCTS.TITLE),
            price: card.locator(SELECTORS.PRODUCTS.PRICE).last(),
            category: card.locator(SELECTORS.PRODUCTS.CATEGORY),
            rating: card.locator(SELECTORS.PRODUCTS.RATING),
            description: card.locator(SELECTORS.PRODUCTS.DESCRIPTION),
            addToCartLink: card.getByRole('link', { name: /Add .* to your cart/i }).nth(1)
        };
    }

    async getProductDataByIndex(index: number): Promise<Product> {
        const productCard = await this.getProductCartByIndex(index);
        const locators = this.getProductLocator(productCard);
        
        const name = await locators.name.innerText();
        const price = await locators.price.innerText();
        const category = (await locators.category.allTextContents())[0]?.trim() ?? "";
        const rate = await this.extractProductRating(locators.rating);
        const description = (await locators.description.textContent())?.trim() ?? '';

        return { name, price, category, rate, description };
    }

    private async extractProductRating(ratingLocator: Locator): Promise<string> {
        if (await ratingLocator.count() === 0) {
            return '0';
        }
        const ratingLabel = await ratingLocator.first().getAttribute('aria-label');
        return ratingLabel?.match(/Rated ([\d.]+)/)?.[1] ?? '0';
    }

    async selectRandomItemInList(): Promise<Product> {
        const index = await this.randomNumberInList();
        return await this.selectProductByIndex(index);
    }

    private async selectProductByIndex(index: number): Promise<Product> {
        const productCard = await this.getProductCartByIndex(index);
        const locators = this.getProductLocator(productCard);
        const productData = await this.getProductDataByIndex(index);
        
        await this.addProductToCart(locators.addToCartLink);
        
        return productData;
    }

    private async addProductToCart(addToCartLink: Locator): Promise<void> {
        await Promise.all([
            this.page.waitForResponse(res =>
                res.url().includes('?wc-ajax=add_to_cart')
            ),
            addToCartLink.click()
        ]);
    }

    async selectListItemInList(numberOfItem: number): Promise<Product[]> {
        this.resetRandomIndexes();
        const products: Product[] = [];

        for (let i = 0; i < numberOfItem; i++) {
            const product = await this.selectRandomItemInList();
            products.push(product);
        }

        return products;
    }

    private resetRandomIndexes(): void {
        this.randomIndexes = [];
    }
}
