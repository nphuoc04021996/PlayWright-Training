import { test } from '../fixtures/my-fixtures';
import { Product } from '../model/product';



test.describe("Verify users can buy multiple item successfully", ()=>{
    test.beforeEach(async ({ homePage, myAccountPage, adPage, cartPage, departmentPage, account }) => {
        await adPage.closeAdIfPresent();
        await homePage.gotoHomePage();
        await homePage.gotoLoginOrSignup();
        await myAccountPage.login(account.username, account.password);
        await departmentPage.gotoCartPage();
        await cartPage.clearCartIfNotEmpty();
        await cartPage.gotoHomeTab();
  });

    test("Verify users can buy multiple item successfully", async ({ homePage, shopPage, checkoutPage, orderStatusPage }) => {
        await homePage.gotoShopPage();
        const products: Product[] = await shopPage.selectListItemInList(5);
        await shopPage.gotoTheCart();
        await shopPage.checkProductInCartMiniContent(products);
        await shopPage.proceedToCheckoutFromCartMiniContent();
        await checkoutPage.checkCheckoutPageDisplayed();
        await checkoutPage.placeOrderProduct();
        await orderStatusPage.checkOrderPlacedSuccessfully();
        await orderStatusPage.checkProductInOrderDetail(products);
    });
});