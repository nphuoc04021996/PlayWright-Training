import { test } from '../fixtures/my-fixtures';
import { Utils } from '../utils/utils';

test.describe('Verify users can post a review', () => {
    test.beforeEach(async ({ homePage, adPage, myAccountPage, account }) => {
        await adPage.closeAdIfPresent();
        await homePage.gotoHomePage();
        await homePage.gotoLoginOrSignup();
        await myAccountPage.login(account.username, account.password);
  });
    test.only("Verify users can post a review", async ({ myAccountPage, shopPage, itemDetailPage }) => {
        await myAccountPage.gotoShopPage();
        await shopPage.switchToListView();
        await shopPage.selectRandomItemDetail();
        await itemDetailPage.selectReviewTab();
        const reviewContent = `This is an automated review. Please ignore. ${Utils.getCurrentDateTime()}`;
        const rating = Utils.generateRandomNumber(5) + 1;
        await itemDetailPage.postAReview(rating, reviewContent);
        await itemDetailPage.selectReviewTab();
        await itemDetailPage.checkReview(rating, reviewContent);
    });
});

