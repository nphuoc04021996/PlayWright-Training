import { BasePage } from "./base-page";
import {Page, Locator, expect} from '@playwright/test';
import { Orderinfo } from "../model/orderInfo";
import { StringHelper } from "../utils/string-helper";

export class OrderHistoryPage extends BasePage {
    private readonly orderHistoryTable: Locator;

    constructor(page: Page) {
        super(page);
        this.orderHistoryTable = page.getByRole('table');
    } 
    
    async getListOrderHistory(): Promise<Orderinfo[]> {
        const orders: Orderinfo[] = [];
        await this.orderHistoryTable.waitFor({ state: 'visible' });
        const count = await this.orderHistoryTable.locator('tbody').getByRole('row').count();
        for (let i = 0; i < count; i++) {
            const orderRow = this.orderHistoryTable.locator('tbody').getByRole('row').nth(i);
            const orderNumber = await orderRow.getByRole('cell').nth(0).innerText();
            const orderDate = await orderRow.getByRole('cell').nth(1).innerText();
            const orderStatus = await orderRow.getByRole('cell').nth(2).innerText();
            const orderTotal = await orderRow.getByRole('cell').nth(3).innerText();
            const paymentMethod = await orderRow.getByRole('cell').nth(4).innerText();
            orders.push({ orderNumber, orderDate, email: '', total: orderTotal, paymentMethod: '' });
        }
        return orders;
    }

    async checkOrderDetailByOrderInListOrder(order: Orderinfo, orderList: Orderinfo[]): Promise<void> {
        const matchedOrder = orderList.find(o =>
        o.orderNumber.replace('#', '').trim() === order.orderNumber.trim() &&
        o.orderDate.toLowerCase().trim() === order.orderDate.toLowerCase().trim() &&
        StringHelper.extractTotal(o.total) === StringHelper.extractTotal(order.total)
        );
        expect(matchedOrder, `Order ${order.orderNumber} with date ${order.orderDate} and total ${order.total} not found`).toBeTruthy();
    }
}