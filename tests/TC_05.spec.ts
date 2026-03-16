import { test } from '../fixtures/my-fixtures';
import { Product } from '../model/product';
import { Orderinfo } from '../model/orderInfo';
import { Utils } from "../utils/utils";
import billingJson from '../data/payment.json';

test.describe.serial("Verify orders appear in order history", () =>{
    let order1: Orderinfo;
    let order2: Orderinfo;
    test.beforeEach(async ({ homePage, myAccountPage, adPage, cartPage, departmentPage, shopPage, checkoutPage, orderStatusPage, account }) => {
        await adPage.closeAdIfPresent();
        await homePage.gotoHomePage();
        await homePage.gotoLoginOrSignup();
        await myAccountPage.login(account.username, account.password);
        await departmentPage.gotoCartPage();
        await cartPage.clearCartIfNotEmpty();
        await homePage.gotoShopPage();
        await shopPage.switchToListView();
        const products1: Product[] = await shopPage.selectListItemInList(1);
        await shopPage.gotoTheCart();
        await shopPage.proceedToCheckoutFromCartMiniContent();
        await checkoutPage.fillBillingDetailsForm(Utils.convertJsonDataToObject(billingJson["default-payment"]));
        await checkoutPage.placeOrderProduct();
        order1 = await orderStatusPage.getOrderInfo();
        await orderStatusPage.gotoShopPage();
        const products2: Product[] = await shopPage.selectListItemInList(1);
        await shopPage.gotoTheCart();
        await shopPage.proceedToCheckoutFromCartMiniContent();
        await checkoutPage.fillBillingDetailsForm(Utils.convertJsonDataToObject(billingJson["default-payment"]));
        await checkoutPage.placeOrderProduct();
        order2 = await orderStatusPage.getOrderInfo();
  });

    test.only(`Verify users can buy item with`, async ({ myAccountPage, orderStatusPage, orderHistoryPage }) => {
        await orderStatusPage.gotoMypage();
        await myAccountPage.gotoOrderHistory();
        const orderList = await orderHistoryPage.getListOrderHistory();
        await orderHistoryPage.checkOrderDetailByOrderInListOrder(order1, orderList);
        await orderHistoryPage.checkOrderDetailByOrderInListOrder(order2, orderList);
    });
});