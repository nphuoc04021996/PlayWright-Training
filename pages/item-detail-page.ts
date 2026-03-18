import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from "./base-page";

export class ItemDetailPage extends BasePage {
    private readonly reviewTab: Locator;
    private readonly reviewTextArea: Locator;
    private readonly submitReviewButton: Locator;
    constructor(page: Page) {
        super(page);
        this.reviewTab = page.getByRole('link', { name: 'Reviews (1)' });
        this.reviewTextArea = page.getByRole('textbox', { name: 'Your review *' })
        this.submitReviewButton = page.getByRole('button', { name: 'Submit' });
    }  

    async selectStarRating(star: number) {
        await this.page.locator(`.star-${star}`).first().click();
    }

    async fillReviewTextArea(review: string) {
        await this.reviewTextArea.fill(review);
    }

    async submitReview() {
        await this.submitReviewButton.click();
    }

    async selectReviewTab() {
        await this.reviewTab.click();
    }

    async postAReview(star: number, review: string) {
        await this.selectStarRating(star);
        await this.fillReviewTextArea(review);
        await this.submitReview();
    }

    async checkReviewAdded(review: string) {
        const reviewLocator = this.page
            .locator('.comment-text .description p')
            .filter({ hasText: review });
        await expect(reviewLocator).toHaveText(review);
    }

    async checkReviewWithStar(star: number) {
        const starLocator = this.page.locator('.comment-text .rating');
        await expect(starLocator).toHaveText(star.toString());
    }


    async checkReviewAddedWithStar(star: number, review: string) {
        this.checkReviewAdded(review);
        this.checkReviewWithStar(star);
    }

    async checkReview(star: number, comment: string) {
        const reviewBlock = this.page.locator('.comment-text').filter({
            has: this.page.locator('.description p', { hasText: comment })
        });

        await expect(reviewBlock).toBeVisible();
        await expect(reviewBlock.locator('.rating')).toHaveText(star.toString());
        await expect(reviewBlock.locator('.description p')).toHaveText(comment);
    }

}