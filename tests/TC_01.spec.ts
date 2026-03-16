import billingJson from '../data/payment.json';
import { test } from '../fixtures/my-fixtures';
import { DepartmentOptions } from "../constants/department-option";
import { Utils } from "../utils/utils";

test.describe('Verify users can buy an item successfully', () => {

  test.beforeEach(async ({ homePage, myAccountPage, adPage, cartPage, departmentPage, account }) => {
    await adPage.closeAdIfPresent();
    await homePage.gotoHomePage();
    await homePage.gotoLoginOrSignup();
    await myAccountPage.login(account.username, account.password);
    await homePage.selectDepartment(DepartmentOptions.ELECTRONIC_COMPONENTS_AND_SUPPLIES);
    await departmentPage.switchToGridView();
    await departmentPage.gotoCartPage();
    await cartPage.clearCartIfNotEmpty();
    await cartPage.gotoHomeTab();
  });

  test.only("Verify users can buy an item successfully", async ({ myAccountPage, departmentPage, checkoutPage, orderStatusPage }) => {
    await myAccountPage.selectDepartment(DepartmentOptions.ELECTRONIC_COMPONENTS_AND_SUPPLIES);
    await departmentPage.checkItemListAsGrid();
    await departmentPage.switchToListView();
    await departmentPage.checkItemListAsList();
    const product = await departmentPage.selectRandomItemInList();
    await departmentPage.gotoTheCart();
    await departmentPage.checkProductInCartMiniContent([product]);
    await departmentPage.proceedToCheckoutFromCartMiniContent();
    await checkoutPage.checkCheckoutPageDisplayed();
    await checkoutPage.checkProductInCart(product);
    await checkoutPage.fillBillingDetailsForm(Utils.convertJsonDataToObject(billingJson["default-payment"]));
    await checkoutPage.placeOrderProduct();
    await orderStatusPage.checkOrderPlacedSuccessfully();
    await orderStatusPage.checkOrderDetailBilling(Utils.convertJsonDataToObject(billingJson["default-payment"]));
    await orderStatusPage.checkProductInOrderDetail([product]);
    });
});

