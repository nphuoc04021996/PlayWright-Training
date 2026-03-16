import billingJson from '../data/payment.json';
import { test } from '../fixtures/my-fixtures';
import { Utils } from "../utils/utils";
import { Product } from '../model/product';

test.describe('Verify users try to buy an item without logging in (As a guest)', () => {
  test.beforeEach(async ({ homePage,  adPage }) => {
        await adPage.closeAdIfPresent();
        await homePage.gotoHomePage();
  });
  test.only("Verify users try to buy an item without logging in (As a guest)", async ({ homePage, shopPage, checkoutPage, orderStatusPage }) => {
      await homePage.gotoShopPage();
      await shopPage.switchToListView();
      const products: Product[] = await shopPage.selectListItemInList(1);
      await shopPage.gotoTheCart();
      await shopPage.checkProductInCartMiniContent(products);
      await shopPage.proceedToCheckoutFromCartMiniContent();
      await checkoutPage.checkCheckoutPageDisplayed();
      await checkoutPage.fillBillingDetailsForm(Utils.convertJsonDataToObject(billingJson["default-payment"]));
      await checkoutPage.placeOrderProduct();
      await orderStatusPage.checkOrderPlacedSuccessfully();
    });
});

