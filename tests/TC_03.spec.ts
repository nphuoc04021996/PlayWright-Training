import { paymentMethods } from '../constants/payment-method';
import billingJson from '../data/payment.json';
import { test } from '../fixtures/my-fixtures';
import { Product } from '../model/product';
import { Utils } from "../utils/utils";


test.describe.serial("Verify users can buy an item using different payment methods (all payment methods)", ()=>{
    test.beforeEach(async ({ homePage, myAccountPage, adPage, cartPage, departmentPage, account }) => {
        await adPage.closeAdIfPresent();
        await homePage.gotoHomePage();
        await homePage.gotoLoginOrSignup();
        await myAccountPage.login(account.username, account.password);
        await departmentPage.gotoCartPage();
        await cartPage.clearCartIfNotEmpty();
        await cartPage.gotoHomeTab();
  });

    for (const paymentMethod of paymentMethods) {
        test.only(`Verify users can buy item with ${paymentMethod}`, async ({ homePage, shopPage, checkoutPage, orderStatusPage }) => {
            await homePage.gotoShopPage();
            await shopPage.switchToListView();
            const products: Product[] = await shopPage.selectListItemInList(1);
            await shopPage.gotoTheCart();
            await shopPage.checkProductInCartMiniContent(products);
            await shopPage.proceedToCheckoutFromCartMiniContent();
            await checkoutPage.fillBillingDetailsForm(Utils.convertJsonDataToObject(billingJson["default-payment"]));
            await checkoutPage.checkCheckoutPageDisplayed();
            await checkoutPage.selectPaymentMethod(paymentMethod);
            await checkoutPage.placeOrderProduct();
            await orderStatusPage.checkOrderPlacedSuccessfully();
            await orderStatusPage.checkProductPaymentMethodInOrderDetail(paymentMethod);
            await orderStatusPage.checkProductInOrderDetail(products);
        });
    }
});