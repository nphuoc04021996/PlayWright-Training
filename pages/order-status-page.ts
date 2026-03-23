import { Locator, Page, expect } from '@playwright/test';
import type { Billing } from "../model/billing";
import { Orderinfo } from "../model/orderInfo";
import type { Product } from "../model/product";
import { StringHelper } from "../utils/string-helper";
import { BasePage } from "./base-page";

export class OrderStatusPage extends BasePage  {
    private readonly orderStatusMessage: Locator;
    private readonly orderDetailTable: Locator;
    private readonly billingDetails: Locator;
    private readonly orderNumber: Locator;
    private readonly orderDate: Locator;    
    private readonly orderEmail: Locator;
    private readonly orderTotal: Locator
    private readonly orderPaymentMethod: Locator;


    constructor(page: Page) {
        super(page);
        this.orderStatusMessage = page.getByRole('paragraph').getByText('Thank you. Your order has');
        this.orderDetailTable = page.getByRole('table');
        this.billingDetails = page.locator('address');
        this.orderNumber = page.getByRole('listitem').filter({ hasText: 'Order number:' }).locator('strong')
        this.orderDate = page.getByRole('listitem').filter({ hasText: 'Date:' }).locator('strong')
        this.orderEmail = page.getByRole('listitem').filter({ hasText: 'Email:' }).locator('strong')
        this.orderTotal = page.getByRole('listitem').filter({ hasText: 'Total:' }).locator('strong')
        this.orderPaymentMethod = page.getByRole('listitem').filter({ hasText: 'Payment method:' }).locator('strong');
    }

    async checkOrderPlacedSuccessfully(): Promise<void> {
        await expect(this.orderStatusMessage).toBeVisible();
    }

    async getBillingDetailsText(): Promise<string> {
        return this.billingDetails.innerText();
    }

    async getOrderDetailPaymentMethodText(): Promise<string> {
        return this.orderDetailTable.innerText();
    }

    async getListProductOnOrderDetail(): Promise<Product[]> {
            const products: Product[] = [];
            this.orderDetailTable.waitFor({ state: 'visible' });
            const count = await this.orderDetailTable.locator('tbody').getByRole('row').count();
            for (let i = 0; i < count; i++) {
                const productRow = this.orderDetailTable.locator('tbody').getByRole('row').nth(i);
                const productName = await productRow.getByRole('cell').nth(0).innerText();
                const productPriceText = await productRow.getByRole('cell').nth(1).innerText();
                products.push({ name: productName, price: productPriceText });
            }
    
            return products;
        }

    async getOrderDetailPaymentMethod(): Promise<string> {
        this.orderDetailTable.waitFor({ state: 'visible' });
        const paymentMethodValue = await this.orderDetailTable
        .locator('tfoot tr', { hasText: 'Payment method:' })
        .locator('td')
        .innerText();
        return paymentMethodValue.trim();
    }

    async checkOrderDetailBilling(expectedBillingDetails: Billing): Promise<void> {
        const actualBillingDetails = await this.getBillingDetailsText();
        expect(actualBillingDetails).toContain(expectedBillingDetails.firstName + ' ' + expectedBillingDetails.lastName);
        expect(actualBillingDetails).toContain(expectedBillingDetails.companyName);
        expect(actualBillingDetails).toContain(expectedBillingDetails.street);
        expect(actualBillingDetails).toContain(expectedBillingDetails.city);
        expect(actualBillingDetails).toContain(expectedBillingDetails.country);
        expect(actualBillingDetails).toContain(expectedBillingDetails.phone);
        expect(actualBillingDetails).toContain(expectedBillingDetails.email);
    }

    async checkProductInOrderDetail(expectedProducts: Product[]) {
        const actualProducts = await this.getListProductOnOrderDetail();

        expect(
            actualProducts.length,
            `Total product mismatch.
            Expected: ${expectedProducts.length}
            Actual: ${actualProducts.length}`
                ).toBe(expectedProducts.length);

        for (const expected of expectedProducts) {
            const actualCount = actualProducts.filter(p =>
                this.isSameProduct(p, expected)
            ).length;

            const expectedCount = expectedProducts.filter(p =>
                this.isSameProduct(p, expected)
            ).length;

            expect(
                actualCount,
                `Product mismatch:
                Name: ${expected.name}
                Price: ${expected.price}
                Expected count: ${expectedCount}
                Actual count: ${actualCount}`
                        ).toBe(expectedCount);
                    }
    }

    private isSameProduct(a: Product, b: Product): boolean {
        return (
            StringHelper.compareProductName(a.name, b.name) &&
            a.price.includes(b.price)
        );
    }

    async checkProductPaymentMethodInOrderDetail(paymentMethod: string): Promise<void> {
        const actualPaymentMethod = await this.getOrderDetailPaymentMethod();
        expect(actualPaymentMethod).toBe(paymentMethod);
    }

    async getOrderInfo(): Promise<Orderinfo> {
        await this.page.waitForLoadState('networkidle');
        const orderNumber = await this.orderNumber.innerText();
        const orderDate = await this.orderDate.innerText();
        const email = (await this.orderEmail.first().textContent())?.trim() ?? '';
        const total = await this.orderTotal.innerText();
        const paymentMethod = await this.orderPaymentMethod.innerText();
        return { orderNumber, orderDate, email, total, paymentMethod };
    }

}