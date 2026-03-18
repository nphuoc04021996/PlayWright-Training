import { CheckoutField } from '../constants/checkout-field';
import billingJson from '../data/payment.json';
import { test } from '../fixtures/my-fixtures';
import { Product } from '../model/product';
import { Utils } from "../utils/utils";

test.describe('Ensure proper error handling when mandatory fields are blank', () => {
  test.beforeEach(async ({ homePage, adPage }) => {
        await adPage.closeAdIfPresent();
        await homePage.gotoHomePage();
  });
  test.only("Verify users try to buy an item without logging in (As a guest)", async ({ homePage, shopPage, checkoutPage }) => {
      await homePage.gotoShopPage();
      await shopPage.switchToListView();
      const products: Product[] = await shopPage.selectListItemInList(1);
      await shopPage.gotoTheCart();
      await shopPage.checkProductInCartMiniContent(products);
      await shopPage.proceedToCheckoutFromCartMiniContent();
      await checkoutPage.fillBillingDetailsForm(Utils.convertJsonDataToObject(billingJson["error-payment"]));
      await checkoutPage.placeOrderProduct();
      await checkoutPage.checkFieldErrorHighlighted(CheckoutField.FIRST_NAME);
      await checkoutPage.checkFieldErrorHighlighted(CheckoutField.LAST_NAME);
      await checkoutPage.checkFieldErrorHighlighted(CheckoutField.STREET_ADDRESS);
      await checkoutPage.checkFieldErrorHighlighted(CheckoutField.TOWN_CITY);
      await checkoutPage.checkFieldErrorHighlighted(CheckoutField.PHONE);
      await checkoutPage.checkFieldErrorHighlighted(CheckoutField.EMAIL_ADDRESS);
      await checkoutPage.checkErrorMessageForFieldDisplayed(CheckoutField.FIRST_NAME);
      await checkoutPage.checkErrorMessageForFieldDisplayed(CheckoutField.LAST_NAME);
      await checkoutPage.checkErrorMessageForFieldDisplayed(CheckoutField.STREET_ADDRESS);
      await checkoutPage.checkErrorMessageForFieldDisplayed(CheckoutField.TOWN_CITY);
      await checkoutPage.checkErrorMessageForFieldDisplayed(CheckoutField.PHONE);
      await checkoutPage.checkErrorMessageForFieldDisplayed(CheckoutField.EMAIL_ADDRESS);
    });
});

