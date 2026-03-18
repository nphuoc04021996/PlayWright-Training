
import { test } from '../fixtures/my-fixtures';
import { Product } from '../model/product';

test.describe('Verify users can update quantity of product in cart', () => {
    let product: Product;
    test.beforeEach(async ({ homePage, adPage, myAccountPage, account, shopPage, cartPage }) => {
        await adPage.closeAdIfPresent();
        await homePage.gotoHomePage();
        await homePage.gotoLoginOrSignup();
        await myAccountPage.login(account.username, account.password);
        await myAccountPage.gotoCartPage();
        await cartPage.clearCartIfNotEmpty();
        await homePage.gotoShopPage();
        await shopPage.switchToListView();
        product = await shopPage.selectRandomItemInList();
  });
    test.only("Verify users can update quantity of product in cart", async ({ departmentPage, cartPage }) => {
        await departmentPage.gotoCartPage();
        await cartPage.checkQuantityOfProductInCart(product.name, 1);
        await cartPage.checkSubtotalOfProductInCart(product.name, product.price);
        await cartPage.plusQuantityOfProductInCart(product.name);
        await cartPage.checkQuantityOfProductInCart(product.name, 2);
        await cartPage.checkSubtotalOfProductInCart(product.name, await cartPage.calculateSubtotalByProductName(product.name, 2));
        await cartPage.updateQuantityOfProductInCart(product.name, 4);
        await cartPage.checkQuantityOfProductInCart(product.name, 4);
        await cartPage.checkSubtotalOfProductInCart(product.name, await cartPage.calculateSubtotalByProductName(product.name, 4));
        await cartPage.minusQuantityOfProductInCart(product.name);
        await cartPage.checkQuantityOfProductInCart(product.name, 3);
        await cartPage.checkSubtotalOfProductInCart(product.name, await cartPage.calculateSubtotalByProductName(product.name, 3));
    });
});

