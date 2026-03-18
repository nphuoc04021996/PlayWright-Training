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
        await expect(this.orderStatusMessage).toBeVisible({ timeout: 20000 });
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

    async checkProductInOrderDetail(products: Product[]) {
        for (const product of products) {
            await this.checkProductNameInOrderDetail(product.name);
            await this.checkProductPriceOrderDetail(product.price);
        }
    }

    async checkProductNameInOrderDetail(productName: string): Promise<void> {
        const products = await this.getListProductOnOrderDetail();
        const productNames = products.map(p => p.name);
        expect(productNames.some(p => StringHelper.compareProductName(p, productName))).toBe(true);
    }

    async checkProductPriceOrderDetail(productPrice: string): Promise<void> {
        const products = await this.getListProductOnOrderDetail();
        const productPrices = products.map(p => p.price);
        expect(productPrices.some(p => p.includes(productPrice))).toBe(true);
    }

    async checkProductPaymentMethodInOrderDetail(paymentMethod: string): Promise<void> {
        const actualPaymentMethod = await this.getOrderDetailPaymentMethod();
        expect(actualPaymentMethod).toBe(paymentMethod);
    }

    async getOrderInfo(): Promise<Orderinfo> {
        const orderNumber = await this.orderNumber.innerText();
        const orderDate = await this.orderDate.innerText();
        const email = (await this.orderEmail.first().textContent())?.trim() ?? '';
        const total = await this.orderTotal.innerText();
        const paymentMethod = await this.orderPaymentMethod.innerText();
        return { orderNumber, orderDate, email, total, paymentMethod };
    }

}