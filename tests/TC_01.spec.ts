import userData from "../data/accounts-data.json";    
import { test } from '../fixtures/my-fixtures';
import { DepartmentOptions } from "../constants/department-option";
import { HomePage } from "../pages/home-page";

test.describe('Login Test', () => {

  test.beforeEach(async ({ homePage, myAccountPage, adPage,page,departmentPage }) => {
    await adPage.closeAdIfPresent();
    await homePage.gotoHomePage();
    await homePage.gotoMyAccountPage();
    await myAccountPage.login(userData.validaccount.username, userData.validaccount.password);
    await homePage.selectDepartment(DepartmentOptions.ELECTRONIC_COMPONENTS_AND_SUPPLIES);
    await departmentPage.switchToGridView();
  });

  test.only("Verify users can buy an item successfully", async ({ myAccountPage, departmentPage, cartPage }) => {
    await myAccountPage.selectDepartment(DepartmentOptions.ELECTRONIC_COMPONENTS_AND_SUPPLIES);
    await departmentPage.checkItemListasGrid();
    await departmentPage.switchToListView();
    await departmentPage.checkItemListasList();
    const product = await departmentPage.selectRandomItemInList();
    await departmentPage.gotoCartPage();
    await cartPage.checkProductInCart(product);
    });

});

