import { SortListOption } from '../constants/sort-list-option';
import { test } from '../fixtures/my-fixtures';




test.describe.serial("Verify users can sort items by price", () =>{
    test.beforeEach(async ({ adPage, homePage }) => {
        await adPage.closeAdIfPresent();
        await homePage.gotoHomePage();
  });

    test.only("Verify users can sort items by price" , async ({ homePage, shopPage }) => {
        await homePage.gotoShopPage();
        await shopPage.switchToListView();
        await shopPage.sortItemBy(SortListOption.SORT_BY_PRICE_LOW_TO_HIGH);
        const productListLowToHigh = await shopPage.getListitemShopPage();
        await shopPage.checkProductsSortOrder(productListLowToHigh, 'asc');
        await shopPage.sortItemBy(SortListOption.SORT_BY_PRICE_HIGH_TO_LOW);
        const productListHighToLow = await shopPage.getListitemShopPage();
        await shopPage.checkProductsSortOrder(productListHighToLow, 'desc');
    });
    
});