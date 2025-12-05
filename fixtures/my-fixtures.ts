import { MyAccountPage } from "../pages/myaccount-page"
import { HomePage } from "../pages/home-page"
import { DepartmentPage } from "../pages/department-page";
import { AdPage } from "../pages/ad-page";
import { CartPage } from "../pages/cart-page";
import { test as base } from "@playwright/test";


type MyFixturex = {
    myAccountPage: MyAccountPage;
    homePage: HomePage;
    departmentPage: DepartmentPage;
    adPage: AdPage;
    cartPage: CartPage;
};

export const test = base.extend<MyFixturex>({
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
    }
})

export {expect} from '@playwright/test';