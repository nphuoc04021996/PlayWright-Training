import { test } from '../fixtures/my-fixtures';
import { Product } from '../model/product';

test.describe('Verify users can clear the cart', () => {
    let products: Product[];
    test.beforeEach(async ({ homePage, adPage, myAccountPage, account, shopPage, departmentPage, cartPage }) => {
        await adPage.closeAdIfPresent();
        await homePage.gotoHomePage();
        await homePage.gotoLoginOrSignup();
        await myAccountPage.login(account.username, account.password);
        await departmentPage.gotoCartPage();
        await cartPage.clearCartIfNotEmpty();
        await homePage.gotoShopPage();
        await shopPage.switchToListView();
        products = await shopPage.selectListItemInList(1);
  });
    test.only("Verify users can clear the cart", async ({ departmentPage, cartPage }) => {
        await departmentPage.gotoCartPage();
        await cartPage.checkProductInTableCart(products);
        await cartPage.clearShoppingCart();
        await cartPage.checkCartEmptyMessageDisplayed();
    });
});

