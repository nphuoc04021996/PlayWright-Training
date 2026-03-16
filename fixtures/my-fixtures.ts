import { MyAccountPage } from "../pages/my-account-page"
import { HomePage } from "../pages/home-page"
import { DepartmentPage } from "../pages/department-page";
import { AdPage } from "../pages/ad-page";
import { CartPage } from "../pages/cart-page";
import { CheckoutPage } from "../pages/checkout-page";
import { test as base } from "@playwright/test";
import { OrderStatusPage } from "../pages/order-status-page";
import { ShopPage } from "../pages/shop-page";
import { OrderHistoryPage } from "../pages/order-history-page";
import userData from "../data/accounts-data.json";


type MyFixture = {
    myAccountPage: MyAccountPage;
    homePage: HomePage;
    departmentPage: DepartmentPage;
    adPage: AdPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    orderStatusPage: OrderStatusPage
    shopPage: ShopPage;
    orderHistoryPage: OrderHistoryPage;
    account: { username: string; password: string };
};

export const test = base.extend<MyFixture>({
    account: async ({}, use, workerInfo) => {
        const accounts = Object.values(userData);
        const account = accounts[workerInfo.workerIndex % accounts.length];
        await use(account);
    },

    myAccountPage: async ({ page }, use) => {
        const myAccountPage = new MyAccountPage(page);
        await use(myAccountPage);
    },

    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    departmentPage: async ({ page }, use) => {
        const departmentPage = new DepartmentPage(page);
        await use(departmentPage);
    },

    adPage: async ({ page }, use) => {
        const adPage = new AdPage(page);
        await use(adPage);
    },

    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },

    checkoutPage: async ({ page }, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    },

    orderStatusPage: async ({ page }, use) => {
        const orderStatusPage = new OrderStatusPage(page);
        await use(orderStatusPage);
    },

    shopPage: async ({ page }, use) => {
        const shopPage = new ShopPage(page);
        await use(shopPage);
    },

    orderHistoryPage: async ({ page }, use) => {
        const orderHistoryPage = new OrderHistoryPage(page);
        await use(orderHistoryPage);
    }
})

export {expect} from '@playwright/test';